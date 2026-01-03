
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Compass, Map, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2">
                                <div className="bg-brand-primary p-1.5 rounded-lg">
                                    <Compass className="text-white" size={24} />
                                </div>
                                <span className="text-xl font-bold text-gray-900 tracking-tight">GlobeTrotter</span>
                            </Link>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <NavLink to="/dashboard" active={isActive('/dashboard')} icon={<Compass size={18} />}>
                                    Dashboard
                                </NavLink>
                                <NavLink to="/my-trips" active={isActive('/my-trips')} icon={<Map size={18} />}>
                                    My Trips
                                </NavLink>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {user && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700 hidden md:block">
                                        Hi, {user.name}
                                    </span>
                                    <img
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=F59E0B&color=fff`}
                                        alt="Profile"
                                        className="h-8 w-8 rounded-full border border-gray-200"
                                    />
                                    <button
                                        onClick={logout}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">© 2024 GlobeTrotter. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const NavLink = ({ to, children, active, icon }) => (
    <Link
        to={to}
        className={`inline-flex items-center gap-2 px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${active
                ? 'border-brand-primary text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
    >
        {icon}
        {children}
    </Link>
);

export default Layout;
