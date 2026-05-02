const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db_config");

const Booking = sequelize.define("Booking", {
  booking_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  room_id: DataTypes.INTEGER,
  teacher_id: DataTypes.INTEGER,
  slot_id: DataTypes.INTEGER,
  booking_date: DataTypes.DATE,
  purpose: DataTypes.STRING(255),
  booked_by: DataTypes.INTEGER,
  status: DataTypes.STRING(20),

}, {
  tableName: "Bookings",
  timestamps: false,
});

module.exports = Booking;