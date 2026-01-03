import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { toast } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

const TripBudget = () => {
    const { tripId } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({ category: "Food", amount: "", description: "" });

    const getExpenses = async () => {
        try {
            const { data } = await api.get(`/expenses/${tripId}`);
            setExpenses(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { getExpenses(); }, [tripId]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { trip_id: tripId, ...form, date: new Date() };
            const res = await api.post('/expenses', body);
            if (res.status === 200) {
                toast.success("Expense added");
                setForm({ category: "Food", amount: "", description: "" });
                getExpenses();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Process data for Chart
    const categories = ["Food", "Transport", "Accommodation", "Activities", "Other"];
    const dataMap = categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});

    expenses.forEach(e => {
        if (dataMap[e.category] !== undefined) dataMap[e.category] += parseFloat(e.amount);
        else dataMap["Other"] += parseFloat(e.amount);
    });

    const chartData = {
        labels: categories,
        datasets: [{
            data: categories.map(c => dataMap[c]),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
    };

    const totalCost = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Trip Budget Breakdown</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Chart Section */}
                <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">Cost Distribution</h2>
                    <div className="w-64 h-64">
                        {expenses.length > 0 ? <Pie data={chartData} /> : <p className="text-gray-500 mt-10">No expenses yet.</p>}
                    </div>
                    <div className="mt-8 text-3xl font-extrabold text-gray-900">${totalCost.toFixed(2)}</div>
                    <span className="text-sm text-gray-500 uppercase tracking-widest font-bold mt-1">Total Spent</span>
                </div>

                {/* Add Expense Form */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">Add New Expense</h2>
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border-gray-200 shadow-sm focus:border-brand-primary focus:ring-brand-primary/20 border bg-gray-50 text-gray-900 focus:outline-none"
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full px-4 py-3 rounded-xl border-gray-200 shadow-sm focus:border-brand-primary focus:ring-brand-primary/20 border bg-gray-50 text-gray-900 focus:outline-none"
                                value={form.amount}
                                onChange={e => setForm({ ...form, amount: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border-gray-200 shadow-sm focus:border-brand-primary focus:ring-brand-primary/20 border bg-gray-50 text-gray-900 focus:outline-none"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3.5 rounded-xl hover:bg-brand-secondary shadow-lg shadow-brand-primary/30 transition-all transform hover:-translate-y-0.5">
                            Add Expense
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TripBudget;
