import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

const CreateTripForm = ({ onTripCreated, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        budget_est: '',
        visibility: 'private'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/trips', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onTripCreated();
        } catch (error) {
            console.error('Error creating trip', error);
            alert('Failed to create trip');
        }
    };

    return (
        <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Plan a New Trip</h3>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Trip Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Summer in Europe"
                    className="text-gray-900"
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Start Date"
                        name="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="text-gray-900"
                    />
                    <Input
                        label="End Date"
                        name="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="text-gray-900"
                    />
                </div>
                <Input
                    label="Initial Budget Estimate"
                    name="budget_est"
                    type="number"
                    value={formData.budget_est}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="text-gray-900"
                />
                <div className="mb-4">
                    <label className="mb-1 text-sm font-medium text-gray-700 block">Visibility</label>
                    <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Create Trip</Button>
                </div>
            </form>
        </Card>
    );
};

export default CreateTripForm;
