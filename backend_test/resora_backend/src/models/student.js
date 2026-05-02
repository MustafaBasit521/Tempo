const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db_config");
const Department = require("./Department");

const Student = sequelize.define("Student", {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  roll_number: {
    type: DataTypes.STRING(20),
    unique: true,
  },

  name: DataTypes.STRING(100),

  batch_year: DataTypes.SMALLINT,

  section: {
    type: DataTypes.STRING(5),
    allowNull: true,
  },

  department_id: DataTypes.INTEGER,

  enrollment_status: DataTypes.STRING(20),

  email: DataTypes.STRING(100),

}, {
  tableName: "Students",
  timestamps: false,
});

Student.belongsTo(Department, { foreignKey: "department_id" });

module.exports = Student;