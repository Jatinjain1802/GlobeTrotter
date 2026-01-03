import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MapPin, Calendar, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

const CommunityFeed = () => {
    const { user } = useAuth();
    const [publicTrips, setPublicTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicTrips = async () => {
            try {
                // In a real app, you'd have an endpoint for public trips
                // For now, we'll fetch all trips and filter
                const { data } = await api.get('/trips');
                // Mock public trips - in production, filter by visibility
                setPublicTrips(data.filter(t => t.visibility === 'public'));
            } catch (error) {
                console.error('Error fetching public trips:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicTrips();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <div className="bg-brand-primary/10 p-3 rounded-2xl">
                        <Globe className="text-brand-primary" size={32} />
                    </div>
                    Community Feed
                </h1>
                <p className="text-gray-500 font-medium">Discover amazing trips from fellow travelers</p>
            </div>

            {/* Create Post Prompt */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-4">
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff`}
                        alt={user?.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-100"
                    />
                    <Link
                        to="/my-trips"
                        className="flex-1 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors cursor-pointer font-medium"
                    >
                        Share your travel story...
                    </Link>
                </div>
            </div>

            {/* Feed */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                </div>
            ) : publicTrips.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
                    <Globe className="mx-auto text-gray-300 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No public trips yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to share your adventure!</p>
                    <Link
                        to="/my-trips"
                        className="inline-block px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl transition-colors"
                    >
                        Share a Trip
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {publicTrips.map(trip => (
                        <TripPost key={trip.id} trip={trip} />
                    ))}
                </div>
            )}
        </div>
    );
};

const TripPost = ({ trip }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 5);

    const handleLike = () => {
        if (liked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setLiked(!liked);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Post Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={`https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff`}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-gray-100"
                    />
                    <div>
                        <h3 className="font-bold text-gray-900">Traveler</h3>
                        <p className="text-xs text-gray-500">Shared a trip</p>
                    </div>
                </div>

                <Link to={`/share/${trip.id}`} className="block group">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors">
                        {trip.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{trip.description}</p>
                </Link>

                {/* Trip Details */}
                <div className="flex flex-wrap gap-4 mb-4">
                    {trip.start_date && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={16} className="text-brand-primary" />
                            {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} className="text-brand-primary" />
                        {trip.stops?.length || 0} destinations
                    </div>
                </div>
            </div>

            {/* Trip Image/Cover */}
            {trip.cover_photo_url && (
                <div className="h-64 bg-gradient-to-br from-brand-primary to-brand-secondary">
                    <img
                        src={trip.cover_photo_url}
                        alt={trip.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Engagement Actions */}
            <div className="p-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 font-bold transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                    >
                        <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                        {likes}
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-brand-primary font-bold transition-colors">
                        <MessageCircle size={20} />
                        {Math.floor(Math.random() * 20)}
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-brand-primary font-bold transition-colors ml-auto">
                        <Share2 size={20} />
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunityFeed;
