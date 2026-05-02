const { Sequelize } = require("sequelize");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const sequelize = new Sequelize(
  "Resora",      // database
  "sa",          // user
  process.env.DB_PASSWORD,  // password
  {
    host: "localhost",
    port: 1433,
    dialect: "mssql",
    dialectOptions: {
      options: {
        trustServerCertificate: true,
        encrypt: false,
      },
    },
    logging: false,
  }
);

// Remove the authenticate call from here - let server.js handle it

module.exports = sequelize;