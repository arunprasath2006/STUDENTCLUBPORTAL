import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/analytics/summary');
                setSummary(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardHome summary={summary} loading={loading} setActiveTab={setActiveTab} />;
            case 'clubs':
                return <AdminClubsView />;
            case 'events':
                return <AdminEventsView />;
            case 'members':
                return <AdminMembersView />;
            case 'announcements':
                return <AdminAnnouncementsView />;
            default:
                return (
                    <div className="p-8 text-center text-gray-500 italic">
                        The {activeTab} section is under development.
                    </div>
                );
        }
    };

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen -mx-6 md:-mx-12 -mt-8">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 overflow-y-auto">
                <main className="p-8 max-w-7xl mx-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

const DashboardHome = ({ summary, loading, setActiveTab }) => {
    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    const metrics = [
        { label: 'Active Clubs', value: summary?.metrics?.activeClubs || 0, change: '+3 this month', icon: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ), color: 'bg-blue-50' },
        { label: 'Total Members', value: summary?.metrics?.totalMembers || 0, change: '+8 this month', icon: (
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        ), color: 'bg-green-50' },
        { label: 'Events This Week', value: summary?.metrics?.eventsThisWeek || 0, change: '+3 this month', icon: (
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        ), color: 'bg-purple-50' },
        { label: 'Engagement Rate', value: `${summary?.metrics?.engagementRate || 0}%`, change: '+5% this month', icon: (
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8l4 4-4 4M8 12h8" /></svg>
        ), color: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-100">
                        A
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Welcome back, Admin</h2>
                        <p className="text-gray-500 mt-1">Here's what's happening with your student clubs today.</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button 
                        onClick={() => setActiveTab('clubs')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Club
                    </button>
                    <button 
                        onClick={() => setActiveTab('events')}
                        className="bg-white border border-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold flex items-center hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Schedule Event
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${metric.color} p-3 rounded-xl`}>
                                {metric.icon}
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{metric.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 my-1">{metric.value}</h3>
                        <p className="text-green-600 text-[10px] font-bold">{metric.change}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activities</h3>
                    <div className="space-y-6">
                        {summary?.activities?.length > 0 ? summary.activities.map((act, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${act.type === 'join' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                    {act.type === 'join' ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-gray-900">{act.title}</h4>
                                    <p className="text-xs text-gray-500">{act.subtitle}</p>
                                </div>
                                <span className="text-[10px] font-medium text-gray-400">{new Date(act.time).toLocaleDateString()}</span>
                            </div>
                        )) : (
                            <p className="text-gray-500 italic text-sm">No recent activities.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Upcoming Events</h3>
                    <div className="space-y-6">
                        {summary?.upcomingEvents?.length > 0 ? summary.upcomingEvents.map((event, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                <h4 className="text-sm font-bold text-gray-900 mb-1">{event.title}</h4>
                                <div className="space-y-1">
                                    <div className="flex items-center text-gray-500 text-[10px]">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center text-gray-500 text-[10px]">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {event.location}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 italic text-sm">No upcoming events.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const AdminClubsView = () => {
    const [clubName, setClubName] = useState('');
    const [clubDesc, setClubDesc] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateClub = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/clubs',
                { name: clubName, description: clubDesc },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Club created successfully!');
            setClubName('');
            setClubDesc('');
        } catch (err) {
            setMessage('Error creating club');
            console.error(err);
        }
    };

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Club Management</h2>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Create New Club</h3>
                {message && <p className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{message}</p>}
                <form onSubmit={handleCreateClub} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Club Name</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                            placeholder="e.g. Photography Society"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32"
                            value={clubDesc}
                            onChange={(e) => setClubDesc(e.target.value)}
                            placeholder="Enter club mission and activities..."
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">Create Club</button>
                </form>
            </div>
        </div>
    );
};

const AdminEventsView = () => {
    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Event Management</h2>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Schedule New Event</h3>
                <EventForm />
            </div>
        </div>
    );
};

const AdminMembersView = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/clubs/join-request/all'); 
            setRequests(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests(); 
    }, []);

    const handleAction = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/clubs/join-request/${id}`, 
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchRequests(); // Refresh the list
        } catch (err) {
            console.error('Error updating request:', err);
            alert('Failed to update request');
        }
    };

    return (
        <div className="max-w-6xl">
            <h2 className="text-2xl font-bold mb-6">Member Requests</h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Club</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {requests.map((req, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-gray-900">{req.name}</div>
                                    <div className="text-[10px] text-gray-500">{req.email}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{req.clubName}</td>
                                <td className="p-4 text-sm text-gray-600">{req.department}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                                        req.status === 'approved' ? 'bg-green-50 text-green-600' : 
                                        req.status === 'rejected' ? 'bg-red-50 text-red-600' : 
                                        'bg-yellow-50 text-yellow-600'
                                    }`}>
                                        {req.status || 'Pending'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex space-x-2">
                                        {req.status === 'pending' && (
                                            <>
                                                <button 
                                                    onClick={() => handleAction(req._id, 'approved')}
                                                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(req._id, 'rejected')}
                                                    className="text-xs font-bold text-red-600 hover:text-red-800"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500 italic">No pending requests.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminAnnouncementsView = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/announcements');
                setAnnouncements(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAnnouncements();
    }, []);

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/announcements',
                { title, content, createdBy: '65c9f2b8f1a1b1a1b1a1b1a1' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Announcement posted!');
            setTitle('');
            setContent('');
            setAnnouncements([res.data, ...announcements]);
        } catch (err) {
            setMessage('Error posting announcement');
        }
    };

    return (
        <div className="max-w-4xl space-y-8">
            <h2 className="text-2xl font-bold mb-6">Announcements</h2>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Post New Announcement</h3>
                {message && <p className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-lg text-sm">{message}</p>}
                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Announcement title..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Content</label>
                        <textarea
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-32"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Message content..."
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Post Announcement</button>
                </form>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold">Recent Announcements</h3>
                {announcements.map((ann, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">{ann.title}</h4>
                            <span className="text-[10px] text-gray-400 font-medium">{new Date(ann.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{ann.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EventForm = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState('');
    const [clubId, setClubId] = useState('');
    const [clubs, setClubs] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/clubs');
                setClubs(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchClubs();
    }, []);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/events',
                { title, description: desc, date, clubId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Event created successfully!');
            setTitle('');
            setDesc('');
            setDate('');
            setClubId('');
        } catch (err) {
            setMessage('Error creating event');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleCreateEvent} className="space-y-4">
            {message && <p className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm font-medium">{message}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Event Title</label>
                    <input
                        type="text"
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Annual Tech Summit"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Date & Time</label>
                    <input
                        type="datetime-local"
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Club Organiser</label>
                <select
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                    value={clubId}
                    onChange={(e) => setClubId(e.target.value)}
                    required
                >
                    <option value="">Select Organising Club</option>
                    {clubs.map(club => (
                        <option key={club._id} value={club._id}>{club.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Provide event details..."
                    required
                />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">Schedule Event</button>
        </form>
    );
};

export default AdminDashboard;
