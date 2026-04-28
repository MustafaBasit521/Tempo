const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db_config");

const LoginSession = sequelize.define("LoginSession", {
  session_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  user_id: DataTypes.INTEGER,
  token: DataTypes.TEXT,
  login_time: DataTypes.DATE,
  expires_at: DataTypes.DATE,
  is_active: DataTypes.BOOLEAN,

}, {
  tableName: "LoginSessions",
  timestamps: false,
});

module.exports = LoginSession;