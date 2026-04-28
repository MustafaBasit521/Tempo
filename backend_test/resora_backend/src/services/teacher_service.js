const User = require("../models/User");
const Teacher = require("../models/Teacher");

exports.createTeacher = async ({ name, email, password, department_id }) => {
  try {
    const user = await User.create({
      email,
      password_hash: password,
      role: "Teacher",
      reference_id: 0
    });

    const teacher = await Teacher.create({
      name,
      email,
      user_id: user.user_id,
      department_id: department_id || null
    });

    return { success: true, data: teacher };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.deleteTeacher = async (teacher_id) => {
  try {
    const teacher = await Teacher.findByPk(teacher_id);
    if (!teacher) throw new Error("Teacher not found");

    const userId = teacher.user_id;

    await Teacher.destroy({ where: { teacher_id } });
    await User.destroy({ where: { user_id: userId } });

    return { success: true, message: "Teacher and user deleted" };
  } catch (err) {
    throw new Error(err.message);
  }
};

// Complex Nested Query: Find teachers who are teaching more than the average number of courses
exports.get_high_workload_teachers = async () => {
    const [data] = await sequelize.query(`
        SELECT name, email 
        FROM Teachers 
        WHERE teacher_id IN (
            SELECT teacher_id 
            FROM Courses 
            GROUP BY teacher_id 
            HAVING COUNT(course_code) > (
                SELECT AVG(course_count) 
                FROM (
                    SELECT COUNT(course_code) AS course_count 
                    FROM Courses 
                    GROUP BY teacher_id
                ) AS AvgCounts
            )
        )
    `);
    return data;
};