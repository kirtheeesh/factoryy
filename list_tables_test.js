const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'Post@123',
    port: 5432,
});

pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'", (err, res) => {
    if (err) {
        console.error('❌ Query failed:', err.message);
    } else {
        console.log('✅ Tables:', res.rows.map(r => r.table_name));
    }
    pool.end();
});
