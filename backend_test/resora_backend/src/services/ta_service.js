const User = require("../models/User");
const TA = require("../models/TA");

exports.createTA = async ({ name, email, password, roll_number, department_id, teacher_id }) => {
  try {
    const user = await User.create({
      email,
      password_hash: password,
      role: "TA",
      reference_id: 0
    });

    const ta = await TA.create({
      name,
      email,
      roll_number,
      department_id,
      teacher_id,
      user_id: user.user_id
    });

    return { success: true, data: ta };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.deleteTA = async (ta_id) => {
  try {
    const ta = await TA.findByPk(ta_id);
    if (!ta) throw new Error("TA not found");

    const userId = ta.user_id;

    await TA.destroy({ where: { ta_id } });
    await User.destroy({ where: { user_id: userId } });

    return { success: true, message: "TA and user deleted" };
  } catch (err) {
    throw new Error(err.message);
  }
};

// Group by department (TA)
exports.get_ta_count_by_dept = async () => {
    const [data] = await sequelize.query(`
        SELECT 
            d.name AS department_name, 
            COUNT(t.ta_id) AS total_tas
        FROM Departments d
        LEFT JOIN TAs t ON d.department_id = t.department_id
        GROUP BY d.name
    `);
    return data;
};