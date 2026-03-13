import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClubCard from '../components/ClubCard';
import RequestModal from '../components/RequestModal';

const Clubs = () => {
    const [clubs, setClubs] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedClub, setSelectedClub] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleJoinClick = (club) => {
        setSelectedClub(club);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            console.log('Submitting join request for:', selectedClub.name, formData);
            
            await axios.post('http://localhost:5000/api/clubs/join-request', {
                clubId: selectedClub._id,
                clubName: selectedClub.name,
                ...formData
            });
            
            alert(`Request to join ${selectedClub.name} submitted successfully!`);
            setIsModalOpen(false);
            setSelectedClub(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Error submitting request');
        }
    };

    const filteredClubs = clubs.filter(club =>
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Clubs</h1>
                <p className="text-gray-600">Browse and join clubs that match your interests</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search clubs..."
                    className="flex-grow p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-100">
                    Filter by category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map(club => (
                    <ClubCard key={club._id} club={club} onJoin={handleJoinClick} />
                ))}
                {filteredClubs.length === 0 && (
                    <p className="text-gray-500 col-span-3 text-center py-8">No clubs found matching your search.</p>
                )}
            </div>

            {selectedClub && (
                <RequestModal 
                    title={`Join ${selectedClub.name}`}
                    subtitle="Please fill in your details to request membership"
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default Clubs;
