const sql = require("mssql");

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function getPool() {
  return await sql.connect(dbConfig);
}

function normalizeTime(t) {
  if (!t) return null;
  if (typeof t !== "string") t = String(t);
  t = t.trim();

  if (/^\d{2}:\d{2}$/.test(t)) return t + ":00";
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;

  return null;
}

async function insert_all(finalData) {
  try {
    const pool = await getPool();

    await pool.request().query(`
      DELETE FROM RoomBookings;
      DELETE FROM Schedules;
      DELETE FROM TimeSlots;

      DELETE FROM Courses;
      DELETE FROM Rooms;
      DELETE FROM Teachers;
      DELETE FROM Departments;
    `);

    const seen = new Set();

    for (const row of finalData) {
      let {
        department_name,
        teacher_name,
        course_name,
        course_code,
        room_number,
        day,
        start_time,
        end_time,
        section
      } = row;

      if (section && section.includes("-")) {
        section = section.split("-").pop();
      }

      section = section?.trim();
      start_time = normalizeTime(start_time);
      end_time = normalizeTime(end_time);

      if (!department_name || !course_code || !room_number || !day || !start_time || !end_time || !section) continue;

      // =============================
      // DEPARTMENT
      // =============================
      await pool.request()
        .input("name", sql.VarChar(100), department_name)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Departments WHERE name = @name)
          INSERT INTO Departments (name) VALUES (@name)
        `);

      const dept = await pool.request()
        .input("name", sql.VarChar(100), department_name)
        .query(`SELECT department_id FROM Departments WHERE name = @name`);

      const department_id = dept.recordset[0].department_id;

      // =============================
      // TEACHER
      // =============================
      let teacher_id = null;

      if (teacher_name) {
        const email = teacher_name.toLowerCase().replace(/\s+/g, ".") + "@uni.edu";

        await pool.request()
          .input("name", sql.VarChar(100), teacher_name)
          .input("email", sql.VarChar(100), email)
          .input("department_id", sql.Int, department_id)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM Teachers WHERE name = @name)
            INSERT INTO Teachers (name, department_id, email)
            VALUES (@name, @department_id, @email)
          `);

        const t = await pool.request()
          .input("name", sql.VarChar(100), teacher_name)
          .query(`SELECT teacher_id FROM Teachers WHERE name = @name`);

        teacher_id = t.recordset[0]?.teacher_id || null;
      }

      // =============================
      // ROOM (ALL REQUIRED FIELDS FIXED)
      // =============================
      let room_type = "Class Room";
      if (room_number.toLowerCase().includes("lab")) {
        room_type = "Computer Lab";
      }

      await pool.request()
        .input("room_number", sql.VarChar(100), room_number)
        .input("building", sql.VarChar(100), "Campus")
        .input("floor", sql.Int, 1)
        .input("capacity", sql.Int, 60)
        .input("room_type", sql.VarChar(20), room_type)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Rooms WHERE room_number = @room_number)
          INSERT INTO Rooms (room_number, building, floor, capacity, room_type)
          VALUES (@room_number, @building, @floor, @capacity, @room_type)
        `);

      const roomRes = await pool.request()
        .input("room_number", sql.VarChar(100), room_number)
        .query(`SELECT room_id FROM Rooms WHERE room_number = @room_number`);

      const room_id = roomRes.recordset[0].room_id;

      // =============================
      // COURSE (teacher_id handled)
      // =============================
      await pool.request()
        .input("course_code", sql.VarChar(20), course_code)
        .input("name", sql.VarChar(100), course_name || course_code)
        .input("credit_hours", sql.Int, 3)
        .input("department_id", sql.Int, department_id)
        .input("course_type", sql.VarChar(10), "Theory")
        .input("semester", sql.Int, 1)
        .input("teacher_id", sql.Int, teacher_id)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Courses WHERE course_code = @course_code)
          INSERT INTO Courses (course_code, name, credit_hours, department_id, course_type, semester, teacher_id)
          VALUES (@course_code, @name, @credit_hours, @department_id, @course_type, @semester, @teacher_id)
        `);

      // =============================
      // TIMESLOT (FULL REQUIRED FIELDS)
      // =============================
      await pool.request()
        .input("department_id", sql.Int, department_id)
        .input("semester", sql.Int, 1)
        .input("course_code", sql.VarChar(20), course_code)
        .input("day", sql.VarChar(10), day)
        .input("start_time", sql.VarChar(20), start_time)
        .input("end_time", sql.VarChar(20), end_time)
        .query(`
          IF NOT EXISTS (
            SELECT 1 FROM TimeSlots
            WHERE department_id=@department_id AND course_code=@course_code AND day=@day AND start_time=@start_time
          )
          INSERT INTO TimeSlots (department_id, semester, course_code, day, start_time, end_time)
          VALUES (@department_id, @semester, @course_code, @day, @start_time, @end_time)
        `);

      const slotRes = await pool.request()
        .input("department_id", sql.Int, department_id)
        .input("course_code", sql.VarChar(20), course_code)
        .input("day", sql.VarChar(10), day)
        .input("start_time", sql.VarChar(20), start_time)
        .query(`
          SELECT TOP 1 slot_id FROM TimeSlots
          WHERE department_id=@department_id AND course_code=@course_code AND day=@day AND start_time=@start_time
        `);

      const slot_id = slotRes.recordset[0].slot_id;

      // =============================
      // SCHEDULE
      // =============================
      const key = `${department_id}-${section}-${slot_id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      await pool.request()
        .input("course_code", sql.VarChar(20), course_code)
        .input("room_id", sql.Int, room_id)
        .input("teacher_id", sql.Int, teacher_id)
        .input("slot_id", sql.Int, slot_id)
        .input("section", sql.VarChar(50), section)
        .input("department_id", sql.Int, department_id)
        .query(`
          IF NOT EXISTS (
            SELECT 1 FROM Schedules
            WHERE section=@section AND slot_id=@slot_id AND department_id=@department_id
          )
          INSERT INTO Schedules (
            course_code, room_id, teacher_id, slot_id, section, department_id
          )
          VALUES (
            @course_code, @room_id, @teacher_id, @slot_id, @section, @department_id
          )
        `);
    }

    return { message: "Insert completed successfully" };

  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  insert_all
};