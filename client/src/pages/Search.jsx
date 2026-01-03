import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, MapPin, DollarSign, Filter } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../services/api';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('activities'); // 'activities' or 'cities'
    const [results, setResults] = useState([]);
    const [cities, setCities] = useState([]);
    const [activities, setActivities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [citiesRes, activitiesRes] = await Promise.all([
                    api.get('/resources/cities'),
                    api.get('/resources/activities')
                ]);
                setCities(citiesRes.data);
                setActivities(activitiesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSearch = () => {
        setLoading(true);

        if (searchType === 'activities') {
            let filtered = activities;

            if (searchQuery) {
                filtered = filtered.filter(a =>
                    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.type.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (selectedCity) {
                filtered = filtered.filter(a => a.city_id === parseInt(selectedCity));
            }

            setResults(filtered);
        } else {
            const filtered = cities.filter(c =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.country.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setResults(filtered);
        }

        setLoading(false);
    };

    useEffect(() => {
        handleSearch();
    }, [searchQuery, searchType, selectedCity]);

    return (
        <div className="space-y-8 pb-12">
            {/* Search Header */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="bg-brand-primary/10 p-3 rounded-2xl">
                        <SearchIcon className="text-brand-primary" size={32} />
                    </div>
                    Discover Your Next Adventure
                </h1>

                {/* Search Controls */}
                <div className="space-y-4">
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={() => setSearchType('activities')}
                            className={`px-6 py-2 rounded-xl font-bold transition-all ${searchType === 'activities'
                                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Activities
                        </button>
                        <button
                            onClick={() => setSearchType('cities')}
                            className={`px-6 py-2 rounded-xl font-bold transition-all ${searchType === 'cities'
                                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Cities
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder={`Search ${searchType}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="mb-0"
                            />
                        </div>
                        {searchType === 'activities' && (
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                            >
                                <option value="">All Cities</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {results.length} {searchType === 'activities' ? 'Activities' : 'Cities'} Found
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                    </div>
                ) : results.length === 0 ? (
                    <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
                        <SearchIcon className="mx-auto text-gray-300 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchType === 'activities' ? (
                            results.map(activity => (
                                <ActivityCard key={activity.id} activity={activity} cities={cities} />
                            ))
                        ) : (
                            results.map(city => (
                                <CityCard key={city.id} city={city} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ActivityCard = ({ activity, cities }) => {
    const city = cities.find(c => c.id === activity.city_id);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{activity.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 gap-1">
                        <MapPin size={14} />
                        {city?.name}, {city?.country}
                    </div>
                </div>
                <span className="bg-brand-accent text-brand-primary px-3 py-1 rounded-full text-xs font-bold">
                    {activity.type}
                </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-brand-primary font-bold text-xl">
                    <DollarSign size={20} />
                    {activity.cost}
                </div>
                <button className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-lg transition-colors text-sm">
                    Add to Trip
                </button>
            </div>
        </div>
    );
};

const CityCard = ({ city }) => {
    const costColors = {
        LOW: 'bg-green-100 text-green-700',
        MEDIUM: 'bg-yellow-100 text-yellow-700',
        HIGH: 'bg-red-100 text-red-700'
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
            <div className="h-48 bg-gradient-to-br from-brand-primary to-brand-secondary"></div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{city.name}</h3>
                <div className="flex items-center text-gray-500 mb-4">
                    <MapPin size={16} className="mr-1" />
                    {city.country}
                </div>
                <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${costColors[city.cost_index]}`}>
                        {city.cost_index} Cost
                    </span>
                    <button className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-lg transition-colors text-sm">
                        Explore
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Search;
