import { useEffect, useState } from 'react';
import { Film, Building2, Calendar, BookOpen, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import movieService from '../../services/movieService';
import theaterService from '../../services/theaterService';
import showService from '../../services/showService';
import bookingService from '../../services/bookingService';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <div className="card p-5 flex items-center gap-4 hover:border-white/20 transition-colors">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white font-black text-2xl">{value}</p>
    </div>
    {trend && (
      <div className="text-emerald-400 text-xs font-medium flex items-center gap-1">
        <TrendingUp size={12} /> {trend}
      </div>
    )}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ movies: 0, theaters: 0, shows: 0, bookings: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      movieService.getAllMovies(),
      theaterService.getAllTheaters(),
      showService.getAllShows(),
      bookingService.getAllBookings(),
    ]).then(([m, t, s, b]) => {
      const movies = m.status === 'fulfilled' ? m.value.data : [];
      const theaters = t.status === 'fulfilled' ? t.value.data : [];
      const shows = s.status === 'fulfilled' ? s.value.data : [];
      const bookings = b.status === 'fulfilled' ? b.value.data : [];

      setStats({
        movies: movies.length,
        theaters: theaters.length,
        shows: shows.length,
        bookings: bookings.length,
      });
      setRecentBookings(bookings.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your cinema management system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Film} label="Total Movies" value={loading ? '—' : stats.movies} color="bg-red-600" />
        <StatCard icon={Building2} label="Theaters" value={loading ? '—' : stats.theaters} color="bg-blue-600" />
        <StatCard icon={Calendar} label="Shows" value={loading ? '—' : stats.shows} color="bg-purple-600" />
        <StatCard icon={BookOpen} label="Bookings" value={loading ? '—' : stats.bookings} color="bg-emerald-600" />
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Add Movie', to: '/admin/movies', icon: Film, color: 'from-red-600 to-red-800' },
            { label: 'Add Theater', to: '/admin/theaters', icon: Building2, color: 'from-blue-600 to-blue-800' },
            { label: 'Create Show', to: '/admin/shows', icon: Calendar, color: 'from-purple-600 to-purple-800' },
            { label: 'View Bookings', to: '/admin/bookings', icon: BookOpen, color: 'from-emerald-600 to-emerald-800' },
          ].map((a) => (
            <a
              key={a.label}
              href={a.to}
              className={`relative overflow-hidden card p-5 hover:scale-[1.02] transition-transform duration-200 bg-gradient-to-br ${a.color} border-0`}
            >
              <a.icon size={24} className="text-white/80 mb-3" />
              <p className="text-white font-semibold">{a.label}</p>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full" />
            </a>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity size={18} className="text-red-500" />
            Recent Bookings
          </h2>
          <a href="/admin/bookings" className="text-red-400 hover:text-red-300 text-sm transition-colors">
            View All →
          </a>
        </div>

        {loading ? (
          <div className="card p-8 text-center text-gray-500">Loading...</div>
        ) : recentBookings.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">No bookings yet.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Customer</th>
                  <th>Movie</th>
                  <th>Theater</th>
                  <th>Seats</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="font-mono text-gray-500">#{b.id}</td>
                    <td>
                      <p className="text-white font-medium">{b.customerName}</p>
                      <p className="text-gray-500 text-xs">{b.customerEmail}</p>
                    </td>
                    <td className="text-gray-300">{b.show?.movie?.title || '—'}</td>
                    <td className="text-gray-300">{b.show?.theater?.name || '—'}</td>
                    <td><span className="badge-success">{b.seatCount}</span></td>
                    <td className="text-white font-semibold">
                      ₹{(b.show?.ticketPrice || 0) * b.seatCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
