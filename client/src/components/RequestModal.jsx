import React, { useState, useEffect } from 'react';

const RequestModal = ({ title, subtitle, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        registerNumber: '',
        department: '',
        year: '',
        phno: '',
        email: ''
    });

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const isValid = Object.values(formData).every(field => field.trim() !== '');
        setIsFormValid(isValid);
    }, [formData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                        <input 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Register Number</label>
                        <input 
                            name="registerNumber"
                            value={formData.registerNumber}
                            onChange={handleChange}
                            placeholder="Enter your register number"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Department</label>
                            <input 
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="e.g. CSE"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Academic Year</label>
                            <input 
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="e.g. 3rd Year"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                        <input 
                            name="phno"
                            value={formData.phno}
                            onChange={handleChange}
                            placeholder="Enter contact number"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={!isFormValid}
                            className={`w-full py-4 rounded-lg font-bold text-white transition-all transform active:scale-[0.98] ${
                                isFormValid 
                                ? 'bg-black hover:bg-gray-800 shadow-lg cursor-pointer' 
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestModal;
