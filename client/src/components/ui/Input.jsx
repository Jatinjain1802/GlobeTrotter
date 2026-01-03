import React from 'react';

export function Input({ label, type = "text", value, onChange, placeholder, className = "", ...props }) {
    return (
        <div className={`flex flex-col mb-4 ${className}`}>
            {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...props}
            />
        </div>
    );
}
