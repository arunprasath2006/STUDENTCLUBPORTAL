import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const EventCard = ({ event, onRSVP }) => {
    const { user } = useContext(AuthContext);
    const isAttending = user && event.attendees.includes(user._id);

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                    {event.club && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{event.club.name}</span>}
                </div>

                <div className="text-sm text-gray-500 mb-4 space-y-1">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>{formatTime(event.date)}</span>
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>{event.location || 'TBD'}</span>
                    </div>
                </div>

                <div className="text-sm text-gray-500 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>{event.attendees ? event.attendees.length : 0} attending</span>
                </div>
            </div>

            <div className="mt-2">
                {isAttending ? (
                    <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-semibold cursor-default">Confirmed</button>
                ) : (
                    <button
                        onClick={() => onRSVP(event)}
                        className="w-full bg-black text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        Register
                    </button>
                )}
            </div>
        </div>
    );
};

export default EventCard;
