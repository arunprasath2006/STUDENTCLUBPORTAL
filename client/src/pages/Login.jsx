import React, { useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const { role } = useParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl mb-4 font-bold text-center capitalize">{role} Login</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 border rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-4">Login</button>
                <p className="text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
