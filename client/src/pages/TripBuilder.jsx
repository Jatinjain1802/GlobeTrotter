import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import BudgetChart from '../components/BudgetChart';
import { Plus, Calendar, MapPin, DollarSign, Share2, Compass, Trash2 } from 'lucide-react';
import api from '../services/api';

const TripBuilder = () => {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [cities, setCities] = useState([]);
    const [allActivities, setAllActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    // Add Stop State
    const [showAddStop, setShowAddStop] = useState(false);
    const [newStop, setNewStop] = useState({ city_id: '', arrival_date: '', departure_date: '' });

    const fetchTripData = async () => {
        try {
            const { data } = await api.get(`/trips/${id}`);
            setTrip(data);
        } catch (error) {
            console.error("Failed to load trip", error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [tripRes, citiesRes, actsRes] = await Promise.all([
                    api.get(`/trips/${id}`),
                    api.get('/resources/cities'),
                    api.get('/resources/activities')
                ]);
                setTrip(tripRes.data);
                setCities(citiesRes.data);
                setAllActivities(actsRes.data);
            } catch (error) {
                console.error("Error loading trip builder:", error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [id]);

    const handleAddStop = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/stops/${id}/create`, {
                city_id: newStop.city_id,
                arrival_date: newStop.arrival_date,
                departure_date: newStop.departure_date,
                order_index: trip.stops.length + 1
            });
            await fetchTripData(); // Refresh to get updated budget and list
            setShowAddStop(false);
            setNewStop({ city_id: '', arrival_date: '', departure_date: '' });
        } catch (error) {
            console.error("Failed to add stop", error);
            alert("Failed to add stop");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
    );
    if (!trip) return <div className="p-8 text-center text-red-500">Trip not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Itinerary */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                            <Compass size={180} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{trip.name}</h1>
                                    <div className="flex items-center text-gray-500 font-medium">
                                        <Calendar size={18} className="mr-2 text-brand-primary" />
                                        {new Date(trip.start_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        <span className="mx-2">•</span>
                                        {new Date(trip.end_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    </div>
                                </div>
                                <Link to={`/share/${trip.id}`} target="_blank">
                                    <Button variant="outline" className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl">
                                        <Share2 size={16} /> Share
                                    </Button>
                                </Link>
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">{trip.description}</p>
                        </div>
                    </div>

                    {/* Itinerary Section */}
                    <div className="flex justify-between items-center pt-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <MapPin className="mr-2 text-brand-primary" /> Itinerary
                        </h2>
                        <Button onClick={() => setShowAddStop(!showAddStop)} size="sm" className="shadow-lg shadow-brand-primary/20 bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-full font-bold transition-all transform hover:-translate-y-0.5">
                            <Plus size={18} className="mr-1 inline" /> Add Destination
                        </Button>
                    </div>

                    {showAddStop && (
                        <Card className="animate-in fade-in slide-in-from-top-2 border border-brand-primary/20 shadow-md p-6 rounded-2xl bg-white">
                            <h3 className="font-bold text-lg mb-4 text-gray-900">Add a New Stop</h3>
                            <form onSubmit={handleAddStop} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Select City</label>
                                    <select
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 bg-gray-50"
                                        value={newStop.city_id}
                                        onChange={(e) => setNewStop({ ...newStop, city_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Choose a destination...</option>
                                        {cities.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}, {c.country} ({c.cost_index} Cost)</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="date"
                                        label="Arrival Date"
                                        value={newStop.arrival_date}
                                        onChange={(e) => setNewStop({ ...newStop, arrival_date: e.target.value })}
                                        required
                                        className="text-gray-900"
                                    />
                                    <Input
                                        type="date"
                                        label="Departure Date"
                                        value={newStop.departure_date}
                                        onChange={(e) => setNewStop({ ...newStop, departure_date: e.target.value })}
                                        required
                                        className="text-gray-900"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <Button type="button" variant="secondary" onClick={() => setShowAddStop(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl">Cancel</Button>
                                    <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white rounded-xl font-semibold">Add Stop</Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-8 md:before:ml-8 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-primary/50 before:via-gray-300 before:to-transparent">
                        <div className="flex justify-end space-x-2 mb-4">
                            <Link to={`/trip/${id}/budget`} className="text-brand-primary hover:text-brand-secondary font-bold text-sm flex items-center bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                                <DollarSign size={16} className="mr-1" /> Budget Breakdown
                            </Link>
                            <Link to={`/trip/${id}/view`} className="text-gray-600 hover:text-gray-900 font-bold text-sm flex items-center bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                                <Calendar size={16} className="mr-1" /> Calendar View
                            </Link>
                        </div>
                        {trip.stops.length > 0 ? (
                            trip.stops
                                .sort((a, b) => a.order_index - b.order_index)
                                .map((stop, index) => (
                                    <StopCard
                                        key={stop.id}
                                        stop={stop}
                                        activitiesList={allActivities}
                                        refreshTrip={fetchTripData}
                                        index={index}
                                    />
                                ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200 relative z-10 ml-12">
                                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-brand-primary">
                                    <MapPin size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Your itinerary is empty</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mt-2">Start adding cities to build your dream trip.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Budget & Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="sticky top-24 border-t-4 border-t-brand-primary shadow-xl rounded-2xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <DollarSign className="mr-2 text-brand-primary" size={24} /> Trip Budget
                                </h2>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">Estimator</span>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-brand-accent rounded-xl p-6 text-center border border-brand-primary/10">
                                    <span className="block text-brand-secondary font-bold text-xs uppercase tracking-wide mb-1">Total Estimated Cost</span>
                                    <span className="block text-4xl font-extrabold text-gray-900">${trip.budget?.total?.toLocaleString() || 0}</span>
                                    <div className="mt-2 text-sm text-gray-500 font-medium flex justify-center gap-2">
                                        <span>Target Limit: ${Number(trip.budget_est || 0).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="py-2">
                                    <BudgetChart budget={trip.budget || { total: 0, breakdown: [] }} />
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">City Breakdown</h4>
                                    <div className="space-y-3">
                                        {trip.budget?.breakdown?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm group p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                <span className="text-gray-600 font-medium">{item.city} <span className="text-xs text-gray-400 ml-1">({item.days} days)</span></span>
                                                <span className="font-bold text-gray-900">${item.total.toLocaleString()}</span>
                                            </div>
                                        ))}
                                        {(!trip.budget?.breakdown || trip.budget.breakdown.length === 0) && (
                                            <p className="text-sm text-gray-400 italic text-center py-2">Add stops to see breakdown</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const StopCard = ({ stop, activitiesList, refreshTrip }) => {
    const [showAddActivity, setShowAddActivity] = useState(false);
    const [newActivity, setNewActivity] = useState({ activity_id: '', day_number: 1 });

    const handleAddActivity = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/stops/${stop.id}/activities`, {
                activity_id: newActivity.activity_id,
                day_number: newActivity.day_number
            });
            await refreshTrip();
            setShowAddActivity(false);
            setNewActivity({ activity_id: '', day_number: 1 });
        } catch (error) {
            console.error("Failed to add activity", error);
            alert("Failed to add activity");
        }
    };

    // Filter activities for this city
    const availableActivities = activitiesList.filter(a => a.city_id === stop.city_id);

    return (
        <div className="relative z-10 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ml-4">
            {/* Timeline Dot */}
            <div className="absolute top-8 -left-10 bg-white rounded-full p-1 border-2 border-brand-primary">
                <div className="bg-brand-primary w-3 h-3 rounded-full"></div>
            </div>

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
                    <span className="text-sm font-bold text-gray-900 bg-brand-accent text-brand-secondary px-3 py-1.5 rounded-full border border-brand-primary/20">
                        ${stop.budget?.total?.toLocaleString() || 0}
                    </span>
                </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Daily Plan</h4>
                </div>
                {(!stop.activities || stop.activities.length === 0) ? (
                    <div className="bg-gray-50 rounded-xl p-4 text-center border border-dashed border-gray-200">
                        <p className="text-sm text-gray-400 italic">No activities planned yet.</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {stop.activities.map((act, idx) => (
                            <li key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
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

            <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddActivity(!showAddActivity)}
                className={`w-full text-sm py-2.5 border-dashed border-gray-300 text-gray-500 hover:text-brand-primary hover:border-brand-primary hover:bg-brand-accent rounded-xl transition-all ${showAddActivity ? 'bg-gray-50' : ''}`}
            >
                {showAddActivity ? 'Close Form' : '+ Add Activity'}
            </Button>

            {showAddActivity && (
                <div className="mt-4 bg-gray-50 p-5 rounded-xl animate-in slide-in-from-top-2 border border-brand-primary/10">
                    <form onSubmit={handleAddActivity} className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Activity</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none bg-white"
                                value={newActivity.activity_id}
                                onChange={(e) => setNewActivity({ ...newActivity, activity_id: e.target.value })}
                                required
                            >
                                <option value="">Select Activity...</option>
                                {availableActivities.map(a => (
                                    <option key={a.id} value={a.id}>{a.name} (${a.cost}) - {a.type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-24">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Day</label>
                                <Input
                                    type="number"
                                    min="1"
                                    className="mb-0 text-gray-900 bg-white"
                                    value={newActivity.day_number}
                                    onChange={(e) => setNewActivity({ ...newActivity, day_number: e.target.value })}
                                />
                            </div>
                            <div className="flex-1 flex items-end">
                                <Button type="submit" size="sm" className="w-full bg-brand-primary hover:bg-brand-secondary text-white shadow-sm font-semibold py-2">Save Activity</Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TripBuilder;
