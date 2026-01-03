import pool from '../config/db.js';

class Stop {
    static async create(tripId, cityId, arrivalDate, departureDate, orderIndex) {
        const [result] = await pool.query(
            'INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, order_index) VALUES (?, ?, ?, ?, ?)',
            [tripId, cityId, arrivalDate, departureDate, orderIndex]
        );
        return result.insertId;
    }

    static async findByTripId(tripId) {
        // Join with cities to get city details
        const [rows] = await pool.query(`
      SELECT ts.*, c.name as city_name, c.country, c.cost_index, c.image_url 
      FROM trip_stops ts
      JOIN cities c ON ts.city_id = c.id
      WHERE ts.trip_id = ?
      ORDER BY ts.order_index ASC
    `, [tripId]);
        return rows;
    }

    static async addActivity(tripStopId, activityId, dayNumber) {
        const [result] = await pool.query(
            'INSERT INTO trip_activities (trip_stop_id, activity_id, day_number) VALUES (?, ?, ?)',
            [tripStopId, activityId, dayNumber]
        );
        return result.insertId;
    }

    static async getActivitiesForStop(tripStopId) {
        const [rows] = await pool.query(`
      SELECT ta.*, a.name, a.cost, a.type
      FROM trip_activities ta
      JOIN activities a ON ta.activity_id = a.id
      WHERE ta.trip_stop_id = ?
    `, [tripStopId]);
        return rows;
    }
}

export default Stop;
