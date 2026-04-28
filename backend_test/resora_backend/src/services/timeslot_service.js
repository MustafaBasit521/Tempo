const sequelize = require("../../config/db_config");

// CREATE TIMESLOT
exports.create_timeslot = async (data) => {
  const { department_id, semester, course_code, day, start_time, end_time } = data;

  try {
    const [result] = await sequelize.query(`
      INSERT INTO TimeSlots (department_id, semester, course_code, day, start_time, end_time)
      OUTPUT INSERTED.slot_id
      VALUES (:department_id, :semester, :course_code, :day, :start_time, :end_time)
    `, {
      replacements: { department_id, semester, course_code, day, start_time, end_time }
    });

    return result[0]; // returns slot_id

  } catch (err) {
    throw new Error(err.message);
  }
};

// GET ALL TIMESLOTS
exports.get_all_timeslots = async () => {
  const [data] = await sequelize.query(`SELECT * FROM TimeSlots`);
  return data;
};

// DELETE TIMESLOT
exports.delete_timeslot = async (id) => {
  await sequelize.query(`
    DELETE FROM TimeSlots WHERE slot_id = :id
  `, {
    replacements: { id }
  });

  return { success: true };
};

// Get specific time (find slots starting at a specific time)
exports.get_slots_by_start_time = async (start_time) => {
    const [data] = await sequelize.query(`
        SELECT * FROM TimeSlots 
        WHERE start_time = :start_time
    `, {
        replacements: { start_time }
    });
    return data;
};

// Group by course code (time slots)
exports.get_slot_count_by_course = async () => {
    const [data] = await sequelize.query(`
        SELECT course_code, COUNT(*) AS total_slots
        FROM TimeSlots
        GROUP BY course_code
    `);
    return data;
};