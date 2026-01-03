import pool from '../config/db.js';

export const createExpense = async (req, res) => {
    try {
        const { trip_id, category, amount, description, date } = req.body;
        const [result] = await pool.query(
            "INSERT INTO expenses (trip_id, category, amount, description, date) VALUES (?, ?, ?, ?, ?)",
            [trip_id, category, amount, description, date]
        );
        res.json({ id: result.insertId, trip_id, category, amount, description, date });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

export const getExpensesByTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const [rows] = await pool.query("SELECT * FROM expenses WHERE trip_id = ? ORDER BY date DESC", [tripId]);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
