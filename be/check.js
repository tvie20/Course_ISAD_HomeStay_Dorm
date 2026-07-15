require('dotenv').config();
const { sql } = require('./src/config/database');

async function test() {
    const pool = await sql.connect();
    const result = await pool.request().query("SELECT definition FROM sys.check_constraints WHERE name = 'CK__KHACH_HAN__Trang__05D8E0BE'");
    console.log(result.recordset[0].definition);
    process.exit(0);
}

test().catch(console.error);
