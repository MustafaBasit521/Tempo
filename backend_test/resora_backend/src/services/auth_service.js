const sql = require("mssql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// =====================================
// LOGOUT
// =====================================
async function logout(token) {
  try {
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("token", sql.VarChar, token)
      .query(`
        UPDATE LoginSessions
        SET is_active = 0
        WHERE token = @token
      `);

    return true;

  } catch (err) {
    throw new Error(err.message);
  }
}

// =====================================
// LOGIN
// =====================================
async function login(email, password) {
  try {
    const pool = await sql.connect(dbConfig);

    // =====================================
    // 1. GET USER BY EMAIL
    // =====================================
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query(`
        SELECT
          user_id,
          name,
          email,
          password_hash,
          role,
          reference_id
        FROM Users
        WHERE email = @email
      `);

    if (!result.recordset.length) {
      return null;
    }

    const user = result.recordset[0];

    // =====================================
    // 2. CHECK PASSWORD
    // =====================================
    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return null;
    }

    // =====================================
    // 3. DEACTIVATE OLD ACTIVE SESSIONS
    // =====================================
    await pool.request()
      .input("user_id", sql.Int, user.user_id)
      .query(`
        UPDATE LoginSessions
        SET is_active = 0
        WHERE user_id = @user_id
          AND is_active = 1
          AND expires_at > GETDATE()
      `);

    console.log("✅ Old active sessions deactivated");

    // =====================================
    // 4. GENERATE JWT TOKEN (2 HOURS)
    // =====================================
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        reference_id: user.reference_id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );

    // =====================================
    // 5. SAVE LOGIN SESSION
    // =====================================
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    await pool.request()
      .input("user_id", sql.Int, user.user_id)
      .input("token", sql.VarChar, token)
      .input("expires_at", sql.DateTime, expiresAt)
      .query(`
        INSERT INTO LoginSessions (
          user_id,
          token,
          expires_at,
          is_active
        )
        VALUES (
          @user_id,
          @token,
          @expires_at,
          1
        )
      `);

    console.log("✅ Login session saved");

    // =====================================
    // 6. RETURN TOKEN TO FRONTEND
    // =====================================
    return {
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        reference_id: user.reference_id
      }
    };

  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  login,
  logout
};