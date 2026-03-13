import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ClubCard = ({ club, onJoin }) => {
    const { user } = useContext(AuthContext);

    const isMember = user && club.members.some(member => (member._id || member) === user._id);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{club.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{club.category || 'Club'}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{club.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        <span>{club.members ? club.members.length : 0}</span>
                    </div>
                    {/* Placeholder for events count */}
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span>-- events</span>
                    </div>
                </div>
            </div>

            <div>
                {isMember ? (
                    <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-semibold cursor-default">Joined</button>
                ) : (
                    <button
                        onClick={() => onJoin(club)}
                        className="w-full bg-black text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        Join
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClubCard;
