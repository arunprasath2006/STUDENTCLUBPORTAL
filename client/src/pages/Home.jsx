import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import RequestModal from '../components/RequestModal';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState(null); // 'club' or 'event'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clubsRes = await axios.get('http://localhost:5000/api/clubs');
                setClubs(clubsRes.data);
                const eventsRes = await axios.get('http://localhost:5000/api/events');
                setEvents(eventsRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

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
                    <button className="w-full mt-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 text-sm font-medium">View All Events</button>
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
                    <button className="w-full mt-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 text-sm font-medium">View All Clubs</button>
                </div>
            </div>

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
