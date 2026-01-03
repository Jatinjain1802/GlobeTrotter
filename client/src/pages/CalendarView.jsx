import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import dayjs from 'dayjs';

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const { data } = await api.get('/trips');
                setTrips(data.filter(t => t.start_date && t.end_date));
            } catch (error) {
                console.error('Error fetching trips:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');

    const calendar = [];
    let day = startDate;

    while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
        calendar.push(day);
        day = day.add(1, 'day');
    }

    const weeks = [];
    for (let i = 0; i < calendar.length; i += 7) {
        weeks.push(calendar.slice(i, i + 7));
    }

    const getTripsForDay = (date) => {
        return trips.filter(trip => {
            const start = dayjs(trip.start_date);
            const end = dayjs(trip.end_date);
            return date.isSameOrAfter(start, 'day') && date.isSameOrBefore(end, 'day');
        });
    };

    const previousMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
    const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));
    const today = () => setCurrentDate(dayjs());

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="bg-brand-primary/10 p-3 rounded-2xl">
                            <CalendarIcon className="text-brand-primary" size={32} />
                        </div>
                        Trip Calendar
                    </h1>
                    <button
                        onClick={today}
                        className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl transition-colors"
                    >
                        Today
                    </button>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={24} className="text-gray-600" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {currentDate.format('MMMM YYYY')}
                    </h2>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronRight size={24} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 overflow-hidden">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center font-bold text-gray-500 text-sm py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="space-y-2">
                        {weeks.map((week, weekIdx) => (
                            <div key={weekIdx} className="grid grid-cols-7 gap-2">
                                {week.map((day, dayIdx) => {
                                    const isCurrentMonth = day.month() === currentDate.month();
                                    const isToday = day.isSame(dayjs(), 'day');
                                    const dayTrips = getTripsForDay(day);

                                    return (
                                        <div
                                            key={dayIdx}
                                            className={`min-h-24 p-2 rounded-xl border transition-all ${isCurrentMonth
                                                    ? 'bg-white border-gray-200 hover:border-brand-primary hover:shadow-sm'
                                                    : 'bg-gray-50 border-gray-100'
                                                } ${isToday ? 'ring-2 ring-brand-primary' : ''}`}
                                        >
                                            <div className={`text-sm font-bold mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                                                } ${isToday ? 'text-brand-primary' : ''}`}>
                                                {day.date()}
                                            </div>
                                            <div className="space-y-1">
                                                {dayTrips.slice(0, 2).map(trip => (
                                                    <Link
                                                        key={trip.id}
                                                        to={`/trip/${trip.id}`}
                                                        className="block text-xs bg-brand-accent text-brand-primary px-2 py-1 rounded font-medium hover:bg-brand-primary hover:text-white transition-colors truncate"
                                                        title={trip.name}
                                                    >
                                                        {trip.name}
                                                    </Link>
                                                ))}
                                                {dayTrips.length > 2 && (
                                                    <div className="text-xs text-gray-500 font-medium px-2">
                                                        +{dayTrips.length - 2} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Trips List */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Trips</h2>
                {trips.filter(t => dayjs(t.start_date).isAfter(dayjs())).length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No upcoming trips scheduled</p>
                ) : (
                    <div className="space-y-4">
                        {trips
                            .filter(t => dayjs(t.start_date).isAfter(dayjs()))
                            .sort((a, b) => dayjs(a.start_date).diff(dayjs(b.start_date)))
                            .slice(0, 5)
                            .map(trip => (
                                <Link
                                    key={trip.id}
                                    to={`/trip/${trip.id}`}
                                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-brand-accent rounded-xl transition-colors group"
                                >
                                    <div>
                                        <h3 className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                                            {trip.name}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon size={14} />
                                                {dayjs(trip.start_date).format('MMM D')} - {dayjs(trip.end_date).format('MMM D, YYYY')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-brand-primary">
                                        {dayjs(trip.start_date).diff(dayjs(), 'day')} days
                                    </div>
                                </Link>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarView;
