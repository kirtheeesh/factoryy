const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'Post@123',
    port: 5432,
});

pool.query('SELECT COUNT(*) FROM users', (err, res) => {
    if (err) {
        console.error('❌ Query failed:', err.message);
    } else {
        console.log('✅ User count:', res.rows[0].count);
    }
    pool.end();
});
