import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TripCard from "../components/TripCard.jsx";
import { useAuth } from "../context/AuthContext";
import { Plus, TrendingUp, MapPin } from "lucide-react";
import api from "../services/api";

const Dashboard = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tripsRes, citiesRes] = await Promise.all([
                    api.get('/trips'),
                    api.get('/resources/cities')
                ]);
                setTrips(tripsRes.data);
                setRecommendations(citiesRes.data);
            } catch (error) {
                console.error("Error loading dashboard:", error);
            }
        };
        fetchData();
    }, []);

    // Simple Budget Calculation for Widget
    const totalBudget = trips.reduce((acc, trip) => acc + (trip.budget?.total || 0), 0);
    const totalSpent = trips.reduce((acc, trip) => acc + (trip.budget?.spent || 0), 0); // Assuming spent exists or just using total as estimate
    // For demo, let's just show Total Estimated vs Limit
    const totalEst = trips.reduce((acc, trip) => acc + (trip.budget_est || 0), 0);

    return (
        <div className="space-y-10 pb-12">
            {/* Banner Section */}
            <div className="relative w-full h-80 rounded-3xl overflow-hidden shadow-2xl group">
                <img
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                    alt="Travel Banner"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent flex flex-col justify-center px-8 md:px-16 text-white">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
                        Hello, {user?.name?.split(' ')[0] || "Traveler"}! <br />
                        <span className="text-brand-primary">Adventure awaits.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
                        You have {trips.length} upcoming trips planned. Where will you go next?
                    </p>
                    <Link to="/create-trip" className="w-fit flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg shadow-brand-primary/30 transition-all transform hover:-translate-y-1">
                        <Plus size={24} /> Plan a New Trip
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Upcoming Trips */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Upcoming Trips</h2>
                        <Link to="/my-trips" className="text-brand-primary font-semibold hover:text-brand-secondary transition-colors">View All</Link>
                    </div>

                    {trips.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-xl">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No trips planned yet</h3>
                            <p className="text-gray-500 mb-6 font-medium">Start your journey by creating your first itinerary.</p>
                            <Link to="/create-trip" className="inline-flex items-center text-brand-primary font-bold hover:text-brand-secondary transition-colors text-lg">
                                Start Planning <TrendingUp size={20} className="ml-2" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {trips.slice(0, 4).map((trip) => (
                                <div key={trip.id} className="h-[340px]">
                                    <TripCard trip={trip} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-8">
                    {/* Budget Highlights Widget */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Budget Highlights</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Estimated Cost</p>
                                <p className="text-3xl font-extrabold text-gray-900">${totalBudget.toLocaleString()}</p>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Budget Limit</p>
                                <p className="text-2xl font-bold text-gray-600">${totalEst.toLocaleString()}</p>
                            </div>
                            <Link to="/trip/1/budget" className="block text-center w-full py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:border-brand-primary hover:text-brand-primary transition-colors">
                                View Detailed Breakdown
                            </Link>
                        </div>
                    </div>

                    {/* Recommended Destinations */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Recommended for You</h3>
                        <div className="space-y-4">
                            {recommendations.slice(0, 3).map((city) => (
                                <div key={city.id} className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-md">
                                        <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-brand-secondary transition-colors text-lg">{city.name}</h4>
                                        <div className="flex items-center text-xs text-gray-500 mt-1 font-medium">
                                            <MapPin size={12} className="mr-1" /> {city.country}
                                        </div>
                                        <span className="text-xs font-bold text-brand-primary mt-1 block">{city.cost_index} Cost</span>
                                    </div>
                                    <button className="ml-auto bg-gray-50 hover:bg-brand-primary hover:text-white p-2.5 rounded-xl transition-colors text-gray-400">
                                        <Plus size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
