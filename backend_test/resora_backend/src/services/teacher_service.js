const User = require("../models/User");
const Teacher = require("../models/Teacher");

exports.createTeacher = async ({ name, email, password, department_id }) => {
  try {
    // First create teacher record
    const teacher = await Teacher.create({
      name,
      email,
      department_id: department_id || null
    });

    // Then create user with reference_id pointing to teacher
    const user = await User.create({
      email,
      password_hash: password,
      role: "Teacher",
      reference_id: teacher.teacher_id  // ✅ Fixed: Set proper reference_id
    });

    // Update teacher with user_id
    await Teacher.update(
      { user_id: user.user_id },
      { where: { teacher_id: teacher.teacher_id } }
    );

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

// Group by department (Teachers)
exports.get_teacher_count_by_dept = async () => {
    const [data] = await sequelize.query(`
        SELECT 
            d.name AS department_name, 
            COUNT(t.teacher_id) AS total_teachers
        FROM Departments d
        LEFT JOIN Teachers t ON d.department_id = t.department_id
        GROUP BY d.name
    `);
    return data;
};