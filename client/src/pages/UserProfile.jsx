import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Calendar, Settings, Camera } from 'lucide-react';
import TripCard from '../components/TripCard';
import api from '../services/api';

const UserProfile = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const { data } = await api.get('/trips');
                setTrips(data);
            } catch (error) {
                console.error('Error fetching trips:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    const preplannedTrips = trips.filter(t => !t.start_date);
    const previousTrips = trips.filter(t => t.end_date && new Date(t.end_date) < new Date());

    return (
        <div className="space-y-8 pb-12">
            {/* Profile Header */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                        <div className="relative">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff&size=128`}
                                alt={user?.name}
                                className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl"
                            />
                            <button className="absolute bottom-0 right-0 bg-brand-primary text-white p-2 rounded-lg shadow-lg hover:bg-brand-secondary transition-colors">
                                <Camera size={18} />
                            </button>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.name}</h1>
                            <p className="text-gray-500 font-medium">{user?.email}</p>
                            <div className="flex gap-4 mt-4">
                                <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                    <span className="text-2xl font-bold text-brand-primary">{trips.length}</span>
                                    <p className="text-xs text-gray-500 font-medium">Total Trips</p>
                                </div>
                                <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                    <span className="text-2xl font-bold text-brand-primary">{previousTrips.length}</span>
                                    <p className="text-xs text-gray-500 font-medium">Completed</p>
                                </div>
                            </div>
                        </div>
                        <Link
                            to="/settings"
                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                        >
                            <Settings size={20} />
                            Settings
                        </Link>
                    </div>
                </div>
            </div>

            {/* Preplanned Trips */}
            {preplannedTrips.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <MapPin className="text-brand-primary" size={28} />
                            Preplanned Trips
                        </h2>
                        <Link to="/my-trips" className="text-brand-primary font-semibold hover:text-brand-secondary transition-colors">
                            View All
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {preplannedTrips.slice(0, 3).map(trip => (
                            <TripCard key={trip.id} trip={trip} />
                        ))}
                    </div>
                </section>
            )}

            {/* Previous Trips */}
            {previousTrips.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Calendar className="text-brand-primary" size={28} />
                            Previous Trips
                        </h2>
                        <Link to="/my-trips" className="text-brand-primary font-semibold hover:text-brand-secondary transition-colors">
                            View All
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {previousTrips.slice(0, 6).map(trip => (
                            <TripCard key={trip.id} trip={trip} />
                        ))}
                    </div>
                </section>
            )}

            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
