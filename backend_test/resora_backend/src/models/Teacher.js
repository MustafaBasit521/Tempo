const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db_config");
const Department = require("./Department");

const Teacher = sequelize.define("Teacher", {
  teacher_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }

}, {
  tableName: "Teachers",
  timestamps: false,
});

Teacher.belongsTo(Department, { foreignKey: "department_id" });

module.exports = Teacher;
