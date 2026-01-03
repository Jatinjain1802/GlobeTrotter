const pool = require('../db');

async function migrate() {
    try {
        console.log("Starting migration: Add cover_photo_url to trips table");
        await pool.query('ALTER TABLE trips ADD COLUMN IF NOT EXISTS cover_photo_url TEXT;');
        console.log("Migration successful");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        pool.end();
    }
}

migrate();
