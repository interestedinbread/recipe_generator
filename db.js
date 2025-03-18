require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((error) => console.error('Database connection error:', error));

module.exports = pool;