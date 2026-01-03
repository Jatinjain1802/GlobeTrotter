import pool from '../config/db.js';

class Trip {
    static async create(userId, name, startDate, endDate, description, budgetEst, visibility) {
        const [result] = await pool.query(
            'INSERT INTO trips (user_id, name, start_date, end_date, description, budget_est, visibility) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, name, startDate, endDate, description, budgetEst, visibility]
        );
        return result.insertId;
    }

    static async findAllByUserId(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM trips WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async delete(id) {
        const [result] = await pool.query(
            'DELETE FROM trips WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

export default Trip;
