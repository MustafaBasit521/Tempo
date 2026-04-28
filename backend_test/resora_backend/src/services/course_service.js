const sequelize = require("../../config/db_config");

// CREATE COURSE
exports.create_course = async (data) => {
  const { course_code, name, credit_hours, department_id, course_type, semester, teacher_id } = data;

  try {
    await sequelize.query(`
      INSERT INTO Courses (course_code, name, credit_hours, department_id, course_type, semester, teacher_id)
      VALUES (:course_code, :name, :credit_hours, :department_id, :course_type, :semester, :teacher_id)
    `, {
      replacements: { course_code, name, credit_hours, department_id, course_type, semester, teacher_id }
    });

    return { success: true };

  } catch (err) {
    throw new Error(err.message);
  }
};

// GET ALL COURSES
exports.get_all_courses = async () => {
  const [data] = await sequelize.query(`SELECT * FROM Courses`);
  return data;
};

// DELETE COURSE
exports.delete_course = async (code) => {
  await sequelize.query(`
    DELETE FROM Courses WHERE course_code = :code
  `, {
    replacements: { code }
  });

  return { success: true };
};