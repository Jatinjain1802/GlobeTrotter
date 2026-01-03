import pool from '../config/db.js';

class User {
    static async create(name, email, passwordHash) {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, passwordHash]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}

export default User;
