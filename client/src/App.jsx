import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Clubs from './pages/Clubs';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Announcements from './pages/Announcements';
import AdminDashboard from './pages/AdminDashboard';
import RoleSelection from './pages/RoleSelection';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {!isAdminPath && <Navbar />}
      <div className={isAdminPath ? "w-full min-h-screen flex flex-col" : "container mx-auto px-6 md:px-12"}>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/announcements" element={
            <ProtectedRoute requiredRole="student">
              <Announcements />
            </ProtectedRoute>
          } />
          <Route path="/clubs" element={
            <ProtectedRoute requiredRole="student">
              <Clubs />
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute requiredRole="student">
              <Events />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requiredRole="student">
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<RoleSelection />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
