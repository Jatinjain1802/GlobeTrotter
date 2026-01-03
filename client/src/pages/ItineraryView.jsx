import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const ItineraryView = () => {
    const { tripId } = useParams();
    const [stops, setStops] = useState([]);
    const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'

    const getStops = async () => {
        try {
            const { data } = await api.get(`/stops/${tripId}`);
            setStops(data);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getStops();
    }, [tripId]);

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const day = dayjs(date);
            const dayStops = stops.filter(stop =>
                stop.arrival_date && stop.departure_date &&
                day.isBetween(dayjs(stop.arrival_date), dayjs(stop.departure_date), 'day', '[]')
            );

            if (dayStops.length > 0) {
                return (
                    <div className="flex flex-col gap-1 mt-1">
                        {dayStops.map((stop, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-blue-500 mx-auto" title={stop.city_name}></div>
                        ))}
                    </div>
                );
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Trip Itinerary</h1>
                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setViewMode("list")}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${viewMode === "list" ? "bg-white shadow-md text-brand-primary scale-105" : "text-gray-500 hover:text-gray-900"}`}
                    >
                        List View
                    </button>
                    <button
                        onClick={() => setViewMode("calendar")}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${viewMode === "calendar" ? "bg-white shadow-md text-brand-primary scale-105" : "text-gray-500 hover:text-gray-900"}`}
                    >
                        Calendar View
                    </button>
                </div>
            </div>

            {viewMode === "list" ? (
                <div className="space-y-6">
                    {stops.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <p className="text-gray-400 font-medium text-lg">No stops added yet to this itinerary.</p>
                        </div>
                    ) : stops.map((stop, index) => (
                        <div key={stop.id} className="flex flex-col md:flex-row bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden hover:shadow-lg transition-all group">
                            <div className="bg-brand-primary text-white p-6 flex flex-col items-center justify-center md:w-32 text-center group-hover:bg-brand-secondary transition-colors">
                                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Stop</span>
                                <span className="text-3xl font-extrabold">{index + 1}</span>
                            </div>
                            <div className="p-8 flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-bold text-gray-900">{stop.city_name}</h3>
                                    <span className="bg-brand-accent text-brand-secondary text-xs font-bold px-3 py-1 rounded-full border border-brand-primary/20">
                                        {stop.days || 1} Days
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 mb-6 font-medium flex items-center">
                                    <span className="mr-2">📅</span>
                                    {stop.arrival_date ? new Date(stop.arrival_date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "?"}
                                    <span className="mx-2 text-gray-300">•</span>
                                    {stop.departure_date ? new Date(stop.departure_date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "?"}
                                </div>
                                {stop.notes && (
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-600 text-sm">
                                        <p>{stop.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <Calendar
                        tileContent={tileContent}
                        className="w-full border-0 font-sans"
                        tileClassName="font-medium hover:bg-brand-accent rounded-lg transition-colors"
                    />
                </div>
            )}
        </div>
    );
};

export default ItineraryView;
