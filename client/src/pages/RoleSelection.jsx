import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Campus Connect</h1>
                <p className="text-gray-600 text-lg">Please select your portal to continue</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/* Student Portal Option */}
                <div 
                    onClick={() => navigate('/login/student')}
                    className="group cursor-pointer bg-white border-2 border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-black transition-all duration-300 transform hover:-translate-y-2"
                >
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Portal</h3>
                    <p className="text-gray-500 mb-6">Access clubs, events, and manage your student profile.</p>
                    <div className="flex items-center text-black font-semibold group-hover:translate-x-2 transition-transform">
                        Login as Student
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>

                {/* Admin Portal Option */}
                <div 
                    onClick={() => navigate('/login/admin')}
                    className="group cursor-pointer bg-white border-2 border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-black transition-all duration-300 transform hover:-translate-y-2"
                >
                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h3>
                    <p className="text-gray-500 mb-6">Manage dashboard, track requests, and oversee campus activities.</p>
                    <div className="flex items-center text-black font-semibold group-hover:translate-x-2 transition-transform">
                        Login as Admin
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </div>
            
            <p className="mt-12 text-gray-400 text-sm italic">"Connecting the campus community, one click at a time."</p>
        </div>
    );
};

export default RoleSelection;
