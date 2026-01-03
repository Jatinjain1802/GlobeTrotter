import Stop from '../models/Stop.js';
import Trip from '../models/Trip.js';

export const addStop = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { city_id, arrival_date, departure_date, order_index } = req.body;

        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        if (trip.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const stopId = await Stop.create(tripId, city_id, arrival_date, departure_date, order_index);
        res.status(201).json({ message: 'Stop added', stopId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addActivityToStop = async (req, res) => {
    try {
        const { stopId } = req.params;
        const { activity_id, day_number } = req.body;
        await Stop.addActivity(stopId, activity_id, day_number || 1);
        res.status(201).json({ message: 'Activity added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getStopsByTripId = async (req, res) => {
    try {
        const { tripId } = req.params;
        const trip = await Trip.findById(tripId);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        if (trip.user_id !== req.user.id && trip.visibility !== 'public') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const stops = await Stop.findByTripId(tripId);
        res.json(stops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
