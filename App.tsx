import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, Ticket as TicketIcon, Film, Music, Menu, X, CheckCircle, ChevronLeft } from 'lucide-react';
import { MOCK_MOVIES, MOCK_EVENTS, generateSeats } from './constants';
import { Movie, Event, Seat, Booking } from './types';
import SeatMap from './components/SeatMap';
import GeminiChat from './components/GeminiChat';

// --- Shared Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-dark-card border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <TicketIcon className="w-8 h-8 text-brand-500" />
            <span className="font-bold text-xl text-white tracking-tight">TicketWise</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors">Movies</Link>
            <Link to="/" className="text-slate-300 hover:text-white transition-colors">Events</Link>
            <Link to="/my-tickets" className="text-slate-300 hover:text-white transition-colors">My Tickets</Link>
            <Link to="/login" className="bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/20">
              Sign In
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-300">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-800 p-4 space-y-4 border-t border-slate-700">
          <Link to="/" className="block text-slate-300 hover:text-white" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/my-tickets" className="block text-slate-300 hover:text-white" onClick={() => setIsOpen(false)}>My Tickets</Link>
          <Link to="/login" className="block w-full text-left text-brand-400 font-medium" onClick={() => setIsOpen(false)}>Sign In</Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-20">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="flex justify-center items-center gap-2 mb-4">
        <TicketIcon className="w-6 h-6 text-brand-500 opacity-50" />
        <span className="text-slate-500 font-semibold">TicketWise</span>
      </div>
      <p className="text-slate-600 text-sm">© 2026 TicketWise. All rights reserved.</p>
    </div>
  </footer>
);

// --- Pages ---

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    if (email && password) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with blur */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/1920/1080?random=login&blur=5" 
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
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400">Sign in to access your tickets and bookings</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder-slate-600"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <button type="button" className="text-xs text-brand-400 hover:text-brand-300">Forgot password?</button>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder-slate-600"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/25 mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700 text-center text-sm text-slate-500">
          Don't have an account? <button className="text-brand-400 hover:text-brand-300 font-medium">Sign up</button>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<'movies' | 'events'>('movies');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMovies = MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredEvents = MOCK_EVENTS.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <img 
          src={MOCK_MOVIES[0].backdropUrl} 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <span className="px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block">
            Trending Now
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{MOCK_MOVIES[0].title}</h1>
          <p className="text-slate-300 max-w-xl mb-6 line-clamp-2 md:line-clamp-none">{MOCK_MOVIES[0].description}</p>
          <Link 
            to={`/movie/${MOCK_MOVIES[0].id}`}
            className="inline-flex items-center gap-2 bg-white text-dark-bg px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors"
          >
            <TicketIcon className="w-5 h-5" /> Book Tickets
          </Link>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex bg-dark-card p-1 rounded-full border border-slate-700">
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'movies' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Movies
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'events' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Events
            </button>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-card border border-slate-700 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeTab === 'movies' ? (
            filteredMovies.map(movie => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="group">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-xl">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-6 py-2 border-2 border-white text-white rounded-full font-medium">View Details</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-yellow-400 font-bold flex items-center gap-1 text-xs">
                    ★ {movie.rating}
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg truncate group-hover:text-brand-400 transition-colors">{movie.title}</h3>
                <p className="text-slate-500 text-sm">{movie.genre.join(', ')} • {movie.duration}</p>
              </Link>
            ))
          ) : (
            filteredEvents.map(event => (
              <Link to={`/event/${event.id}`} key={event.id} className="group">
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-xl">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-6 py-2 border-2 border-white text-white rounded-full font-medium">Book Now</span>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg truncate group-hover:text-brand-400 transition-colors">{event.title}</h3>
                <p className="text-slate-500 text-sm flex items-center gap-1"><MapPin className="w-3 h-3"/> {event.venue}</p>
                <p className="text-brand-400 font-medium mt-1">From ${event.priceMin}</p>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

const DetailsPage = () => {
  const { id } = useParams();
  const movie = MOCK_MOVIES.find(m => m.id === id);
  const event = MOCK_EVENTS.find(e => e.id === id);
  const item = movie || event;
  const isMovie = !!movie;

  if (!item) return <div className="text-center py-20 text-white">Item not found</div>;

  return (
    <div className="min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to browse
        </Link>
        
        <div className="grid md:grid-cols-3 gap-12">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-800 sticky top-24">
              <img 
                src={isMovie ? (item as Movie).posterUrl : (item as Event).imageUrl} 
                alt={item.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{item.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8 text-sm text-slate-400">
              {isMovie ? (
                <>
                  <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">{(item as Movie).duration}</span>
                  <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">{(item as Movie).genre.join(', ')}</span>
                  <span className="flex items-center gap-1 text-yellow-400"><span className="text-lg">★</span> {(item as Movie).rating}/5</span>
                </>
              ) : (
                <>
                  <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">{(item as Event).type.toUpperCase()}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {(item as Event).venue}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {(item as Event).date}</span>
                </>
              )}
            </div>

            <h3 className="text-xl font-bold mb-2 text-slate-200">Synopsis</h3>
            <p className="text-slate-300 leading-relaxed mb-8">{item.description}</p>

            {isMovie && (
              <>
                <h3 className="text-xl font-bold mb-2 text-slate-200">Cast</h3>
                <div className="flex gap-4 mb-8">
                  {(item as Movie).cast.map(actor => (
                    <div key={actor} className="bg-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300">
                      {actor}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="bg-dark-card border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-500" /> Select Showtime
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {['10:30 AM', '1:45 PM', '4:30 PM', '7:15 PM', '10:00 PM'].map((time) => (
                  <Link 
                    key={time}
                    to={`/book/${item.id}/${encodeURIComponent(time)}`}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-600 hover:border-brand-500 hover:bg-brand-500/10 transition-all cursor-pointer group"
                  >
                    <span className="text-white font-medium group-hover:text-brand-400">{time}</span>
                    <span className="text-xs text-slate-500 mt-1">Standard Hall</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingPage = () => {
  const { id, time } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState<Seat[]>(generateSeats(8, 10)); // 8 rows, 10 cols
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const item = MOCK_MOVIES.find(m => m.id === id) || MOCK_EVENTS.find(e => e.id === id);

  if (!item) return null;

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied') return;

    const isSelected = selectedSeats.find(s => s.id === seat.id);
    let newSelectedSeats;

    if (isSelected) {
      newSelectedSeats = selectedSeats.filter(s => s.id !== seat.id);
      // Update visual state in seats array
      setSeats(seats.map(s => s.id === seat.id ? { ...s, status: 'available' } : s));
    } else {
      if (selectedSeats.length >= 6) {
        alert("You can only select up to 6 seats.");
        return;
      }
      newSelectedSeats = [...selectedSeats, seat];
      // Update visual state
      setSeats(seats.map(s => s.id === seat.id ? { ...s, status: 'selected' } : s));
    }
    setSelectedSeats(newSelectedSeats);
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const bookingFee = selectedSeats.length * 1.5;

  const handleConfirm = () => {
    // Save booking to local storage (mock backend)
    const booking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      eventId: item.id,
      eventTitle: item.title,
      eventImage: 'posterUrl' in item ? item.posterUrl : item.imageUrl,
      seats: selectedSeats.map(s => `${s.row}${s.number}`),
      totalAmount: totalPrice + bookingFee,
      date: 'Today',
      time: decodeURIComponent(time || ''),
      venue: 'City Cinema, Hall 3',
      qrCode: 'mock-qr-code-string'
    };

    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));

    navigate('/confirmation', { state: { booking } });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="flex items-center gap-4 mb-6">
             <Link to={`/movie/${id}`} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white"><ChevronLeft className="w-5 h-5"/></Link>
             <div>
               <h2 className="text-2xl font-bold text-white">{item.title}</h2>
               <p className="text-slate-400 text-sm">{decodeURIComponent(time || '')} • City Cinema</p>
             </div>
           </div>
           
           <SeatMap seats={seats} onSeatClick={handleSeatClick} />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-dark-card border border-slate-700 rounded-2xl p-6 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>
            
            <div className="space-y-4 mb-6">
              {selectedSeats.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4 italic">Select seats to proceed</p>
              ) : (
                selectedSeats.map(seat => (
                  <div key={seat.id} className="flex justify-between text-slate-300 text-sm">
                    <span>Row {seat.row}, Seat {seat.number} ({seat.type === 'vip' ? 'VIP' : 'Std'})</span>
                    <span>${seat.price.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-700 pt-4 space-y-2">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Booking Fee</span>
                <span>${bookingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-2">
                <span>Total</span>
                <span>${(totalPrice + bookingFee).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={selectedSeats.length === 0}
              className="w-full mt-8 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-500/25 transition-all"
            >
              Checkout
            </button>
            <p className="text-xs text-center text-slate-500 mt-4">By booking, you agree to our Terms & Conditions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmationPage = () => {
  // In a real app we'd use useLocation() state, but for simplicity we rely on local storage or just a success message
  // Let's assume passed via navigation state for now.
  const [showConfetti, setShowConfetti] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-dark-card border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden">
        {showConfetti && <div className="absolute inset-0 bg-brand-500/10 animate-pulse pointer-events-none"></div>}
        
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
        <p className="text-slate-400 mb-8">Your tickets have been sent to your email.</p>
        
        <div className="flex flex-col gap-3">
          <Link to="/my-tickets" className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium transition-colors">
            View My Tickets
          </Link>
          <Link to="/" className="w-full bg-transparent hover:bg-slate-800 text-brand-400 py-3 rounded-xl font-medium transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const MyTicketsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bookings');
    if (saved) {
      setBookings(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">My Tickets</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-dark-card rounded-2xl border border-slate-700">
          <TicketIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-6">You haven't booked any tickets yet.</p>
          <Link to="/" className="px-6 py-2 bg-brand-600 text-white rounded-full hover:bg-brand-500">Discover Movies</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-dark-card border border-slate-700 rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-lg">
              <div className="sm:w-32 bg-slate-800 relative">
                 <img src={booking.eventImage} alt="" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white mb-1">{booking.eventTitle}</h3>
                <div className="text-sm text-slate-400 space-y-1 mb-4">
                  <p>{booking.date} at {booking.time}</p>
                  <p>{booking.venue}</p>
                  <p className="text-brand-400">Seats: {booking.seats.join(', ')}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-slate-500">Order ID: #{booking.id}</span>
                  <button className="text-sm text-white bg-slate-700 px-3 py-1 rounded hover:bg-slate-600">Download Ticket</button>
                </div>
              </div>
              <div className="border-l border-dashed border-slate-600 w-32 bg-white p-4 flex flex-col items-center justify-center">
                {/* Mock QR */}
                <div className="w-20 h-20 bg-black"></div>
                <span className="text-xs text-black font-mono mt-2 text-center">SCAN ME</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- App Layout ---

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-dark-text font-sans">
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<DetailsPage />} />
        <Route path="/event/:id" element={<DetailsPage />} />
        <Route path="/book/:id/:time" element={<BookingPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
      </Routes>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <GeminiChat />}
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
