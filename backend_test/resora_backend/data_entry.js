const bcrypt = require("bcrypt");
const sql = require("mssql");
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

async function insertUsers() {
  try {
    const pool = await sql.connect(dbConfig);

    // =====================================
    // 1. DELETE OLD USERS DATA
    // =====================================
    await pool.request().query(`
      DELETE FROM Users
    `);

    console.log("✅ Old Users data deleted");

    // =====================================
    // 2. HASH PASSWORD
    // =====================================
    const plainPassword = "12345678";
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    console.log("Generated Hash:", passwordHash);

    // =====================================
    // 3. USERS DATA
    // =====================================
    const users = [
      // ADMIN
      {
        name: "Subhan",
        email: "admin@resora.com",
        role: "Admin",
        reference_id: 1
      },

      // =========================
      // STUDENTS
      // =========================
      {
        email: "24l0601@lhr.nu.edu.pk",
        role: "Student",
        referenceQuery: `
          SELECT student_id AS reference_id, name
          FROM Students
          WHERE email = '24l0601@lhr.nu.edu.pk'
        `
      },
      {
        email: "23l1101@lhr.nu.edu.pk",
        role: "Student",
        referenceQuery: `
          SELECT student_id AS reference_id, name
          FROM Students
          WHERE email = '23l1101@lhr.nu.edu.pk'
        `
      },
      {
        email: "22l2101@lhr.nu.edu.pk",
        role: "Student",
        referenceQuery: `
          SELECT student_id AS reference_id, name
          FROM Students
          WHERE email = '22l2101@lhr.nu.edu.pk'
        `
      },

      // =========================
      // TEACHERS
      // =========================
      {
        email: "hina.i@uni.edu.pk",
        role: "Teacher",
        referenceQuery: `
          SELECT teacher_id AS reference_id, name
          FROM Teachers
          WHERE email = 'hina.i@uni.edu.pk'
        `
      },
      {
        email: "a.qadeer@uni.edu.pk",
        role: "Teacher",
        referenceQuery: `
          SELECT teacher_id AS reference_id, name
          FROM Teachers
          WHERE email = 'a.qadeer@uni.edu.pk'
        `
      },
      {
        email: "aamir.w@uni.edu.pk",
        role: "Teacher",
        referenceQuery: `
          SELECT teacher_id AS reference_id, name
          FROM Teachers
          WHERE email = 'aamir.w@uni.edu.pk'
        `
      },

      // =========================
      // TAs
      // =========================
      {
        email: "ta.sana@nu.edu.pk",
        role: "TA",
        referenceQuery: `
          SELECT ta_id AS reference_id, name
          FROM TAs
          WHERE email = 'ta.sana@nu.edu.pk'
        `
      },
      {
        email: "ta.mustafa@nu.edu.pk",
        role: "TA",
        referenceQuery: `
          SELECT ta_id AS reference_id, name
          FROM TAs
          WHERE email = 'ta.mustafa@nu.edu.pk'
        `
      },
      {
        email: "ta.iqra@nu.edu.pk",
        role: "TA",
        referenceQuery: `
          SELECT ta_id AS reference_id, name
          FROM TAs
          WHERE email = 'ta.iqra@nu.edu.pk'
        `
      }
    ];

    // =====================================
    // 4. INSERT USERS
    // =====================================
    for (const user of users) {
      let name = user.name;
      let reference_id = user.reference_id;

      if (user.role !== "Admin") {
        const refResult = await pool.request().query(user.referenceQuery);

        if (!refResult.recordset.length) {
          console.log(`⚠ Skipped: ${user.email} not found`);
          continue;
        }

        name = refResult.recordset[0].name;
        reference_id = refResult.recordset[0].reference_id;
      }

      await pool.request()
        .input("name", sql.VarChar, name)
        .input("email", sql.VarChar, user.email)
        .input("password_hash", sql.VarChar, passwordHash)
        .input("role", sql.VarChar, user.role)
        .input("reference_id", sql.Int, reference_id)
        .query(`
          INSERT INTO Users (
            name,
            email,
            password_hash,
            role,
            reference_id
          )
          VALUES (
            @name,
            @email,
            @password_hash,
            @role,
            @reference_id
          )
        `);

      console.log(`✅ Inserted: ${name} (${user.role})`);
    }

    console.log("\n🎉 All users inserted successfully");
    await sql.close();

  } catch (err) {
    console.error("❌ Insert failed:", err.message);
  }
}

insertUsers();