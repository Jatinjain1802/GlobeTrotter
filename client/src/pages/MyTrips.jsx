import React, { useEffect, useState } from "react";
import TripCard from "../components/TripCard.jsx";
import dayjs from "dayjs";
import api from "../services/api";

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const { data } = await api.get('/trips');
                setTrips(data);
            } catch (error) {
                console.error("Error fetching trips:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    if (loading) return <div className="text-center py-10">Loading trips...</div>;

    const now = dayjs();
    const ongoing = trips.filter(t => t.start_date && t.end_date && now.isAfter(dayjs(t.start_date)) && now.isBefore(dayjs(t.end_date)));
    const upcoming = trips.filter(t => t.start_date && now.isBefore(dayjs(t.start_date)));
    const completed = trips.filter(t => t.end_date && now.isAfter(dayjs(t.end_date)));
    const unscheduled = trips.filter(t => !t.start_date);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Trips</h1>

            {ongoing.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center tracking-tight">
                        <span className="w-3 h-3 rounded-full bg-brand-primary mr-3 animate-pulse shadow-lg shadow-brand-primary/50"></span>
                        Ongoing Adventures
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ongoing.map(trip => <TripCard key={trip.id} trip={trip} />)}
                    </div>
                </section>
            )}

            {upcoming.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight border-l-4 border-brand-secondary pl-3">Upcoming Trips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcoming.map(trip => <TripCard key={trip.id} trip={trip} />)}
                    </div>
                </section>
            )}

            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-6 text-gray-500 tracking-tight">All Other Trips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...unscheduled, ...completed].length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">No other trips found.</p>
                        </div>
                    ) : (
                        [...unscheduled, ...completed].map(trip => <TripCard key={trip.id} trip={trip} />)
                    )}
                </div>
            </section>
        </div>
    );
};

export default MyTrips;
