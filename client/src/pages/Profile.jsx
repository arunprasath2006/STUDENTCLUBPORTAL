import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [myClubs, setMyClubs] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [myApplications, setMyApplications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const clubsRes = await axios.get('http://localhost:5000/api/clubs');
                console.log('Fetched Clubs:', clubsRes.data);
                const userClubs = clubsRes.data.filter(club => {
                    if (!club.members) return false;
                    return club.members.some(member => {
                        const memberId = (member._id || member).toString();
                        const userId = (user._id || user.id).toString();
                        return memberId === userId;
                    });
                });
                console.log('User Clubs found:', userClubs);
                setMyClubs(userClubs);

                const eventsRes = await axios.get('http://localhost:5000/api/events');
                const userEvents = eventsRes.data.filter(event =>
                    event.attendees.includes(user._id)
                );
                setMyEvents(userEvents);

                const appsRes = await axios.get(`http://localhost:5000/api/clubs/join-request/user/${user.email}`);
                setMyApplications(appsRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user]);

    if (!user) return <div>Please login to view profile.</div>;

    return (
        <div className="py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-600">Manage your account and view your activities</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Card */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                        <div className="w-24 h-24 bg-black rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4">
                            {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
                        <p className="text-gray-500 text-sm mb-4">Student ID: {user._id.substring(0, 8).toUpperCase()}</p>

                        <div className="space-y-2 text-left mt-6">
                            <div className="flex items-center text-gray-600 text-sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                {user.email}
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                        </div>

                        <button className="w-full mt-6 py-2 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50">Edit Profile</button>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="lg:w-2/3 space-y-8">
                    {/* My Applications */}
                    <div>
                        <div className="flex items-center mb-4">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <h3 className="text-lg font-bold text-gray-800">My Applications</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myApplications.length > 0 ? (
                                myApplications.map(app => (
                                    <div key={app._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-blue-100 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{app.clubName}</h4>
                                                <p className="text-[10px] text-gray-400 mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                                                app.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' : 
                                                app.status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' : 
                                                'bg-yellow-50 text-yellow-600 border border-yellow-100'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center col-span-2">
                                    <p className="text-gray-500 text-sm">No club applications yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* My Clubs */}
                    <div>
                        <div className="flex items-center mb-4">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            <h3 className="text-lg font-bold text-gray-800">Official Memberships</h3>
                        </div>
                        <div className="space-y-3">
                            {myClubs.length > 0 ? (
                                myClubs.map(club => (
                                    <div key={club._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                                {club.name.substring(0, 1)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{club.name}</h4>
                                                <span className="text-[10px] text-gray-500">Official Member</span>
                                            </div>
                                        </div>
                                        <button className="text-xs font-bold text-blue-600 hover:underline">Launch Portal</button>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
                                    <p className="text-gray-500 text-sm">You haven't joined any clubs officially yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* My Events */}
                    <div>
                        <div className="flex items-center mb-4">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <h3 className="text-lg font-bold text-gray-800">Upcoming Events</h3>
                        </div>
                        <div className="space-y-3">
                            {myEvents.length > 0 ? (
                                myEvents.map(event => (
                                    <div key={event._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{event.title}</h4>
                                            <div className="text-[10px] text-gray-500 mt-1 flex items-center space-x-3">
                                                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                                                <span>📍 {event.location || 'TBD'}</span>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100">Registered</span>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
                                    <p className="text-gray-500 text-sm">You haven't registered for any events yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* My Events */}
                    <div>
                        <div className="flex items-center mb-4">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <h3 className="text-lg font-bold text-gray-800">My Events</h3>
                        </div>
                        <div className="space-y-4">
                            {myEvents.length > 0 ? (
                                myEvents.map(event => (
                                    <div key={event._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{event.title}</h4>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {new Date(event.date).toLocaleDateString()} • {event.location || 'TBD'}
                                            </div>
                                            <div className="flex items-center mt-2">
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">{event.club ? event.club.name : 'Event'}</span>
                                                <span className="text-xs bg-black text-white px-2 py-0.5 rounded">Confirmed</span>
                                            </div>
                                        </div>
                                        <button className="text-sm text-gray-600 hover:text-black border border-gray-200 px-3 py-1 rounded">Details</button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic text-sm">You haven't RSVP'd to any events yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
