import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            // password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        console.log('Connected to MySQL server.');

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = await fs.readFile(schemaPath, 'utf8');

        console.log('Executing schema...');
        await connection.query(schemaSql);

        console.log('Database seeded successfully!');
        await connection.end();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
