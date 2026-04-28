// =============================================
// FILE: src/services/student_service.js
// =============================================

const sequelize = require("../../config/db_config");

// =============================================
// GET STUDENT TIMETABLE
// =============================================

exports.get_student_timetable = async (student_id) => {
  try {
    const [data] = await sequelize.query(`
      SELECT
          s.schedule_id,
          s.course_code,
          c.name AS course_name,
          t.name AS teacher_name,
          r.room_number,
          ts.day,
          ts.start_time,
          ts.end_time,
          s.section,
          s.batch_year,
          d.name AS department_name

      FROM Schedules s

      JOIN Courses c
          ON s.course_code = c.course_code

      LEFT JOIN Teachers t
          ON s.teacher_id = t.teacher_id

      JOIN Rooms r
          ON s.room_id = r.room_id

      JOIN TimeSlots ts
          ON s.slot_id = ts.slot_id

      JOIN Departments d
          ON s.department_id = d.department_id

      WHERE
          s.section = (
              SELECT section
              FROM Students
              WHERE student_id = :student_id
          )

      AND s.batch_year = (
          SELECT batch_year
          FROM Students
          WHERE student_id = :student_id
      )

      AND s.department_id = (
          SELECT department_id
          FROM Students
          WHERE student_id = :student_id
      )

      ORDER BY
          ts.day,
          ts.start_time
    `, {
      replacements: {
        student_id
      }
    });

    return data;

  } catch (err) {
    throw new Error(err.message);
  }
};
// =============================================
// FILE: src/services/student_service.js
// ADD THIS ALSO
// =============================================

// =============================================
// FIND CURRENT CLASS / CLASS LOCATOR
// =============================================

exports.find_my_class = async (student_id) => {
  try {
    const [data] = await sequelize.query(`
      SELECT
          TOP 1
          s.schedule_id,
          s.course_code,
          c.name AS course_name,
          t.name AS teacher_name,
          r.room_number,
          r.building,
          ts.day,
          ts.start_time,
          ts.end_time,
          s.section,
          s.batch_year

      FROM Schedules s

      JOIN Courses c
          ON s.course_code = c.course_code

      LEFT JOIN Teachers t
          ON s.teacher_id = t.teacher_id

      JOIN Rooms r
          ON s.room_id = r.room_id

      JOIN TimeSlots ts
          ON s.slot_id = ts.slot_id

      WHERE
          s.section = (
              SELECT section
              FROM Students
              WHERE student_id = :student_id
          )

      AND s.batch_year = (
          SELECT batch_year
          FROM Students
          WHERE student_id = :student_id
      )

      AND s.department_id = (
          SELECT department_id
          FROM Students
          WHERE student_id = :student_id
      )

      AND ts.day = DATENAME(WEEKDAY, GETDATE())

      AND CAST(GETDATE() AS TIME)
          BETWEEN ts.start_time AND ts.end_time

      ORDER BY
          ts.start_time
    `, {
      replacements: {
        student_id
      }
    });

    if (!data.length) {
      return {
        message: "No class right now"
      };
    }

    return data[0];

  } catch (err) {
    throw new Error(err.message);
  }
};

// Group by enrollment status (students) --count 
exports.get_enrollment_stats = async () => {
    const [data] = await sequelize.query(`
        SELECT enrollment_status, COUNT(*) AS count
        FROM Students
        GROUP BY enrollment_status
    `);
    return data;
};

// Group by batch year (students)
exports.get_batch_stats = async () => {
    const [data] = await sequelize.query(`
        SELECT batch_year, COUNT(*) AS student_count
        FROM Students
        GROUP BY batch_year
    `);
    return data;
};

// Group by section 
exports.get_section_stats = async () => {
    const [data] = await sequelize.query(`
        SELECT section, COUNT(*) AS total_students
        FROM Students
        GROUP BY section
    `);
    return data;
};

// Group by section and batch year
exports.get_section_batch_stats = async () => {
    const [data] = await sequelize.query(`
        SELECT section, batch_year, COUNT(*) AS student_count
        FROM Students
        GROUP BY section, batch_year
        ORDER BY batch_year DESC, section ASC
    `);
    return data;
};