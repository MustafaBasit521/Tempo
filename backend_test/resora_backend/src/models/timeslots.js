const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db_config");

const TimeSlot = sequelize.define("TimeSlot", {
  slot_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  department_id: DataTypes.INTEGER,
  semester: DataTypes.INTEGER,
  course_code: DataTypes.STRING(20),

  day: DataTypes.STRING(10),
  start_time: DataTypes.TIME,
  end_time: DataTypes.TIME,

}, {
  tableName: "TimeSlots",
  timestamps: false,
});

module.exports = TimeSlot;