import { useEffect, useState, useCallback } from 'react';
import { Search, SlidersHorizontal, Film } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import movieService from '../services/movieService';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const GENRES = ['All', 'Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller'];
const LANGUAGES = ['All', 'English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam'];

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState('All');
  const [language, setLanguage] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const fetchMovies = useCallback(() => {
    setLoading(true);
    movieService.getAllMovies()
      .then((res) => setMovies(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  // Update search from URL param
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = movies.filter((m) => {
    const matchSearch =
      !search ||
      m.title?.toLowerCase().includes(search.toLowerCase()) ||
      m.genre?.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre === 'All' || m.genre === genre;
    const matchLang = language === 'All' || m.language === language;
    return matchSearch && matchGenre && matchLang;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1 flex items-center gap-2">
          <Film size={28} className="text-red-500" />
          All Movies
        </h1>
        <p className="text-gray-400">
          {loading ? 'Loading...' : `${filtered.length} movie${filtered.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search movies by title or genre..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchParams(e.target.value ? { search: e.target.value } : {});
            }}
            className="input-field pl-11"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
            showFilters
              ? 'border-red-500 bg-red-500/10 text-red-400'
              : 'border-white/10 bg-white/5 text-gray-400 hover:border-red-500/50 hover:text-white'
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {(genre !== 'All' || language !== 'All') && (
            <span className="w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-5 mb-6 animate-slide-up">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="label">Genre</p>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      genre === g
                        ? 'bg-red-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label">Language</p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      language === l
                        ? 'bg-red-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {(genre !== 'All' || language !== 'All') && (
            <button
              onClick={() => { setGenre('All'); setLanguage('All'); }}
              className="mt-4 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <LoadingSpinner message="Fetching movies..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Film}
          title="No movies found"
          message="Try adjusting your search or filters"
          action={
            search || genre !== 'All' || language !== 'All'
              ? {
                  label: 'Clear filters',
                  onClick: () => {
                    setSearch('');
                    setGenre('All');
                    setLanguage('All');
                    setSearchParams({});
                  },
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
          {filtered.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
