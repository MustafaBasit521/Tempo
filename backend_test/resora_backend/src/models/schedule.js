const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db_config");

const Schedule = sequelize.define("Schedule", {
  schedule_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  course_code: DataTypes.STRING(20),
  room_id: DataTypes.INTEGER,
  teacher_id: DataTypes.INTEGER,
  slot_id: DataTypes.INTEGER,
  section: DataTypes.STRING(5),
  batch_year: DataTypes.SMALLINT,
  department_id: DataTypes.INTEGER,

}, {
  tableName: "Schedules",
  timestamps: false,
});

module.exports = Schedule;