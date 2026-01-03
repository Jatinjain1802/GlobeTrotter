import Trip from '../models/Trip.js';
import Stop from '../models/Stop.js';

export const createTrip = async (req, res) => {
    try {
        const { name, start_date, end_date, description, budget_est, visibility } = req.body;
        const userId = req.user.id; // From authMiddleware

        if (!name) {
            return res.status(400).json({ message: 'Trip name is required' });
        }

        const tripId = await Trip.create(userId, name, start_date, end_date, description, budget_est || 0, visibility || 'private');
        res.status(201).json({ message: 'Trip created', tripId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTrips = async (req, res) => {
    try {
        const userId = req.user.id;
        const trips = await Trip.findAllByUserId(userId);
        res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTripDetails = async (req, res) => {
    try {
        const tripId = req.params.id;
        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check ownership or visibility
        if (trip.user_id !== req.user.id && trip.visibility === 'private') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const stops = await Stop.findByTripId(tripId);

        // For each stop, get activities and calculate cost
        let totalCost = 0;
        const costBreakdown = [];

        const stopsWithActivities = await Promise.all(stops.map(async (stop) => {
            const activities = await Stop.getActivitiesForStop(stop.id);

            // Calculate duration
            // Treating start/end as inclusive, so same day = 1 day
            const arrival = new Date(stop.arrival_date);
            const departure = new Date(stop.departure_date);
            const diffTime = Math.abs(departure - arrival);
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            // Cost Index Values
            const costIndexMap = { 'LOW': 50, 'MEDIUM': 100, 'HIGH': 200 };
            const dailyCost = costIndexMap[stop.cost_index] || 100; // Default to medium

            const stayCost = days * dailyCost;

            const activitiesCost = activities.reduce((sum, act) => sum + Number(act.cost), 0);

            const stopTotalCost = stayCost + activitiesCost;
            totalCost += stopTotalCost;

            costBreakdown.push({
                city: stop.city_name,
                days,
                dailyCost,
                stayCost,
                activitiesCost,
                total: stopTotalCost
            });

            return { ...stop, activities, budget: { stayCost, activitiesCost, total: stopTotalCost } };
        }));

        res.json({
            ...trip,
            stops: stopsWithActivities,
            budget: {
                total: totalCost,
                breakdown: costBreakdown
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
