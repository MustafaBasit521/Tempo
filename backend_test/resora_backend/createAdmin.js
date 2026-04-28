const bcrypt = require('bcrypt');
const sequelize = require('./config/db_config');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    const hash = await bcrypt.hash('123456', 10);
    console.log('Hashed password:', hash);
    
    await sequelize.query(`
      INSERT INTO Users (email, password_hash, role, reference_id)
      VALUES ('admin@scras.com', '${hash}', 'Admin', 1)
    `);
    
    console.log('Admin created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
