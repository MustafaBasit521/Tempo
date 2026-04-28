const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db_config");

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },

  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM("Admin", "Teacher", "Student", "TA"),
    allowNull: false,
  },

  reference_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }

}, {
  tableName: "Users",
  timestamps: false,
});

module.exports = User;