const sql = require('mssql');

const config = {
    server: 'localhost',
    database: 'mydb',
    user: 'SA',
    password: 'Admin@1234',
    port: 1433,
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
};

sql.connect(config)
    .then(() => console.log('✅ Connected!'))
    .catch(err => console.error('❌ Failed:', err.message));
