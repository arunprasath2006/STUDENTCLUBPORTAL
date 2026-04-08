import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Profile = () => {
    const { user, loadUser, updateProfile } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ username: '', registerNumber: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            await loadUser(); // Ensure we have latest data
            setLoading(false);
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (user) {
            setEditData({
                username: user.username || '',
                registerNumber: user.registerNumber || ''
            });
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(editData);
            setIsEditModalOpen(false);
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return <div className="text-center py-12">Please login to view profile.</div>;

    // Helper to format date
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Sep 2024';
        return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 animate-fade-in">
            {/* Page Header */}
            <header className="mb-12">
                <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">My Profile</h1>
                <p className="text-gray-500 font-medium">Manage your account and view your activities</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Left Column: Profile Card */}
                <div className="w-full lg:w-[380px]">
                    <div className="bg-white p-10 rounded-[32px] border-2 border-dashed border-gray-100 flex flex-col items-center">
                        {/* Avatar */}
                        <div className="w-28 h-28 bg-black rounded-full flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl">
                            {user.username ? user.username.substring(0, 2).toUpperCase() : 'ST'}
                        </div>
                        
                        {/* Info */}
                        <h2 className="text-2xl font-black text-gray-900 mb-1">{user.username}</h2>
                        <p className="text-gray-400 font-bold text-sm tracking-widest mb-8 uppercase">
                            {user.registerNumber || 'STU2025001'}
                        </p>

                        <div className="w-full space-y-4 mb-10 pt-4 border-t border-gray-50">
                            <div className="flex items-center text-gray-500 text-sm font-medium">
                                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                {user.email}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm font-medium">
                                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Joined {formatDate(user.createdAt)}
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="w-full py-3.5 bg-white border-2 border-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Right Column: Activities */}
                <div className="flex-1 w-full">
                    {/* My Clubs Section */}
                    <div className="mb-10">
                        <div className="flex items-center mb-8">
                            <svg className="w-6 h-6 mr-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">My Clubs</h3>
                        </div>
                        
                        <div className="space-y-6">
                            {user.joinedClubs && user.joinedClubs.length > 0 ? (
                                user.joinedClubs.map((membership, i) => (
                                    <div key={i} className="bg-white p-6 rounded-[28px] border-2 border-dashed border-gray-100 flex items-center justify-between group hover:border-gray-200 transition-all">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-black text-gray-900 mb-2 leading-tight">
                                                {membership.club ? membership.club.name : (membership.clubName || 'Unknown Club')}
                                            </h4>
                                            <div className="flex items-center space-x-3">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase rounded-lg">
                                                    {membership.role || 'Member'}
                                                </span>
                                                <span className="text-xs text-gray-400 font-bold tracking-tight">
                                                    Joined {formatDate(membership.joinedAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="px-7 py-2.5 bg-white border-2 border-gray-100 text-gray-900 text-sm font-black rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                                            View
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">
                                    <p className="text-gray-400 font-black text-sm uppercase tracking-widest">No clubs joined yet</p>
                                    <p className="text-gray-400 text-xs mt-1">Visit the clubs page to find your community.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-10 w-full max-w-md shadow-2xl animate-scale-up">
                        <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Edit Profile</h3>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-bold text-gray-900"
                                    value={editData.username}
                                    onChange={(e) => setEditData({...editData, username: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Student ID (Register Number)</label>
                                <input 
                                    type="text" 
                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-bold text-gray-900"
                                    value={editData.registerNumber}
                                    onChange={(e) => setEditData({...editData, registerNumber: e.target.value})}
                                    placeholder="e.g. STU2025001"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all active:scale-[0.98]"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
