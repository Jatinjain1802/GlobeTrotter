import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Bell, Globe, Shield, Save } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        notifications: true,
        publicProfile: false,
        language: 'en',
    });
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: Implement API call to save settings
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="bg-brand-primary/10 p-3 rounded-2xl">
                        <Shield className="text-brand-primary" size={32} />
                    </div>
                    Settings
                </h1>
                <p className="text-gray-500 mt-2">Manage your account preferences and settings</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Settings */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <User className="text-brand-primary" size={24} />
                        Profile Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Shield className="text-brand-primary" size={24} />
                        Privacy & Security
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h3 className="font-bold text-gray-900">Public Profile</h3>
                                <p className="text-sm text-gray-500">Allow others to view your profile</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="publicProfile"
                                    checked={formData.publicProfile}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Bell className="text-brand-primary" size={24} />
                        Notifications
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h3 className="font-bold text-gray-900">Email Notifications</h3>
                                <p className="text-sm text-gray-500">Receive updates about your trips</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="notifications"
                                    checked={formData.notifications}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Language Settings */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Globe className="text-brand-primary" size={24} />
                        Language & Region
                    </h2>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Preferred Language
                        </label>
                        <select
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="ja">日本語</option>
                        </select>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-4">
                    {saved && (
                        <div className="flex items-center gap-2 text-green-600 font-bold">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            Settings saved successfully!
                        </div>
                    )}
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-8 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    >
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
