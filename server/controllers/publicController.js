import Trip from '../models/Trip.js';
import Stop from '../models/Stop.js';

export const getPublicTrip = async (req, res) => {
    try {
        const tripId = req.params.id;
        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (trip.visibility !== 'public') {
            return res.status(403).json({ message: 'This trip is private' });
        }

        const stops = await Stop.findByTripId(tripId);

        // Calculate cost (duplicated logic for MVP speed, ideally refactor to util)
        let totalCost = 0;
        const costBreakdown = [];

        const stopsWithActivities = await Promise.all(stops.map(async (stop) => {
            const activities = await Stop.getActivitiesForStop(stop.id);

            const arrival = new Date(stop.arrival_date);
            const departure = new Date(stop.departure_date);
            const diffTime = Math.abs(departure - arrival);
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            const costIndexMap = { 'LOW': 50, 'MEDIUM': 100, 'HIGH': 200 };
            const dailyCost = costIndexMap[stop.cost_index] || 100;

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
