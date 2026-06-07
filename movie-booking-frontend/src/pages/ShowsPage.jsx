import { useEffect, useState } from 'react';
import { Calendar, Clock, Film, Building2, DollarSign } from 'lucide-react';
import showService from '../services/showService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

const ShowsPage = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    showService.getAllShows()
      .then((res) => setShows(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Group shows by date
  const grouped = shows.reduce((acc, show) => {
    const date = show.showDate || 'Unknown';
    if (!acc[date]) acc[date] = [];
    acc[date].push(show);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1 flex items-center gap-2">
          <Calendar size={28} className="text-red-500" />
          All Shows
        </h1>
        <p className="text-gray-400">Browse all scheduled movie shows</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading shows..." />
      ) : shows.length === 0 ? (
        <EmptyState icon={Calendar} title="No shows available" message="Check back soon for upcoming shows." />
      ) : (
        <div className="space-y-10">
          {sortedDates.map((date) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-600/20 border border-red-600/30 rounded-xl flex items-center justify-center">
                  <Calendar size={18} className="text-red-400" />
                </div>
                <div>
                  <p className="font-bold text-white">{date}</p>
                  <p className="text-xs text-gray-500">{grouped[date].length} show{grouped[date].length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[date].map((show) => (
                  <div key={show.id} className="card p-5 hover:border-red-600/30 transition-all duration-200 group">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                        <Film size={18} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white truncate">
                          {show.movie?.title || 'Movie'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {show.movie?.genre} • {show.movie?.language}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={13} className="text-blue-400 shrink-0" />
                        <span className="truncate">{show.theater?.name} — {show.theater?.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-amber-400 shrink-0" />
                        {show.showTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={13} className="text-emerald-400 shrink-0" />
                        ₹{show.ticketPrice} per ticket
                      </div>
                    </div>

                    <Link
                      to={`/book-ticket?showId=${show.id}&movieId=${show.movie?.id}`}
                      className="btn-primary w-full text-center block text-sm py-2"
                    >
                      Book Now
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowsPage;
