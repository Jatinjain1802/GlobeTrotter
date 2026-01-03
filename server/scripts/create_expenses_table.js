const pool = require('../db');

async function migrate() {
    try {
        console.log("Creating expenses table...");
        await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        trip_id INTEGER REFERENCES trips(id),
        category VARCHAR(50),
        amount DECIMAL(10, 2),
        description TEXT,
        date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Expenses table created.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        pool.end();
    }
}

migrate();
