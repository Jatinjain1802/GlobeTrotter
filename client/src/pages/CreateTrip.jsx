import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        budget_est: '',
        cover_photo_url: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/trips', formData);
            navigate(`/trip/${res.data.tripId}`); // Backend returns { message, tripId }
        } catch (error) {
            console.error(error);
            alert("Failed to create trip");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl p-10 shadow-xl rounded-3xl border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center tracking-tight">Plan Your Next Adventure</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Trip Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Summer in Italy"
                        className="text-gray-900 bg-gray-50 border-gray-200 focus:border-brand-primary concern-ring-brand-primary"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            type="date"
                            label="Start Date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="text-gray-900 bg-gray-50 border-gray-200 focus:border-brand-primary"
                        />
                        <Input
                            type="date"
                            label="End Date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="text-gray-900 bg-gray-50 border-gray-200 focus:border-brand-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary h-32 transition-all"
                            placeholder="What's this trip about?"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            type="number"
                            label="Estimated Budget ($)"
                            name="budget_est"
                            value={formData.budget_est}
                            onChange={handleChange}
                            placeholder="5000"
                            className="text-gray-900 bg-gray-50 border-gray-200 focus:border-brand-primary"
                        />
                        <Input
                            label="Cover Photo URL"
                            name="cover_photo_url"
                            value={formData.cover_photo_url}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="text-gray-900 bg-gray-50 border-gray-200 focus:border-brand-primary"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-6">
                        <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')} className="rounded-xl font-semibold text-gray-600 hover:bg-gray-100">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white w-full md:w-auto rounded-xl shadow-lg shadow-brand-primary/20 font-bold px-8">
                            Create Trip
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateTrip;
