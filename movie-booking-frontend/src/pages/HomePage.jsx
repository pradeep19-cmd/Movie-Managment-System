import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Film, Ticket, Star, TrendingUp, Play } from 'lucide-react';
import movieService from '../services/movieService';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

const GENRES = ['All', 'Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller'];

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('All');

  useEffect(() => {
    movieService.getAllMovies()
      .then((res) => setMovies(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featured = movies[0];
  const filtered =
    activeGenre === 'All'
      ? movies.slice(0, 8)
      : movies.filter((m) => m.genre === activeGenre).slice(0, 8);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.15),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="flex items-center gap-2 mb-6">
                <span className="badge-primary">
                  <TrendingUp size={10} />
                  Now Showing
                </span>
                <span className="badge-info">New Releases</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                Book Your{' '}
                <span className="gradient-text">Perfect</span>{' '}
                Movie Experience
              </h1>
              <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
                Discover the latest blockbusters, choose your seats, and enjoy a seamless
                booking experience powered by CineBook.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/movies" className="btn-primary flex items-center gap-2 text-base px-8 py-3">
                  <Film size={18} />
                  Browse Movies
                </Link>
                <Link to="/book-ticket" className="btn-secondary flex items-center gap-2 text-base px-8 py-3">
                  <Ticket size={18} />
                  Book Now
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 flex gap-8">
                {[
                  { label: 'Movies', value: movies.length || '50+' },
                  { label: 'Screens', value: '12+' },
                  { label: 'Cities', value: '8+' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-gray-500 text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Movie Card */}
            {featured && (
              <div className="hidden lg:block relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 to-transparent rounded-3xl blur-2xl" />
                <div className="relative card overflow-hidden group">
                  <img
                    src={movieService.getPosterUrl(featured) || ''}
                    alt={featured.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="badge-primary mb-2 block w-fit">Featured</span>
                    <h3 className="text-2xl font-bold text-white mb-1">{featured.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{featured.genre} • {featured.language} • {featured.duration} min</p>
                    <Link
                      to={`/book-ticket?movieId=${featured.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all text-sm"
                    >
                      <Play size={14} fill="white" />
                      Book Ticket
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Now Showing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <Star size={22} className="text-red-500" />
              Now Showing
            </h2>
            <p className="section-subtitle">Latest movies available for booking</p>
          </div>
          <Link to="/movies" className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {/* Genre Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeGenre === g
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner message="Loading movies..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No movies in this genre yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {!loading && movies.length > 8 && (
          <div className="text-center mt-10">
            <Link to="/movies" className="btn-secondary inline-flex items-center gap-2">
              Load More Movies <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-purple-900/20" />
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl font-black text-white mb-4">
            Ready for Your Next Movie Night?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Pick a movie, select your show, and grab your tickets in seconds.
          </p>
          <Link to="/book-ticket" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            <Ticket size={18} />
            Book a Ticket Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
