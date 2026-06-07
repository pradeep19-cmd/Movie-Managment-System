import { useEffect, useState } from 'react';
import { BookOpen, Trash2, ChevronDown, ChevronUp, Search } from 'lucide-react';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { toast } from '../../components/ToastContainer';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    bookingService.getAllBookings()
      .then((r) => setBookings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await bookingService.cancelBooking(deleteTarget.id);
      toast.success('Booking cancelled.');
      setBookings((p) => p.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      !search ||
      b.customerName?.toLowerCase().includes(q) ||
      b.customerEmail?.toLowerCase().includes(q) ||
      b.show?.movie?.title?.toLowerCase().includes(q)
    );
  });

  // Totals
  const totalRevenue = bookings.reduce(
    (acc, b) => acc + (b.show?.ticketPrice || 0) * (b.seatCount || 0),
    0
  );
  const totalSeats = bookings.reduce((acc, b) => acc + (b.seatCount || 0), 0);

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <BookOpen size={24} className="text-emerald-400" />
            Booking Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">{loading ? '...' : `${bookings.length} total bookings`}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: bookings.length, color: 'text-white' },
          { label: 'Total Seats Sold', value: totalSeats, color: 'text-blue-400' },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, email, or movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-11"
        />
      </div>

      {loading ? (
        <LoadingSpinner message="Loading bookings..." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No bookings found" message={search ? 'Try a different search term.' : 'No bookings yet.'} />
      ) : (
        <div className="table-wrapper">
          <table className="table-base">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Movie</th>
                <th>Theater</th>
                <th>Date & Time</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => {
                const show = booking.show || {};
                const totalAmount = (show.ticketPrice || 0) * (booking.seatCount || 0);
                const isExpanded = expanded === booking.id;

                return (
                  <>
                    <tr key={booking.id}>
                      <td className="font-mono text-gray-600 text-xs">#{booking.id}</td>
                      <td>
                        <p className="text-white font-medium">{booking.customerName}</p>
                        <p className="text-gray-500 text-xs">{booking.customerEmail}</p>
                      </td>
                      <td className="text-gray-300">{show.movie?.title || '—'}</td>
                      <td className="text-gray-300">{show.theater?.name || '—'}</td>
                      <td>
                        <p className="text-gray-300 text-xs">{show.showDate}</p>
                        <p className="text-gray-500 text-xs">{show.showTime}</p>
                      </td>
                      <td><span className="badge-success">{booking.seatCount}</span></td>
                      <td className="text-white font-semibold">₹{totalAmount}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpanded(isExpanded ? null : booking.id)}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(booking)}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${booking.id}-exp`} className="bg-white/3">
                        <td colSpan={8} className="px-4 py-3">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            {[
                              ['Booking ID', `#${booking.id}`],
                              ['Genre', show.movie?.genre],
                              ['Language', show.movie?.language],
                              ['Theater Location', show.theater?.location],
                              ['Price/Ticket', `₹${show.ticketPrice}`],
                              ['Seats', booking.seatCount],
                            ].map(([k, v]) => (
                              <div key={k}>
                                <p className="text-gray-500">{k}</p>
                                <p className="text-gray-200 font-medium">{v || '—'}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Cancel Booking" size="sm">
        <div className="text-center">
          <Trash2 size={32} className="text-red-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-1">Cancel this booking?</p>
          <p className="text-white font-bold mb-1">{deleteTarget?.customerName}</p>
          <p className="text-gray-500 text-sm mb-6">{deleteTarget?.show?.movie?.title}</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 btn-ghost border border-white/10">Keep</button>
            <button onClick={handleDelete} disabled={deleting} className="flex-1 btn-danger">{deleting ? 'Cancelling...' : 'Cancel Booking'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBookings;
