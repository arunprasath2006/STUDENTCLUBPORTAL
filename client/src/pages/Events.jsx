import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import RequestModal from '../components/RequestModal';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/events');
                setEvents(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEvents();
    }, []);

    const handleRegisterClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            console.log('Submitting registration for:', selectedEvent.title, formData);
            
            await axios.post('http://localhost:5000/api/events/register', {
                eventId: selectedEvent._id,
                eventTitle: selectedEvent.title,
                ...formData
            });
            
            alert(`Registration for ${selectedEvent.title} submitted successfully!`);
            setIsModalOpen(false);
            setSelectedEvent(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Error submitting registration');
        }
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
                <p className="text-gray-600">Discover and RSVP to upcoming campus events</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search events..."
                    className="flex-grow p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-100">
                    Filter by date
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                    <EventCard key={event._id} event={event} onRSVP={handleRegisterClick} />
                ))}
                {filteredEvents.length === 0 && (
                    <p className="text-gray-500 col-span-3 text-center py-8">No events found matching your search.</p>
                )}
            </div>

            {selectedEvent && (
                <RequestModal 
                    title={`Register for ${selectedEvent.title}`}
                    subtitle="Please fill in your details to register for this event"
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default Events;
