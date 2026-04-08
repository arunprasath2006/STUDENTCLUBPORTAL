import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Role-based protection:
    // If a required role is specified, user must have that role
    // For admins, we strictly require the email admin@gmail.com as requested
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/home'} />;
    }

    if (requiredRole === 'admin' && user.email !== 'admin@gmail.com') {
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
