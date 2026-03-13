import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? "text-black border-b-2 border-black pb-1" : "text-gray-500 hover:text-black";
    }

    return (
        <nav className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    {/* Brand Link replaced with simple text if admin or student name if logged in */}
                    <Link to={user ? (user.role === 'admin' ? '/admin' : '/home') : '/'} className="text-xl font-bold text-blue-600">
                        {user ? user.username.split(' ')[0] : 'Campus'} Portal
                    </Link>

                    {!location.pathname.startsWith('/admin') && (
                        <div className="hidden md:flex space-x-6 text-sm font-medium">
                            <Link to="/home" className={isActive('/home')}>Home</Link>
                            <Link to="/clubs" className={isActive('/clubs')}>Clubs</Link>
                            <Link to="/events" className={isActive('/events')}>Events</Link>
                            <Link to="/profile" className={isActive('/profile')}>Profile</Link>
                            {user && user.role === 'admin' && (
                                <Link to="/admin" className={isActive('/admin')}>Admin Panel</Link>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                                {user.username.charAt(0)}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
