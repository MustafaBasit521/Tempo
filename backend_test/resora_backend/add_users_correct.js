const bcrypt = require('bcrypt');
const sql = require('mssql');

const dbConfig = {
  user: 'sa',
  password: 'Scras@2024',
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
    
    const hashedPassword = await bcrypt.hash('12345678', 10);
    console.log('✅ Password hashed\n');
    
    // =========================================
    // 1. ADD STUDENT USER (Ali Raza)
    // =========================================
    const studentEmail = '24l0601@lhr.nu.edu.pk';
    const studentCheck = await pool.request()
      .input('email', sql.VarChar, studentEmail)
      .query('SELECT student_id, name FROM Students WHERE email = @email');
    
    if (studentCheck.recordset.length > 0) {
      const student = studentCheck.recordset[0];
      await pool.request()
        .input('email', sql.VarChar, studentEmail)
        .input('password_hash', sql.VarChar, hashedPassword)
        .input('role', sql.VarChar, 'Student')
        .input('reference_id', sql.Int, student.student_id)
        .query(`
          IF EXISTS (SELECT 1 FROM Users WHERE email = @email)
            UPDATE Users SET password_hash = @password_hash WHERE email = @email
          ELSE
            INSERT INTO Users (email, password_hash, role, reference_id)
            VALUES (@email, @password_hash, @role, @reference_id)
        `);
      console.log(`✅ Student user: ${student.name} (${studentEmail})`);
    } else {
      console.log(`❌ Student not found: ${studentEmail}`);
    }
    
    // =========================================
    // 2. ADD TA USER (Huzaifa Khan)
    // Note: Using correct email from your insert.sql
    // =========================================
    const taEmail = 'ta.huzaifa@nu.edu.pk';  // ← From your insert.sql
    const taCheck = await pool.request()
      .input('email', sql.VarChar, taEmail)
      .query('SELECT ta_id, name FROM TAs WHERE email = @email');
    
    if (taCheck.recordset.length > 0) {
      const ta = taCheck.recordset[0];
      await pool.request()
        .input('email', sql.VarChar, taEmail)
        .input('password_hash', sql.VarChar, hashedPassword)
        .input('role', sql.VarChar, 'TA')
        .input('reference_id', sql.Int, ta.ta_id)
        .query(`
          IF EXISTS (SELECT 1 FROM Users WHERE email = @email)
            UPDATE Users SET password_hash = @password_hash WHERE email = @email
          ELSE
            INSERT INTO Users (email, password_hash, role, reference_id)
            VALUES (@email, @password_hash, @role, @reference_id)
        `);
      console.log(`✅ TA user: ${ta.name} (${taEmail})`);
    } else {
      console.log(`❌ TA not found: ${taEmail}`);
      // Show available TAs
      const tas = await pool.request().query('SELECT ta_id, name, email FROM TAs');
      console.log('\n📋 Available TAs in database:');
      tas.recordset.forEach(t => console.log(`   - ${t.name}: ${t.email}`));
    }
    
    // =========================================
    // 3. Also add the other TA (ta.sana) if exists
    // =========================================
    const taEmail2 = 'ta.sana@nu.edu.pk';
    const taCheck2 = await pool.request()
      .input('email', sql.VarChar, taEmail2)
      .query('SELECT ta_id, name FROM TAs WHERE email = @email');
    
    if (taCheck2.recordset.length > 0) {
      const ta2 = taCheck2.recordset[0];
      await pool.request()
        .input('email', sql.VarChar, taEmail2)
        .input('password_hash', sql.VarChar, hashedPassword)
        .input('role', sql.VarChar, 'TA')
        .input('reference_id', sql.Int, ta2.ta_id)
        .query(`
          IF EXISTS (SELECT 1 FROM Users WHERE email = @email)
            UPDATE Users SET password_hash = @password_hash WHERE email = @email
          ELSE
            INSERT INTO Users (email, password_hash, role, reference_id)
            VALUES (@email, @password_hash, @role, @reference_id)
        `);
      console.log(`✅ TA user: ${ta2.name} (${taEmail2})`);
    }
    
    // =========================================
    // 4. Also add Admin if not exists
    // =========================================
    const adminCheck = await pool.request()
      .query("SELECT * FROM Users WHERE role = 'Admin'");
    
    if (adminCheck.recordset.length === 0) {
      await pool.request()
        .input('email', sql.VarChar, 'admin@resora.com')
        .input('password_hash', sql.VarChar, hashedPassword)
        .input('role', sql.VarChar, 'Admin')
        .input('reference_id', sql.Int, 1)
        .query(`
          INSERT INTO Users (email, password_hash, role, reference_id)
          VALUES (@email, @password_hash, @role, @reference_id)
        `);
      console.log(`✅ Admin user created: admin@resora.com`);
    } else {
      console.log(`✅ Admin user already exists`);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL USERS ADDED/Updated SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('┌─────────────┬─────────────────────────────────┬────────────┐');
    console.log('│ Role        │ Email                           │ Password   │');
    console.log('├─────────────┼─────────────────────────────────┼────────────┤');
    console.log('│ Admin       │ admin@resora.com                │ 12345678   │');
    console.log('│ Student     │ 24l0601@lhr.nu.edu.pk           │ 12345678   │');
    console.log('│ TA          │ ta.huzaifa@nu.edu.pk            │ 12345678   │');
    console.log('│ TA (alt)    │ ta.sana@nu.edu.pk               │ 12345678   │');
    console.log('└─────────────┴─────────────────────────────────┴────────────┘');
    
    await sql.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

addUsers();
