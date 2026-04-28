const sequelize = require("../../config/db_config");

// ✅ CREATE DEPARTMENT
exports.create_department = async ({ name }) => {
  try {
    await sequelize.query(`
      INSERT INTO Departments (name)
      VALUES (:name)
    `, {
      replacements: { name }
    });

    return { success: true };

  } catch (err) {
    throw new Error(err.message);
  }
};

// ✅ GET ALL DEPARTMENTS
exports.get_all_departments = async () => {
  try {
    const [data] = await sequelize.query(`
      SELECT * FROM Departments
    `);

    return data;

  } catch (err) {
    throw new Error(err.message);
  }
};

// ✅ DELETE DEPARTMENT
exports.delete_department = async (id) => {
  try {
    await sequelize.query(`
      DELETE FROM Departments
      WHERE department_id = :id
    `, {
      replacements: { id }
    });

    return { success: true };

  } catch (err) {
    throw new Error(err.message);
  }
};
