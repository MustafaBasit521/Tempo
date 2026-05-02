const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db_config");
const Department = require("./Department");
const Teacher = require("./Teacher");

const Course = sequelize.define("Course", {
  course_code: {
    type: DataTypes.STRING(20),
    primaryKey: true,
  },

  name: DataTypes.STRING(100),

  credit_hours: DataTypes.INTEGER,

  department_id: DataTypes.INTEGER,

  course_type: DataTypes.STRING(20),

  semester: DataTypes.INTEGER,

  teacher_id: DataTypes.INTEGER,

}, {
  tableName: "Courses",
  timestamps: false,
});

Course.belongsTo(Department, { foreignKey: "department_id" });
Course.belongsTo(Teacher, { foreignKey: "teacher_id" });

module.exports = Course;