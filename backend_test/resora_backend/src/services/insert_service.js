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
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

async function getPool() {
  return await sql.connect(dbConfig);
}

function normalizeTime(t) {
  if (!t) return null;

  if (typeof t !== "string") {
    t = String(t);
  }

  t = t.trim();

  // 08:30 → 08:30:00
  if (/^\d{2}:\d{2}$/.test(t)) {
    return t + ":00";
  }

  // already valid
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) {
    return t;
  }

  return null;
}
async function get_all_teachers() {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT
      teacher_id,
      name,
      email,
      department_id
    FROM Teachers
    ORDER BY name
  `);

  return result.recordset;
}
async function insert_all(finalData) {
  try {
    const pool = await getPool();

    // =================================
    // CLEAR OLD DATA
    // =================================
    await pool.request().query(`
      DELETE FROM Bookings;
      DELETE FROM Schedules;
      DELETE FROM TimeSlots;
      DELETE FROM TAs;
      DELETE FROM Students;
      DELETE FROM Courses;
      DELETE FROM Rooms;
      DELETE FROM Teachers;
      DELETE FROM Departments;
    `);

    console.log("✅ Old data cleared");

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
        section,
        batch_year
      } = row;

      start_time = normalizeTime(start_time);
      end_time = normalizeTime(end_time);

      // =================================
      // FIXED VALIDATION
      // teacher_name removed from required validation
      // =================================
      if (
        !department_name ||
        !course_code ||
        !room_number ||
        !day ||
        !start_time ||
        !end_time ||
        !section
      ) {
        console.log("⚠ Skipping invalid row FULL:", {
          department_name,
          teacher_name,
          course_name,
          course_code,
          room_number,
          day,
          start_time,
          end_time,
          section,
          batch_year
        });

        continue;
      }

      // =================================
      // INSERT DEPARTMENT
      // =================================
      await pool.request()
        .input("name", sql.VarChar(100), department_name)
        .query(`
          IF NOT EXISTS (
            SELECT 1 FROM Departments
            WHERE name = @name
          )
          INSERT INTO Departments (name)
          VALUES (@name)
        `);

      const deptResult = await pool.request()
        .input("name", sql.VarChar(100), department_name)
        .query(`
          SELECT department_id
          FROM Departments
          WHERE name = @name
        `);

      const department_id =
        deptResult.recordset[0].department_id;

      // =================================
      // INSERT TEACHER (optional handling)
      // =================================
      let teacher_id = null;

      if (teacher_name) {
        const email =
          teacher_name
            .toLowerCase()
            .replace(/\s+/g, ".") +
          "@university.edu";

        await pool.request()
          .input("name", sql.VarChar(100), teacher_name)
          .input("email", sql.VarChar(150), email)
          .input("department_id", sql.Int, department_id)
          .query(`
            IF NOT EXISTS (
              SELECT 1 FROM Teachers
              WHERE name = @name
            )
            INSERT INTO Teachers (
              name,
              department_id,
              email
            )
            VALUES (
              @name,
              @department_id,
              @email
            )
          `);

        const teacherResult = await pool.request()
          .input("name", sql.VarChar(100), teacher_name)
          .query(`
            SELECT teacher_id
            FROM Teachers
            WHERE name = @name
          `);

        teacher_id =
          teacherResult.recordset[0]?.teacher_id || null;
      }

      // =================================
      // INSERT ROOM
      // =================================
      const room_type =
        room_number.toLowerCase().includes("lab")
          ? "Computer Lab"
          : "Class Room";

      await pool.request()
        .input("room_number", sql.VarChar(100), room_number)
        .input("building", sql.VarChar(100), "Main Building")
        .input("floor", sql.Int, 1)
        .input("capacity", sql.Int, 60)
        .input("room_type", sql.VarChar(50), room_type)
        .query(`
          IF NOT EXISTS (
            SELECT 1 FROM Rooms
            WHERE room_number = @room_number
          )
          INSERT INTO Rooms (
            room_number,
            building,
            floor,
            capacity,
            room_type
          )
          VALUES (
            @room_number,
            @building,
            @floor,
            @capacity,
            @room_type
          )
        `);

      const roomResult = await pool.request()
        .input("room_number", sql.VarChar(100), room_number)
        .query(`
          SELECT room_id
          FROM Rooms
          WHERE room_number = @room_number
        `);

      const room_id =
        roomResult.recordset[0].room_id;

      // =================================
      // INSERT COURSE
      // =================================
      const semester =
        parseInt(section.match(/\d+/)?.[0]) || 1;

      const course_type =
        (course_name || "").toLowerCase().includes("lab")
          ? "Lab"
          : "Theory";

      await pool.request()
        .input("course_code", sql.VarChar(50), course_code)
        .input("name", sql.VarChar(150), course_name || course_code)
        .input("credit_hours", sql.Int, 3)
        .input("department_id", sql.Int, department_id)
        .input("course_type", sql.VarChar(20), course_type)
        .input("semester", sql.Int, semester)
        .input("teacher_id", sql.Int, teacher_id)
        .query(`
          IF NOT EXISTS (
            SELECT 1 FROM Courses
            WHERE course_code = @course_code
          )
          INSERT INTO Courses (
            course_code,
            name,
            credit_hours,
            department_id,
            course_type,
            semester,
            teacher_id
          )
          VALUES (
            @course_code,
            @name,
            @credit_hours,
            @department_id,
            @course_type,
            @semester,
            @teacher_id
          )
        `);

      // =================================
      // INSERT TIMESLOT (duplicate safe)
      // =================================
      await pool.request()
        .input("department_id", sql.Int, department_id)
        .input("semester", sql.Int, semester)
        .input("course_code", sql.VarChar(50), course_code)
        .input("day", sql.VarChar(20), day)
        .input("start_time", sql.VarChar(20), start_time)
        .input("end_time", sql.VarChar(20), end_time)
        .query(`
          IF NOT EXISTS (
            SELECT 1
            FROM TimeSlots
            WHERE
              department_id = @department_id
              AND semester = @semester
              AND course_code = @course_code
              AND day = @day
              AND start_time = @start_time
          )
          BEGIN
            INSERT INTO TimeSlots (
              department_id,
              semester,
              course_code,
              day,
              start_time,
              end_time
            )
            VALUES (
              @department_id,
              @semester,
              @course_code,
              @day,
              @start_time,
              @end_time
            )
          END
        `);

      const slotResult = await pool.request()
        .input("department_id", sql.Int, department_id)
        .input("semester", sql.Int, semester)
        .input("course_code", sql.VarChar(50), course_code)
        .input("day", sql.VarChar(20), day)
        .input("start_time", sql.VarChar(20), start_time)
        .query(`
          SELECT TOP 1 slot_id
          FROM TimeSlots
          WHERE
            department_id = @department_id
            AND semester = @semester
            AND course_code = @course_code
            AND day = @day
            AND start_time = @start_time
          ORDER BY slot_id DESC
        `);

      const slot_id =
        slotResult.recordset[0].slot_id;

      // =================================
      // INSERT SCHEDULE
      // =================================
      await pool.request()
        .input("course_code", sql.VarChar(50), course_code)
        .input("room_id", sql.Int, room_id)
        .input("teacher_id", sql.Int, teacher_id)
        .input("slot_id", sql.Int, slot_id)
        .input("section", sql.VarChar(50), section)
        .input("batch_year", sql.SmallInt, batch_year || 2025)
        .input("department_id", sql.Int, department_id)
        .query(`
          INSERT INTO Schedules (
            course_code,
            room_id,
            teacher_id,
            slot_id,
            section,
            batch_year,
            department_id
          )
          VALUES (
            @course_code,
            @room_id,
            @teacher_id,
            @slot_id,
            @section,
            @batch_year,
            @department_id
          )
        `);
    }

    console.log("✅ All timetable data inserted");

    return {
      message: "Insert completed successfully"
    };

  } catch (err) {
    console.error("❌ Insert failed:", err.message);
    throw err;
  }
}

module.exports = {
  insert_all,
  get_all_teachers
};