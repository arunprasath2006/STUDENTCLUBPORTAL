import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import RequestModal from '../components/RequestModal';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState(null); // 'club' or 'event'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'admin' && user?.email === 'admin@gmail.com') {
            navigate('/admin');
            return;
        }

        const fetchData = async () => {
            try {
                const clubsRes = await axios.get('http://localhost:5000/api/clubs');
                setClubs(clubsRes.data);
                const eventsRes = await axios.get('http://localhost:5000/api/events');
                setEvents(eventsRes.data);
                const annRes = await axios.get('http://localhost:5000/api/announcements');
                setAnnouncements(annRes.data.slice(0, 3)); // Only show latest 3
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user, navigate]);

    const handleJoinClick = (club) => {
        setSelectedItem(club);
        setModalType('club');
        setIsModalOpen(true);
    };

    const handleRSVPClick = (event) => {
        setSelectedItem(event);
        setModalType('event');
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (modalType === 'club') {
                await axios.post('http://localhost:5000/api/clubs/join-request', {
                    clubId: selectedItem._id,
                    clubName: selectedItem.name,
                    ...formData
                });
                alert(`Request to join ${selectedItem.name} submitted successfully!`);
            } else {
                await axios.post('http://localhost:5000/api/events/register', {
                    eventId: selectedItem._id,
                    eventTitle: selectedItem.title,
                    ...formData
                });
                alert(`Registration for ${selectedItem.title} submitted successfully!`);
            }
            setIsModalOpen(false);
            setSelectedItem(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Error submitting request');
        }
    };

    return (
        <div className="space-y-12 py-8">
            {/* Welcome Section */}
            <section className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Student Portal</h1>
                <p className="text-gray-600 text-lg">Discover clubs, join events, and connect with your community</p>
            </section>

            {user?.role === 'student' ? (
                <div className="space-y-12">
                    {/* Announcements Banner Section */}
                    {announcements.length > 0 && (
                        <section className="bg-blue-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200 group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-32 -mt-32 opacity-50 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-3">
                                        <span className="p-2 bg-blue-500 rounded-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                        </span>
                                        <h3 className="text-xl font-black tracking-tight">Latest Announcements</h3>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/announcements')}
                                        className="text-white text-xs font-black uppercase tracking-widest bg-blue-500/50 hover:bg-blue-500 px-4 py-2 rounded-xl transition-all"
                                    >
                                        See All
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {announcements.map((ann) => (
                                        <div key={ann._id} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer" onClick={() => navigate('/announcements')}>
                                            <h4 className="font-black text-sm mb-2 line-clamp-1">{ann.title}</h4>
                                            <p className="text-xs text-blue-100 line-clamp-2 font-medium leading-relaxed">{ann.content}</p>
                                            <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-blue-200">
                                                {new Date(ann.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                    {/* Upcoming Events Section (Left/Top) */}
                    <div className="lg:w-2/3">
                        <div className="flex items-center mb-6">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {events.length > 0 ? (
                                events.slice(0, 4).map(event => (
                                    <EventCard key={event._id} event={event} onRSVP={handleRSVPClick} />
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No upcoming events found.</p>
                            )}
                        </div>
                        <button 
                            onClick={() => navigate('/events')}
                            className="w-full mt-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 text-sm font-medium"
                        >
                            View All Events
                        </button>
                    </div>

                    {/* Popular Clubs Section (Right/Bottom) */}
                    <div className="lg:w-1/3">
                        <div className="flex items-center mb-6">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <h2 className="text-xl font-semibold text-gray-800">Popular Clubs</h2>
                        </div>

                        <div className="space-y-4">
                            {clubs.length > 0 ? (
                                clubs.slice(0, 3).map(club => (
                                    <div key={club._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{club.name}</h4>
                                            <span className="text-xs text-gray-500">{club.members.length} members</span>
                                        </div>
                                        <button
                                            onClick={() => handleJoinClick(club)}
                                            className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50"
                                        >
                                            Join
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No clubs found.</p>
                            )}
                        </div>
                        <button 
                            onClick={() => navigate('/clubs')}
                            className="w-full mt-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 text-sm font-medium"
                        >
                            View All Clubs
                        </button>
                    </div>
                    </div>
                </div>
            ) : (
                <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                    <h2 className="text-2xl font-bold text-blue-900 mb-4">Administrator Dashboard Greeting</h2>
                    <p className="text-blue-800 mb-6">Welcome back, {user?.username}. You have administrative access to manage the campus portal.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200">
                            <h3 className="font-bold text-gray-900 mb-2">Management</h3>
                            <p className="text-sm text-gray-600 mb-4">Manage clubs, events, and requests.</p>
                            <button 
                                onClick={() => navigate('/admin')}
                                className="text-blue-600 text-sm font-bold hover:underline"
                            >
                                Go to Admin Panel →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedItem && (
                <RequestModal 
                    title={modalType === 'club' ? `Join ${selectedItem.name}` : `Register for ${selectedItem.title}`}
                    subtitle={modalType === 'club' ? "Please fill in your details to request membership" : "Please fill in your details to register for this event"}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default Home;
