import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

const TripCard = ({ trip }) => {
    return (
        <Link to={`/trip/${trip.id}`} className="block group">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-brand-primary/30 h-full flex flex-col">
                <div className="h-48 overflow-hidden relative">
                    {trip.cover_image || trip.cover_photo_url ? (
                        <img
                            src={trip.cover_image || trip.cover_photo_url}
                            alt={trip.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <MapPin className="text-gray-300 w-12 h-12" />
                        </div>
                    )}
                    <div className="absolute top-3 right-3">
                        {trip.status === 'public' && (
                            <span className="bg-white/90 backdrop-blur-sm text-brand-secondary text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                Public
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-brand-primary transition-colors">
                        {trip.name}
                    </h3>

                    <div className="space-y-3 mt-auto">
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2 text-brand-primary" />
                            <span>
                                {trip.start_date && trip.start_date !== 'null' ? new Date(trip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                            </span>
                            {/* logic for end date if you want range */}
                        </div>

                        {trip.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {trip.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TripCard;
