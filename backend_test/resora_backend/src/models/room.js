const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db_config");

const Room = sequelize.define("Room", {
  room_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  room_number: DataTypes.STRING(20),
  building: DataTypes.STRING(50),
  floor: DataTypes.INTEGER,
  capacity: DataTypes.INTEGER,
  room_type: DataTypes.STRING(20),

}, {
  tableName: "Rooms",
  timestamps: false,
});

module.exports = Room;