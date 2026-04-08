import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/announcements');
                setAnnouncements(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching announcements:', err);
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    const getBadgeColor = (audience) => {
        switch (audience) {
            case 'All': return 'bg-purple-100 text-purple-600';
            case 'Students': return 'bg-blue-100 text-blue-600';
            case 'Faculty': return 'bg-amber-100 text-amber-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="py-12 animate-fade-in max-w-5xl mx-auto">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Announcements</h1>
                    <p className="text-gray-500 font-medium text-lg">Stay updated with the latest news from the campus</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    <span className="text-blue-700 text-sm font-black uppercase tracking-wider">{announcements.length} Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-white rounded-[32px] border-2 border-dashed border-gray-100 animate-pulse"></div>
                    ))
                ) : announcements.length > 0 ? (
                    announcements.map((ann) => (
                        <div key={ann._id} className="bg-white p-8 rounded-[32px] border-2 border-dashed border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getBadgeColor(ann.targetAudience)}`}>
                                        {ann.targetAudience}
                                    </span>
                                    <span className="text-xs text-gray-400 font-bold italic">
                                        {new Date(ann.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                                    {ann.title}
                                </h2>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {ann.content}
                                </p>
                                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-[10px] font-black italic">AP</div>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Official Announcement</span>
                                    </div>
                                    <button className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center group-hover:translate-x-1 transition-transform">
                                        Read More <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm mx-auto flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">No Announcements Yet</h3>
                        <p className="text-gray-400 font-medium">Check back later for news and updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;
