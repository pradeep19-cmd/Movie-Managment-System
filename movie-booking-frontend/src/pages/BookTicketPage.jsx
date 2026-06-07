import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Ticket, Film, Building2, Clock, Calendar, User, Mail, Users, CheckCircle } from 'lucide-react';
import movieService from '../services/movieService';
import showService from '../services/showService';
import bookingService from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from '../components/ToastContainer';

const STEPS = ['Select Movie', 'Select Show', 'Your Details', 'Confirm'];

const BookTicketPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    seatCount: 1,
  });

  // Pre-select from URL params
  useEffect(() => {
    const movieId = searchParams.get('movieId');
    const showId = searchParams.get('showId');

    movieService.getAllMovies().then((res) => {
      setMovies(res.data);
      if (movieId) {
        const m = res.data.find((x) => String(x.id) === movieId);
        if (m) {
          setSelectedMovie(m);
          setStep(1);
        }
      }
    }).catch(console.error);

    showService.getAllShows().then((res) => {
      setShows(res.data);
      if (showId) {
        const s = res.data.find((x) => String(x.id) === showId);
        if (s) {
          setSelectedShow(s);
          setStep(2);
        }
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [searchParams]);

  // Update shows when movie is selected
  const movieShows = shows.filter(
    (s) => String(s.movie?.id) === String(selectedMovie?.id)
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.customerName || !form.customerEmail || !form.seatCount) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (!selectedShow) {
      toast.error('Please select a show.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        seatCount: parseInt(form.seatCount),
        show: { id: selectedShow.id },
      };
      const res = await bookingService.createBooking(payload);
      setConfirmed(res.data);
      toast.success('Booking confirmed! 🎉');
    } catch (err) {
      toast.error(err.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading booking details..." />;

  if (confirmed) {
    const totalAmount = selectedShow?.ticketPrice * form.seatCount;
    return (
      <div className="max-w-lg mx-auto px-4 py-16 animate-slide-up">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400 mb-6">Your tickets are ready. Enjoy the movie!</p>

          <div className="bg-white/5 rounded-xl p-5 text-left space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Booking ID</span>
              <span className="text-white font-mono">#{confirmed.id || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Movie</span>
              <span className="text-white">{selectedMovie?.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Theater</span>
              <span className="text-white">{selectedShow?.theater?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date & Time</span>
              <span className="text-white">{selectedShow?.showDate} • {selectedShow?.showTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Seats</span>
              <span className="text-white">{form.seatCount}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="text-gray-400 font-semibold">Total Amount</span>
              <span className="text-white font-bold text-lg">₹{totalAmount}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate('/bookings')} className="flex-1 btn-secondary">
              My Bookings
            </button>
            <button onClick={() => navigate('/')} className="flex-1 btn-primary">
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <Ticket size={28} className="text-red-500" />
          Book Ticket
        </h1>
        <p className="text-gray-400 mt-1">Select your movie, show, and complete booking</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === step
                  ? 'bg-red-600 text-white'
                  : i < step
                  ? 'bg-emerald-600/20 border border-emerald-600/30 text-emerald-400'
                  : 'bg-white/5 border border-white/10 text-gray-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {i < step ? '✓' : i + 1}
              </span>
              {s}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-6 ${i < step ? 'bg-emerald-500' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Select Movie */}
      {step === 0 && (
        <div className="animate-slide-up">
          <p className="label mb-4">Choose a Movie</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {movies.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelectedMovie(m); setSelectedShow(null); setStep(1); }}
                className={`card p-0 overflow-hidden text-left transition-all duration-200 hover:-translate-y-1 ${
                  selectedMovie?.id === m.id ? 'border-red-500' : 'hover:border-red-500/40'
                }`}
              >
                <div className="aspect-[2/3] bg-white/5 overflow-hidden">
                  <img
                    src={movieService.getPosterUrl(m) || ''}
                    alt={m.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="p-3">
                  <p className="text-white font-semibold text-sm truncate">{m.title}</p>
                  <p className="text-gray-500 text-xs">{m.genre}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Select Show */}
      {step === 1 && (
        <div className="animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center">
              <Film size={18} className="text-red-400" />
            </div>
            <div>
              <p className="text-white font-bold">{selectedMovie?.title}</p>
              <p className="text-gray-500 text-xs">{selectedMovie?.genre} • {selectedMovie?.language}</p>
            </div>
          </div>

          <p className="label mb-4">Select a Show</p>
          {movieShows.length === 0 ? (
            <div className="card p-8 text-center">
              <Calendar size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No shows available for this movie.</p>
              <button onClick={() => setStep(0)} className="btn-ghost mt-4 text-sm">
                Pick another movie
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {movieShows.map((show) => (
                <button
                  key={show.id}
                  onClick={() => { setSelectedShow(show); setStep(2); }}
                  className={`w-full card p-4 text-left transition-all duration-200 hover:border-red-500/40 ${
                    selectedShow?.id === show.id ? 'border-red-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 size={16} className="text-blue-400 shrink-0" />
                      <div>
                        <p className="text-white font-semibold">{show.theater?.name}</p>
                        <p className="text-gray-500 text-xs">{show.theater?.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">₹{show.ticketPrice}</p>
                      <p className="text-gray-500 text-xs">per ticket</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={12} className="text-red-400" />{show.showDate}</span>
                    <span className="flex items-center gap-1"><Clock size={12} className="text-amber-400" />{show.showTime}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button onClick={() => setStep(0)} className="btn-ghost mt-4 text-sm">
            ← Change Movie
          </button>
        </div>
      )}

      {/* Step 2: Customer Details */}
      {step === 2 && (
        <div className="animate-slide-up">
          <div className="card p-5 mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Booking Summary</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Movie</p>
                <p className="text-white font-medium">{selectedMovie?.title}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Theater</p>
                <p className="text-white font-medium">{selectedShow?.theater?.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Date</p>
                <p className="text-white font-medium">{selectedShow?.showDate}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Time</p>
                <p className="text-white font-medium">{selectedShow?.showTime}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">
                <User size={14} className="inline mr-1 text-gray-500" />
                Full Name
              </label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleFormChange}
                placeholder="John Doe"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">
                <Mail size={14} className="inline mr-1 text-gray-500" />
                Email Address
              </label>
              <input
                type="email"
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleFormChange}
                placeholder="john@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">
                <Users size={14} className="inline mr-1 text-gray-500" />
                Number of Seats
              </label>
              <input
                type="number"
                name="seatCount"
                value={form.seatCount}
                onChange={handleFormChange}
                min={1}
                max={10}
                className="input-field"
              />
            </div>

            {selectedShow && form.seatCount > 0 && (
              <div className="bg-red-600/10 border border-red-600/20 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">
                    {form.seatCount} × ₹{selectedShow.ticketPrice}
                  </span>
                  <span className="text-white font-bold text-lg">
                    ₹{selectedShow.ticketPrice * form.seatCount}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="btn-ghost">← Back</button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.customerName || !form.customerEmail}
                className="btn-primary flex-1"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="animate-slide-up">
          <div className="card p-6 mb-6 space-y-4">
            <h3 className="text-white font-bold text-lg mb-2">Booking Summary</h3>
            {[
              ['Movie', selectedMovie?.title],
              ['Theater', selectedShow?.theater?.name],
              ['Location', selectedShow?.theater?.location],
              ['Date', selectedShow?.showDate],
              ['Time', selectedShow?.showTime],
              ['Seats', form.seatCount],
              ['Name', form.customerName],
              ['Email', form.customerEmail],
            ].map(([key, val]) => (
              <div key={key} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                <span className="text-gray-500">{key}</span>
                <span className="text-white font-medium">{val}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-gray-300 font-semibold">Total Amount</span>
              <span className="text-2xl font-black text-white">
                ₹{selectedShow?.ticketPrice * form.seatCount}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-ghost">← Edit</button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>
              ) : (
                <><Ticket size={16} />Confirm Booking</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTicketPage;
