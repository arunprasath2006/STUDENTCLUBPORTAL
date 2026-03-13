import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Clubs from './pages/Clubs';
import Events from './pages/Events';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import RoleSelection from './pages/RoleSelection';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12">
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/home" element={<Home />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
            <Route path="/login" element={<RoleSelection />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/register" element={<Register />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
