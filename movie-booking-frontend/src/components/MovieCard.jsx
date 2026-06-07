import { Link } from 'react-router-dom';
import { Clock, Globe, Tag, Ticket } from 'lucide-react';
import { movieService } from '../services/movieService';

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='420' viewBox='0 0 300 420'%3E%3Crect width='300' height='420' fill='%231c1c2e'/%3E%3Ctext x='150' y='210' text-anchor='middle' dy='.3em' fill='%2360607a' font-size='16' font-family='sans-serif'%3ENo Poster%3C/text%3E%3C/svg%3E";

const GENRE_COLORS = {
  Action: 'badge-primary',
  Drama: 'badge-info',
  Comedy: 'badge-warning',
  Horror: 'badge-purple',
  Romance: 'badge-success',
  Thriller: 'badge-primary',
  Default: 'badge-info',
};

const MovieCard = ({ movie, onBook }) => {
  const posterUrl = movie.imageData
    ? movieService.getPosterUrl(movie)
    : PLACEHOLDER;

  const genreClass = GENRE_COLORS[movie.genre] || GENRE_COLORS.Default;

  return (
    <div className="movie-card group flex flex-col">
      {/* Poster */}
      <div className="relative overflow-hidden aspect-[2/3]">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = PLACEHOLDER;
          }}
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Quick book button on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link
            to={`/book-ticket?movieId=${movie.id}`}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Ticket size={14} />
            Book Now
          </Link>
        </div>
        {/* Genre badge */}
        <div className="absolute top-3 left-3">
          <span className={genreClass}>{movie.genre}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-white text-base mb-2 line-clamp-1">{movie.title}</h3>
        <div className="flex flex-wrap gap-2 mt-auto">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Globe size={12} />
            {movie.language}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            {movie.duration} min
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <Link
            to={`/movies/${movie.id}`}
            className="flex-1 text-center py-2 text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Details
          </Link>
          <Link
            to={`/book-ticket?movieId=${movie.id}`}
            className="flex-1 text-center py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Book Ticket
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
