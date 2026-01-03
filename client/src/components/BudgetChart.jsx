import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const BudgetChart = ({ budget }) => {
    if (!budget || !budget.breakdown || budget.breakdown.length === 0) {
        return <div className="text-center text-gray-400 py-4">No data to display</div>;
    }

    // Aggregate data for the chart: "City Stay" vs "Activities" or Break down by City?
    // Let's do breakdown by City Total
    const data = budget.breakdown.map(item => ({
        name: item.city,
        value: item.total
    }));

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BudgetChart;
