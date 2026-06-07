import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Menu, X, Ticket, LayoutDashboard, Search } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/shows', label: 'Shows' },
    { to: '/bookings', label: 'My Bookings' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/movies?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40 group-hover:scale-105 transition-transform">
              <Film size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">CineBook</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-red-600/20 border border-red-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/8'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Search + Actions */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:w-64 transition-all duration-300"
              />
            </form>
            <Link
              to="/book-ticket"
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 active:scale-95"
            >
              <Ticket size={15} />
              Book Now
            </Link>
            <Link
              to="/admin"
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title="Admin Dashboard"
            >
              <LayoutDashboard size={18} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            <form onSubmit={handleSearch} className="relative mb-3">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </form>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white bg-red-600/20 border border-red-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/8'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-2 flex gap-2">
              <Link
                to="/book-ticket"
                onClick={() => setMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg"
              >
                <Ticket size={15} /> Book Now
              </Link>
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 bg-white/10 text-gray-300 text-sm rounded-lg"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
