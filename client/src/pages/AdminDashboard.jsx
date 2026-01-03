import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const AdminDashboard = () => {
    // Mock Data simulating backend stats
    const TripData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Trips Created',
            data: [12, 19, 3, 5, 20, 30],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }]
    };

    const CityData = {
        labels: ['Paris', 'Tokyo', 'Bali', 'New York', 'London'],
        datasets: [{
            label: '# of Visits',
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
        }]
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-uppercase">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-800">1,245</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-uppercase">Total Trips</h3>
                    <p className="text-3xl font-bold text-gray-800">3,892</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-uppercase">Active Cities</h3>
                    <p className="text-3xl font-bold text-gray-800">142</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 text-sm font-uppercase">Revenue (Est)</h3>
                    <p className="text-3xl font-bold text-gray-800">$12.4k</p>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Trip Creation Trend</h3>
                    <Bar data={TripData} options={{ responsive: true }} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Top Destinations</h3>
                    <div className="w-64">
                        <Doughnut data={CityData} />
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <h3 className="text-xl font-bold p-6 border-b text-gray-700">Recent User Registrations</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">User {i}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">user{i}@example.com</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">Jan {i}, 2024</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
