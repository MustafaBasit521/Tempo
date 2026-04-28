const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db_config");

const Department = sequelize.define("Department", {
  department_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  }

}, {
  tableName: "Departments",
  timestamps: false,
});

module.exports = Department;