import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
    const { user: authUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('members');
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get('/analytics/summary');
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
                return <AdminMembersView setActiveTab={setActiveTab} />;
            case 'announcements':
                return <AdminAnnouncementsView adminId={authUser?._id} />;
            default:
                return (
                    <div className="p-8 text-center text-gray-500 italic">
                        The {activeTab} section is under development.
                    </div>
                );
        }
    };

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen">
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
    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    const metrics = [
        { label: 'Active Clubs', value: summary?.metrics?.activeClubs || 36, change: '+3 this month', icon: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        )},
        { label: 'Total Members', value: summary?.metrics?.totalMembers || 76, change: '+8 this month', icon: (
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        )},
        { label: 'Events This Week', value: summary?.metrics?.eventsThisWeek || 8, change: '+3 this month', icon: (
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        )},
        { label: 'Engagement Rate', value: `${summary?.metrics?.engagementRate || 84}%`, change: '+5% this month', icon: (
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8l4 4-4 4M8 12h8" /></svg>
        )},
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-50 bg-opacity-50 rounded-xl flex items-center justify-center p-2">
                         <img src="https://www.poornima.edu.in/wp-content/uploads/2021/05/logo.png" alt="University Logo" className="w-full h-auto" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome back, Admin</h2>
                        <p className="text-gray-500 text-sm font-medium">Here's what's happening with your student clubs today.</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <button 
                        onClick={() => setActiveTab('clubs')}
                        className="bg-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center hover:bg-blue-900 transition-all shadow-md active:scale-95"
                    >
                        <span className="mr-2 text-lg">+</span> Add Club
                    </button>
                    <button 
                        onClick={() => setActiveTab('events')}
                        className="bg-white border-2 border-gray-100 text-gray-800 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Schedule Event
                    </button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-gray-50 p-2 rounded-lg">
                                {metric.icon}
                            </div>
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{metric.label}</p>
                        <div className="flex items-baseline space-x-2">
                             <h3 className="text-3xl font-black text-gray-900 leading-none">{metric.value}</h3>
                        </div>
                        <p className="text-green-600 text-[10px] font-bold mt-2 uppercase tracking-tight">{metric.change}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 mb-8 tracking-tight">Recent Activities</h3>
                    <div className="space-y-8">
                        {summary?.activities?.length > 0 ? summary.activities.map((act, i) => (
                            <div key={i} className="flex items-start space-x-5 group cursor-pointer">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${act.type === 'join' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                    {act.type === 'join' ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-base font-black text-gray-900 mb-1 leading-tight">{act.title}</h4>
                                    <p className="text-sm text-gray-500 font-medium">{act.subtitle}</p>
                                </div>
                                <span className="text-[11px] font-bold text-gray-400 mt-1 whitespace-nowrap">{new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ago</span>
                            </div>
                        )) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400 italic">No activity recorded today.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Events Column */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-black text-gray-900 mb-8 tracking-tight">Upcoming Events</h3>
                    <div className="space-y-6 flex-1">
                        {summary?.upcomingEvents?.length > 0 ? summary.upcomingEvents.map((event, i) => (
                            <div key={i} className="p-5 border-2 border-gray-50 rounded-2xl hover:border-blue-100 transition-colors cursor-pointer group">
                                <h4 className="text-base font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{event.title}</h4>
                                <p className="text-xs text-gray-500 font-bold mb-4 uppercase tracking-wider">{event.clubName || 'Computer Science Society'}</p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-500 text-[11px] font-medium">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}  •  {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center text-gray-500 text-[11px] font-medium">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {event.location}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400 italic font-medium">No events scheduled.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const AdminClubsView = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    
    // Create Club Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clubName, setClubName] = useState('');
    const [clubDesc, setClubDesc] = useState('');
    const [clubCat, setClubCat] = useState('General');
    const [createLoading, setCreateLoading] = useState(false);

    // Edit Club Form State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingClub, setEditingClub] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editCat, setEditCat] = useState('General');
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchClubs = async () => {
        try {
            const res = await api.get('/clubs');
            setClubs(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClubs();
    }, []);

    const handleCreateClub = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            await api.post('/clubs', 
                { name: clubName, description: clubDesc, category: clubCat }
            );
            
            setClubName('');
            setClubDesc('');
            setClubCat('General');
            setIsModalOpen(false);
            fetchClubs();
            alert('Club added successfully!');
        } catch (err) {
            console.error('Error creating club:', err);
            alert('Failed to create club.');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleEditClick = (club) => {
        setEditingClub(club);
        setEditName(club.name);
        setEditDesc(club.description);
        setEditCat(club.category || 'General');
        setIsEditModalOpen(true);
    };

    const handleUpdateClub = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            await api.put(`/clubs/${editingClub._id}`, 
                { name: editName, description: editDesc, category: editCat }
            );
            
            setIsEditModalOpen(false);
            setEditingClub(null);
            fetchClubs();
            alert('Club updated successfully!');
        } catch (err) {
            console.error('Error updating club:', err);
            alert('Failed to update club.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDeleteClub = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await api.delete(`/clubs/${id}`);
            fetchClubs();
            alert('Club deleted successfully.');
        } catch (err) {
            console.error('Error deleting club:', err);
            alert('Failed to delete club.');
        }
    };

    const categories = ['All', 'Academic', 'Technology', 'Arts', 'Cultural', 'Service', 'Social', 'Sports', 'Engineering', 'Entrepreneurship', 'Technical Societies'];

    const filteredClubs = clubs.filter(club => {
        const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || club.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 animate-fade-in relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Clubs Management</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center hover:bg-blue-900 transition-all shadow-md active:scale-95"
                >
                    <span className="mr-2 text-lg">+</span> Register New Club
                </button>
            </div>

            {/* Club Registration Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-8 md:p-10 w-full max-w-lg shadow-2xl animate-scale-up">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Register New Club</h3>
                                <p className="text-gray-500 text-sm font-medium mt-1">Official university club documentation</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-xl transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateClub} className="space-y-8">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Club Name</label>
                                <input 
                                    type="text" 
                                    value={clubName}
                                    onChange={(e) => setClubName(e.target.value)}
                                    placeholder="Enter full club name..."
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Club Category</label>
                                <select 
                                    value={clubCat}
                                    onChange={(e) => setClubCat(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900 appearance-none bg-[url('https://www.poornima.edu.in/wp-content/themes/poornima/images/down-arrow.png')] bg-[length:12px] bg-[right_24px_center] bg-no-repeat"
                                    required
                                >
                                    {categories.filter(c => c !== 'All').map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Club Description</label>
                                <textarea 
                                    value={clubDesc}
                                    onChange={(e) => setClubDesc(e.target.value)}
                                    placeholder="What's this club all about? (Mission, vision, and activities)"
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900 h-40 resize-none placeholder:text-gray-300"
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all active:scale-[0.98]"
                                >
                                    Discard
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={createLoading}
                                    className="flex-[1.5] py-4 bg-blue-800 text-white font-black rounded-2xl hover:bg-blue-900 transition-all active:scale-[0.98] shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center font-bold tracking-tight"
                                >
                                    {createLoading ? 'Processing...' : 'Create Club'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search clubs..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-50 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-colors text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                activeCategory === cat 
                                ? "bg-blue-800 text-white shadow-md shadow-blue-100" 
                                : "bg-white border-2 border-gray-50 text-gray-500 hover:text-gray-900 hover:border-gray-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center space-x-2 mb-8">
                <button className="bg-white border-2 border-gray-50 rounded-xl px-4 py-2 text-xs font-bold text-gray-900 shadow-sm flex items-center">
                    Grid View
                </button>
                <button className="bg-transparent border-2 border-transparent rounded-xl px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center transition-colors">
                    List View
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 rounded-3xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClubs.map((club, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button 
                                    onClick={() => handleEditClick(club)}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    title="Edit Club"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button 
                                    onClick={() => handleDeleteClub(club._id, club.name)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    title="Delete Club"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                            
                            <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{club.name}</h3>
                            <div className="flex items-center space-x-2 mb-6 text-[10px] font-black uppercase tracking-wider">
                                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{club.category || 'Technology'}</span>
                                <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-lg">Active</span>
                            </div>
                            
                            <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-8 h-10">
                                {club.description}
                            </p>
                            
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center text-gray-400 text-xs font-bold">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    89 members
                                </div>
                                <div className="flex items-center text-gray-400 text-xs font-bold">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    12 events
                                </div>
                            </div>
                            
                            <div className="flex items-center mb-6">
                                <div className="flex text-orange-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                </div>
                                <span className="text-xs font-black text-gray-900 ml-1.5">4.8</span>
                            </div>
                            
                            <div className="pt-6 border-t font-bold text-[11px] space-y-1">
                                <p className="text-gray-900 uppercase tracking-tight">Captain: <span className="text-gray-500 ml-1">Arjun Sharma</span></p>
                                <p className="text-gray-900 uppercase tracking-tight">Vice Captain: <span className="text-gray-500 ml-1">Rahul Gupta</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Club Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-8 md:p-10 w-full max-w-lg shadow-2xl animate-scale-up">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Edit Club Details</h3>
                                <p className="text-gray-500 text-sm font-medium mt-1">Updating information for {editingClub?.name}</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-xl transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateClub} className="space-y-8">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Club Name</label>
                                <input 
                                    type="text" 
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Club Category</label>
                                <select 
                                    value={editCat}
                                    onChange={(e) => setEditCat(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900 appearance-none bg-[url('https://www.poornima.edu.in/wp-content/themes/poornima/images/down-arrow.png')] bg-[length:12px] bg-[right_24px_center] bg-no-repeat"
                                    required
                                >
                                    {categories.filter(c => c !== 'All').map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Club Description</label>
                                <textarea 
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-gray-900 h-40 resize-none"
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={updateLoading}
                                    className="flex-[1.5] py-4 bg-blue-800 text-white font-black rounded-2xl hover:bg-blue-900 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-blue-100 font-bold tracking-tight"
                                >
                                    {updateLoading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminEventsView = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRegistrations = async () => {
        try {
            const res = await api.get('/events/registrations');
            setRegistrations(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching registrations:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    return (
        <div className="max-w-4xl space-y-12 animate-fade-in">
            <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Event Management</h2>
                <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Schedule New Event</h3>
                    </div>
                    <EventForm />
                </div>
            </div>

            <div className="pt-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Event Registrations</h3>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={fetchRegistrations}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:rotate-180 duration-500"
                            title="Refresh List"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                            {registrations.length} Total
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Student Name</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Reg Number</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Department</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Event Name</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Reg Date</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Ph Number</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            {[1, 2, 3, 4, 5, 6].map(j => <td key={j} className="px-6 py-6"><div className="h-4 bg-gray-100 rounded-lg w-full"></div></td>)}
                                        </tr>
                                    ))
                                ) : registrations.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center">
                                            <p className="text-gray-400 font-bold text-sm">No registrations found yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    registrations.map((reg, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-3">
                                                        {reg.name ? reg.name.charAt(0) : '?'}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">{reg.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-sm font-medium text-gray-600">{reg.registerNumber}</span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-600 uppercase tracking-tight">{reg.department}</span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-sm font-black text-gray-900 line-clamp-1">{reg.eventTitle}</span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-xs font-bold text-gray-400 italic">
                                                    {new Date(reg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-sm font-medium text-gray-600">{reg.phno}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminMembersView = ({ setActiveTab }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/clubs/join-request/all'); 
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
            const res = await api.put(`/clubs/join-request/${id}`, 
                { status }
            );
            alert(res.data.msg || `Request ${status} successfully`);
            fetchRequests(); // Refresh the list
        } catch (err) {
            console.error('Error updating request:', err);
            const errorMsg = err.response?.data?.msg || 'Failed to update request';
            alert(errorMsg);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Pending Member Approvals</h2>
                        <p className="text-gray-400 text-sm font-medium italic">Verify student details before admitting them to clubs</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>)
                ) : (
                    requests.map((req) => (
                        <div key={req._id} className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-100 hover:border-gray-200 transition-all flex flex-col md:flex-row md:items-center justify-between group">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{req.name}</h3>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg">
                                        {req.clubName}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                                    <div className="flex items-center text-gray-400 font-bold">
                                        <span className="w-24 uppercase text-[10px] tracking-widest text-gray-300">Register:</span>
                                        <span className="text-gray-600">{req.registerNumber || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-400 font-bold">
                                        <span className="w-24 uppercase text-[10px] tracking-widest text-gray-300">Email:</span>
                                        <span className="text-gray-600 font-medium lowercase italic">{req.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-400 font-bold">
                                        <span className="w-24 uppercase text-[10px] tracking-widest text-gray-300">Dept:</span>
                                        <span className="text-gray-600">{req.department || 'N/A'} - Year {req.year || '?'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-400 font-bold">
                                        <span className="w-24 uppercase text-[10px] tracking-widest text-gray-300">Date:</span>
                                        <span className="text-gray-500 font-medium">
                                            {new Date(req.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 mt-4 md:mt-0 min-w-[200px] justify-end">
                                {req.status === 'pending' ? (
                                    <>
                                        <button 
                                            onClick={() => handleAction(req._id, 'approved')}
                                            className="px-8 py-3 bg-black text-white rounded-2xl text-sm font-black hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(req._id, 'rejected')}
                                            className="px-8 py-3 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl text-sm font-black hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-95"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : req.status === 'approved' ? (
                                    <div className="flex items-center space-x-2 px-6 py-3 bg-green-50 text-green-600 rounded-2xl border-2 border-green-100">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        <span className="text-sm font-black uppercase tracking-wider">Approved</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl border-2 border-red-100">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                        <span className="text-sm font-black uppercase tracking-wider">Rejected</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                
                {requests.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-gray-400 font-black text-sm uppercase tracking-widest">All caught up!</p>
                        <p className="text-gray-400 text-xs mt-1">No pending member approvals at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const AdminAnnouncementsView = ({ adminId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await api.get('/announcements');
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
            const res = await api.post('/announcements',
                { title, content, createdBy: adminId }
            );
            alert('Announcement posted successfully!');
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
                const res = await api.get('/clubs');
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
            await api.post('/events',
                { title, description: desc, date, clubId }
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
