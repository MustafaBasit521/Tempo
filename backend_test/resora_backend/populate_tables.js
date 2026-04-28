const sequelize = require('./config/db_config');

async function populate() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // =========================================
    // First, check if Departments exist
    // =========================================
    const deptCheck = await sequelize.query("SELECT * FROM Departments");
    if (deptCheck[0].length === 0) {
      console.log('📋 Adding Departments...');
      await sequelize.query(`
        INSERT INTO Departments (name) VALUES 
        ('BCS'), ('BSE'), ('BDS')
      `);
    }
    
    // =========================================
    // First, check if Teachers exist
    // =========================================
    const teacherCheck = await sequelize.query("SELECT * FROM Teachers");
    if (teacherCheck[0].length === 0) {
      console.log('📋 Adding Teachers...');
      await sequelize.query(`
        INSERT INTO Teachers (name, email, department_id) VALUES 
        ('Hina I', 'hina.i@university.edu', 1),
        ('A Qadeer', 'a.qadeer@university.edu', 2),
        ('Ali M', 'ali.m@university.edu', 3),
        ('Aamir W', 'aamir.w@university.edu', 1),
        ('Farooq Ali', 'farooq.ali@university.edu', 1)
      `);
    }
    
    // =========================================
    // Add Students
    // =========================================
    const studentCheck = await sequelize.query(
      "SELECT * FROM Students WHERE email = '24l0601@lhr.nu.edu.pk'"
    );
    
    if (studentCheck[0].length === 0) {
      console.log('📋 Adding Students...');
      await sequelize.query(`
        INSERT INTO Students (roll_number, name, batch_year, department_id, enrollment_status, email, semester)
        VALUES
        ('24L-0601','Ali Raza',2024,1,'Active','24l0601@lhr.nu.edu.pk',2),
        ('24L-0602','Ahmed Hassan',2024,1,'Active','24l0602@lhr.nu.edu.pk',2),
        ('24L-0603','Fatima Khan',2024,1,'Active','24l0603@lhr.nu.edu.pk',2),
        ('24L-0604','Ayesha Noor',2024,1,'Active','24l0604@lhr.nu.edu.pk',2),
        ('24L-0605','Hamza Tariq',2024,1,'Active','24l0605@lhr.nu.edu.pk',2),
        ('23L-1101','Huzaifa Khan',2023,2,'Active','23l1101@lhr.nu.edu.pk',4),
        ('23L-1102','Iqra Javed',2023,2,'Active','23l1102@lhr.nu.edu.pk',4),
        ('23L-1103','Abdullah Noor',2023,2,'Active','23l1103@lhr.nu.edu.pk',4),
        ('23L-1104','Noor Fatima',2023,2,'Active','23l1104@lhr.nu.edu.pk',4),
        ('23L-1105','Ayesha Siddiqui',2023,2,'Active','23l1105@lhr.nu.edu.pk',4),
        ('22L-2101','Rida Fatima',2022,3,'Active','22l2101@lhr.nu.edu.pk',6),
        ('22L-2102','Talha Raza',2022,3,'Active','22l2102@lhr.nu.edu.pk',6),
        ('22L-2103','Hira Malik',2022,3,'Active','22l2103@lhr.nu.edu.pk',6),
        ('22L-2104','Zain Ali',2022,3,'Active','22l2104@lhr.nu.edu.pk',6),
        ('22L-2105','Saif Ahmed',2022,3,'Active','22l2105@lhr.nu.edu.pk',6),
        ('21L-3001','Mustafa Ali',2021,1,'Active','21l3001@lhr.nu.edu.pk',8),
        ('21L-3002','Sana Javed',2021,1,'Active','21l3002@lhr.nu.edu.pk',8),
        ('21L-3003','Bilal Ahmed',2021,1,'Active','21l3003@lhr.nu.edu.pk',8),
        ('21L-3004','Dua Khan',2021,1,'Active','21l3004@lhr.nu.edu.pk',8),
        ('21L-3005','Areeba Shah',2021,1,'Active','21l3005@lhr.nu.edu.pk',8)
      `);
      console.log('✅ Students added');
    } else {
      console.log('✅ Students already exist');
    }
    
    // =========================================
    // Add TAs
    // =========================================
    const taCheck = await sequelize.query(
      "SELECT * FROM TAs WHERE email = 'ta.huzaifa@nu.edu.pk'"
    );
    
    if (taCheck[0].length === 0) {
      console.log('📋 Adding TAs...');
      await sequelize.query(`
        INSERT INTO TAs (roll_number, name, email, department_id, teacher_id)
        VALUES
        ('23L-1101','Huzaifa Khan','ta.huzaifa@nu.edu.pk',2,1),
        ('23L-1102','Iqra Javed','ta.iqra@nu.edu.pk',2,2),
        ('22L-2101','Rida Fatima','ta.rida@nu.edu.pk',3,3),
        ('21L-3001','Mustafa Ali','ta.mustafa@nu.edu.pk',1,4),
        ('21L-3002','Sana Javed','ta.sana@nu.edu.pk',1,5)
      `);
      console.log('✅ TAs added');
    } else {
      console.log('✅ TAs already exist');
    }
    
    console.log('\n✅ Database populated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

populate();
