const express = require('express');
require('dotenv').config();

const sequelize = require('./config/db_config');
const cors = require('cors');
const app = express();

// ---------------- CORS MIDDLEWARE ----------------

// Allow frontend to connect
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// ---------------- BODY PARSER ----------------
app.use(express.json());

// ---------------- ROOT ----------------
app.get('/', (req, res) => {
  res.send('API running 🚀');
});

// ---------------- ROUTES ----------------

// ✅ Schedule Module
const schedule_routes = require('./src/routes/schedule_routes');
app.use('/schedule', schedule_routes);

// ✅ Timetable Upload
const timetable_routes = require('./src/routes/timetable_routes');
app.use('/timetable', timetable_routes);

// ✅ Auth Module
const auth_routes = require('./src/routes/auth_routes');
app.use('/auth', auth_routes);
// =============================================
// FILE: server.js
// ADD THESE LINES
// =============================================

const admin_routes = require("./src/routes/admin_routes");

app.use("/admin", admin_routes);
//1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
const teacher_routes = require("./src/routes/teacher_routes");
app.use("/teacher", teacher_routes);

const ta_routes = require("./src/routes/ta_routes");
app.use("/ta", ta_routes);

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ---------------- SERVER START ----------------
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB Connected ✅');

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} 🚀`);
    });

  } catch (err) {
    console.error('DB Connection Failed ❌:', err.message);
    process.exit(1);
  }
};

startServer();