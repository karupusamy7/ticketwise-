import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket as TicketIcon } from 'lucide-react';

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Show loading while checking auth state
    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">Checking authentication...</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validation
            if (formData.password !== formData.confirmPassword) {
                setLoading(false); // CRITICAL: Reset loading on validation failure
                return setError('Passwords do not match');
            }
            if (formData.password.length < 6) {
                setLoading(false); // CRITICAL: Reset loading on validation failure
                return setError('Password must be at least 6 characters');
            }

            const { email, password, name } = formData;

            // Signup with Firebase
            await signup(email, password, { name });

            // CRITICAL: Explicit navigation after successful signup
            navigate('/', { replace: true });

        } catch (err: any) {
            console.error('Signup error:', err);
            setLoading(false); // CRITICAL: Reset loading on error

            // Handle specific Firebase errors
            const errorMessages: { [key: string]: string } = {
                'auth/email-already-in-use': 'An account with this email already exists',
                'auth/invalid-email': 'Please enter a valid email address',
                'auth/weak-password': 'Password must be at least 6 characters',
                'auth/operation-not-allowed': 'Email/password accounts are not enabled',
                'auth/network-request-failed': 'Network error. Please check your connection',
            };
            setError(errorMessages[err.code] || 'Failed to create account. Please try again.');
        }
        // NOTE: Don't setLoading(false) here on success - navigation handles unmount
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-bg">
            {/* Background with blur */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://picsum.photos/1920/1080?random=signup&blur=5"
                    alt="Background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/90 to-dark-bg"></div>
            </div>

            <div className="w-full max-w-md bg-dark-card border border-slate-700 p-8 rounded-2xl shadow-2xl relative z-10 mx-4 animate-fade-in">
                <div className="text-center mb-8">
                    <Link to="/" className="flex justify-center mb-4 hover:scale-105 transition-transform">
                        <div className="bg-brand-500/10 p-3 rounded-full">
                            <TicketIcon className="w-10 h-10 text-brand-500" />
                        </div>
                    </Link>
                    <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-slate-400">Join TicketWise to book tickets today</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder-slate-600"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder-slate-600"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder-slate-600"
                            placeholder="At least 6 characters"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder-slate-600"
                            placeholder="Repeat password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/25 mt-4 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-700 text-center text-sm text-slate-500">
                    Already have an account? <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
