import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import BudgetChart from '../components/BudgetChart';
import { Calendar, DollarSign, Home, MapPin, Compass } from 'lucide-react';

const PublicTrip = () => {
    const { shareId } = useParams(); // Note: Route param is shareId, simplifies to tripId
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/public/trips/${shareId}`);
                setTrip(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Trip not found or it is private.');
                setLoading(false);
            }
        };
        fetchTrip();
    }, [shareId]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto mb-8">
                <Link to="/">
                    <Button variant="outline" className="mb-4 hover:bg-white text-gray-700 font-medium"><Home size={16} className="mr-2" /> Back to Home</Button>
                </Link>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Itinerary */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Compass size={120} />
                        </div>
                        <div className="relative z-10">
                            <span className="inline-block bg-brand-accent text-brand-secondary text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold mb-4 border border-brand-primary/20">Public Itinerary</span>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{trip.name}</h1>
                            <div className="flex items-center text-gray-500 font-medium">
                                <Calendar size={18} className="mr-2 text-brand-primary" />
                                {new Date(trip.start_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                <span className="mx-2">•</span>
                                {new Date(trip.end_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </div>
                            <p className="mt-4 text-gray-600 text-lg leading-relaxed max-w-2xl">{trip.description}</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 flex items-center pt-4 tracking-tight">
                        <MapPin className="mr-2 text-brand-primary" /> Itinerary
                    </h2>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-primary/50 before:via-gray-300 before:to-transparent">
                        {trip.stops.map((stop) => (
                            <div key={stop.id} className="relative z-10 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-hover hover:shadow-md">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-brand-primary/10 p-3 rounded-xl text-brand-primary">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{stop.city_name}, {stop.country}</h3>
                                            <div className="text-sm text-gray-500 font-medium mt-1">
                                                {new Date(stop.arrival_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                {' - '}
                                                {new Date(stop.departure_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 tracking-wide border border-gray-200`}>
                                            {stop.cost_index} COST
                                        </span>
                                    </div>
                                </div>

                                {/* Activities List */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Daily Plan</h4>
                                    {stop.activities.length === 0 ? (
                                        <div className="bg-gray-50 rounded-xl p-4 text-center border border-dashed border-gray-200">
                                            <p className="text-sm text-gray-400 italic">No activities planned</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-2">
                                            {stop.activities.map((act) => (
                                                <li key={act.id} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-white text-gray-500 font-bold text-xs h-6 w-6 flex items-center justify-center rounded-full border border-gray-200 shadow-sm">
                                                            {act.day_number}
                                                        </span>
                                                        <span className="font-bold text-gray-700">{act.name}</span>
                                                        <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-100">{act.type}</span>
                                                    </div>
                                                    <span className="font-bold text-gray-900">${Number(act.cost)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Budget & Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="sticky top-8 border-t-4 border-t-brand-primary shadow-xl rounded-2xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <DollarSign className="mr-2 text-brand-primary" size={24} /> Estimated Cost
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-brand-accent rounded-xl p-6 text-center border border-brand-primary/10">
                                    <span className="block text-brand-secondary font-bold text-xs uppercase tracking-wide mb-1">Total Trip Cost</span>
                                    <span className="block text-4xl font-extrabold text-gray-900">${trip.budget.total.toLocaleString()}</span>
                                </div>

                                <hr className="border-gray-100" />
                                <BudgetChart budget={trip.budget} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PublicTrip;
