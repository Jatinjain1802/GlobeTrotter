import pool from '../config/db.js';

export const getCities = async (req, res) => {
    try {
        const [cities] = await pool.query('SELECT * FROM cities ORDER BY name ASC');
        res.json(cities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getActivities = async (req, res) => {
    try {
        const { cityId } = req.query;
        let query = 'SELECT * FROM activities';
        const params = [];

        if (cityId) {
            query += ' WHERE city_id = ?';
            params.push(cityId);
        }

        const [activities] = await pool.query(query, params);
        res.json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
