const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db_config");

const TA = sequelize.define("TA", {
  ta_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  roll_number: DataTypes.STRING(20),
  name: DataTypes.STRING(100),
  email: DataTypes.STRING(100),
  department_id: DataTypes.INTEGER,
  teacher_id: DataTypes.INTEGER,

}, {
  tableName: "TAs",
  timestamps: false,
});

module.exports = TA;