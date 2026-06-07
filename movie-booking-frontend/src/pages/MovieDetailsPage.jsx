import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Globe, Tag, Calendar, Ticket, Star } from 'lucide-react';
import movieService from '../services/movieService';
import showService from '../services/showService';
import LoadingSpinner from '../components/LoadingSpinner';

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='560' viewBox='0 0 400 560'%3E%3Crect width='400' height='560' fill='%231c1c2e'/%3E%3Ctext x='200' y='280' text-anchor='middle' dy='.3em' fill='%2360607a' font-size='18' font-family='sans-serif'%3ENo Poster%3C/text%3E%3C/svg%3E";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      movieService.getMovieById(id),
      showService.getShowsByMovie(id),
    ])
      .then(([movieRes, showsRes]) => {
        setMovie(movieRes.data);
        setShows(showsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading movie details..." />;
  if (!movie) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-400 text-lg">Movie not found.</p>
      <button onClick={() => navigate('/movies')} className="btn-primary mt-4">
        Back to Movies
      </button>
    </div>
  );

  const posterUrl = movieService.getPosterUrl(movie) || PLACEHOLDER;

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden mb-12">
        {/* Blurred background poster */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-20"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Poster */}
            <div className="shrink-0">
              <div className="w-60 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10">
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge-primary">{movie.genre}</span>
                <span className="badge-info">{movie.language}</span>
              </div>
              <h1 className="text-4xl font-black text-white mb-3">{movie.title}</h1>

              <div className="flex flex-wrap gap-5 mb-6 text-gray-400 text-sm">
                <span className="flex items-center gap-1.5">
                  <Clock size={15} className="text-red-400" />
                  {movie.duration} minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe size={15} className="text-blue-400" />
                  {movie.language}
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag size={15} className="text-amber-400" />
                  {movie.genre}
                </span>
              </div>

              {movie.description && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Synopsis</h3>
                  <p className="text-gray-300 leading-relaxed max-w-2xl">{movie.description}</p>
                </div>
              )}

              <Link
                to={`/book-ticket?movieId=${movie.id}`}
                className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base"
              >
                <Ticket size={18} />
                Book Ticket
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Shows Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="section-title flex items-center gap-2 mb-6">
          <Calendar size={22} className="text-red-500" />
          Available Shows
        </h2>

        {shows.length === 0 ? (
          <div className="card p-10 text-center">
            <Calendar size={36} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No shows scheduled yet for this movie.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shows.map((show) => (
              <div key={show.id} className="card p-5 hover:border-red-600/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">
                      {show.theater?.name || 'Theater'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {show.theater?.location || ''}
                    </p>
                  </div>
                  <span className="badge-success text-xs">Available</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-red-400" />
                    {show.showDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-blue-400" />
                    {show.showTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Ticket Price</p>
                    <p className="text-lg font-bold text-white">
                      ₹{show.ticketPrice}
                    </p>
                  </div>
                  <Link
                    to={`/book-ticket?movieId=${movie.id}&showId=${show.id}`}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
