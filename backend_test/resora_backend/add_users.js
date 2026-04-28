const bcrypt = require('bcrypt');
const sql = require('mssql');

const dbConfig = {
  user: 'sa',
  password: 'Scras@2024',  // ← Updated with your correct password
  server: 'localhost',
  database: 'Resora',
  options: { 
    encrypt: false,
    trustServerCertificate: true 
  }
};

async function addUsers() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('✅ Connected to database');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('12345678', 10);
    console.log('✅ Password hashed');
    
    // Add Student
    const studentResult = await pool.request()
      .input('email', sql.VarChar, '24l0601@lhr.nu.edu.pk')
      .query('SELECT student_id, name FROM Students WHERE email = @email');
    
    if (studentResult.recordset.length > 0) {
      const student = studentResult.recordset[0];
      await pool.request()
        .input('email', sql.VarChar, student.email)
        .input('password_hash', sql.VarChar, hashedPassword)
        .input('role', sql.VarChar, 'Student')
        .input('reference_id', sql.Int, student.student_id)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Users WHERE email = @email)
          INSERT INTO Users (email, password_hash, role, reference_id)
          VALUES (@email, @password_hash, @role, @reference_id)
          ELSE
          UPDATE Users SET password_hash = @password_hash WHERE email = @email
        `);
      console.log(`✅ Student user created: 24l0601@lhr.nu.edu.pk`);
    } else {
      console.log('⚠️ Student not found in Students table');
      // List available students
      const students = await pool.request().query('SELECT email, name FROM Students');
      console.log('Available students:', students.recordset.map(s => s.email));
    }
    
    // Add TA
    const taResult = await pool.request()
      .input('email', sql.VarChar, 'ta.sana@nu.edu.pk')
      .query('SELECT ta_id, name FROM TAs WHERE email = @email');
    
    if (taResult.recordset.length > 0) {
      const ta = taResult.recordset[0];
      await pool.request()
        .input('email', sql.VarChar, ta.email)
        .input('password_hash', sql.VarChar, hashedPassword)
        .input('role', sql.VarChar, 'TA')
        .input('reference_id', sql.Int, ta.ta_id)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Users WHERE email = @email)
          INSERT INTO Users (email, password_hash, role, reference_id)
          VALUES (@email, @password_hash, @role, @reference_id)
          ELSE
          UPDATE Users SET password_hash = @password_hash WHERE email = @email
        `);
      console.log(`✅ TA user created: ta.sana@nu.edu.pk`);
    } else {
      console.log('⚠️ TA not found in TAs table');
      // List available TAs
      const tas = await pool.request().query('SELECT email, name FROM TAs');
      console.log('Available TAs:', tas.recordset.map(t => t.email));
    }
    
    console.log('\n✅ Users added successfully!');
    console.log('\n📋 Login credentials:');
    console.log('Student: 24l0601@lhr.nu.edu.pk / 12345678');
    console.log('TA: ta.sana@nu.edu.pk / 12345678');
    
    await sql.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

addUsers();
