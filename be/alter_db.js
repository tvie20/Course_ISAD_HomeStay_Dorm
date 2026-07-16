const sql = require('mssql');
require('dotenv').config({ path: 'be/.env' });

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '123456',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'HomeStayDorm',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function alterDb() {
    try {
        await sql.connect(config);
        
        try {
            await sql.query("ALTER TABLE DOI_SOAT_HOAN_COC ADD MaPhieuCoc CHAR(6);");
            console.log('Added MaPhieuCoc column successfully.');
        } catch (e) {
            console.log('Column might already exist:', e.message);
        }

    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
alterDb();
