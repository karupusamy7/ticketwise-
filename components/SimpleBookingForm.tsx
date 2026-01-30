import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, arrayUnion, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

interface SimpleBookingFormProps {
    eventId: string;
    eventTitle: string;
    eventImage: string;
    eventDate?: string;
    eventVenue?: string;
    onSuccess?: () => void;
}

const SimpleBookingForm: React.FC<SimpleBookingFormProps> = ({
    eventId,
    eventTitle,
    eventImage,
    eventDate = 'Today',
    eventVenue = 'City Arena',
    onSuccess
}) => {
    const { user, userData } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: userData?.name || '',
        email: user?.email || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (!formData.name.trim() || !formData.email.trim()) {
            setLoading(false);
            return setError('Please fill in all fields');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setLoading(false);
            return setError('Please enter a valid email address');
        }

        try {
            // Create booking document
            const bookingRef = `BK${Date.now()}`;
            const bookingData = {
                bookingRef,
                eventId,
                eventTitle,
                eventImage,
                eventDate,
                eventVenue,
                customerName: formData.name.trim(),
                customerEmail: formData.email.trim(),
                userId: user?.uid || null,
                status: 'confirmed',
                createdAt: serverTimestamp(),
                aiRecommended: true // Mark as AI-recommended per PRD
            };

            // Save to Firestore
            const bookingDoc = await addDoc(collection(db, 'bookings'), bookingData);

            // Also update user's bookings array if logged in
            if (user?.uid) {
                await updateDoc(doc(db, 'users', user.uid), {
                    bookings: arrayUnion(bookingDoc.id),
                    updatedAt: serverTimestamp()
                });
            }

            // Also save to localStorage for immediate access
            const localBooking = {
                id: bookingDoc.id,
                ...bookingData,
                createdAt: new Date().toISOString()
            };
            const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            localStorage.setItem('bookings', JSON.stringify([...existingBookings, localBooking]));

            // Navigate to confirmation
            navigate('/confirmation', {
                state: {
                    booking: localBooking,
                    isAiRecommended: true
                }
            });

            onSuccess?.();

        } catch (err: any) {
            console.error('Booking error:', err);
            setLoading(false);
            setError('Failed to complete booking. Please try again.');
        }
    };

    return (
        <div className="bg-dark-card border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <h3 className="text-xl font-bold text-white">Quick Booking</h3>
            </div>

            {/* Event Summary */}
            <div className="flex gap-4 mb-6 pb-6 border-b border-slate-700">
                <img
                    src={eventImage}
                    alt={eventTitle}
                    className="w-20 h-28 object-cover rounded-lg"
                />
                <div>
                    <h4 className="text-white font-semibold">{eventTitle}</h4>
                    <p className="text-sm text-slate-400">{eventDate}</p>
                    <p className="text-sm text-slate-400">{eventVenue}</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder-slate-600"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder-slate-600"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Confirm Booking
                        </>
                    )}
                </button>
            </form>

            <p className="text-xs text-center text-slate-500 mt-4">
                By booking, you agree to our Terms & Conditions. <br />
                Confirmation will be sent to your email.
            </p>
        </div>
    );
};

export default SimpleBookingForm;
