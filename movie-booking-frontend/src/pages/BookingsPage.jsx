import { useEffect, useState } from 'react';
import { BookOpen, Calendar, Clock, Trash2, ChevronDown, ChevronUp, Film, Building2 } from 'lucide-react';
import bookingService from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { toast } from '../components/ToastContainer';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [canceling, setCanceling] = useState(false);

  const fetchBookings = () => {
    bookingService.getAllBookings()
      .then((res) => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCanceling(true);
    try {
      await bookingService.cancelBooking(cancelTarget.id);
      toast.success('Booking cancelled successfully.');
      setBookings((prev) => prev.filter((b) => b.id !== cancelTarget.id));
      setCancelTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking.');
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <BookOpen size={28} className="text-red-500" />
          My Bookings
        </h1>
        <p className="text-gray-400 mt-1">View and manage your ticket bookings</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your bookings..." />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No bookings yet"
          message="Book your first movie ticket to see it here."
          action={{ label: 'Browse Movies', onClick: () => window.location.href = '/movies' }}
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const show = booking.show || {};
            const movie = show.movie || {};
            const theater = show.theater || {};
            const isExpanded = expanded === booking.id;
            const totalAmount = (show.ticketPrice || 0) * (booking.seatCount || 1);

            return (
              <div
                key={booking.id}
                className="card overflow-hidden transition-all duration-200 hover:border-white/20"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-600/20 border border-red-600/30 rounded-xl flex items-center justify-center shrink-0">
                      <Film size={18} className="text-red-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-white font-bold truncate">{movie.title || 'N/A'}</p>
                          <p className="text-gray-500 text-sm">{booking.customerName}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="badge-success">{booking.seatCount} seat{booking.seatCount !== 1 ? 's' : ''}</span>
                          <span className="text-white font-bold">₹{totalAmount}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Building2 size={11} className="text-blue-400" />
                          {theater.theaterName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-red-400" />
                          {show.showDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-amber-400" />
                          {show.showTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setExpanded(isExpanded ? null : booking.id)}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button
                        onClick={() => setCancelTarget(booking)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Cancel Booking"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-white/8 px-5 py-4 bg-white/3 animate-slide-up">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      {[
                        ['Booking ID', `#${booking.id}`],
                        ['Customer Email', booking.customerEmail],
                        ['Genre', movie.genre],
                        ['Language', movie.language],
                        ['Duration', movie.duration ? `${movie.duration} min` : 'N/A'],
                        ['Price/Ticket', `₹${show.ticketPrice}`],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <p className="text-gray-500 text-xs">{k}</p>
                          <p className="text-gray-200 font-medium mt-0.5">{v || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel Booking"
        size="sm"
      >
        <div className="text-center">
          <div className="w-14 h-14 bg-red-600/20 border border-red-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-400" />
          </div>
          <p className="text-gray-300 mb-2">Are you sure you want to cancel this booking?</p>
          <p className="text-gray-500 text-sm mb-6">
            <strong className="text-white">{cancelTarget?.show?.movie?.title}</strong> — {cancelTarget?.customerName}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setCancelTarget(null)}
              className="flex-1 btn-ghost border border-white/10"
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancel}
              disabled={canceling}
              className="flex-1 btn-danger"
            >
              {canceling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingsPage;
