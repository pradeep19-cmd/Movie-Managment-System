import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Film, Building2, Calendar, Ticket,
  BookOpen, ChevronRight,
} from 'lucide-react';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/movies', label: 'Movies', icon: Film },
  { to: '/admin/theaters', label: 'Theaters', icon: Building2 },
  { to: '/admin/shows', label: 'Shows', icon: Calendar },
  { to: '/admin/bookings', label: 'Bookings', icon: BookOpen },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-[#0d0d1a] border-r border-white/8 flex flex-col py-6">
      {/* Logo */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40">
            <Ticket size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">CineBook</p>
            <p className="text-gray-500 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="px-3 mb-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Management
        </p>
        {adminLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 pt-4 border-t border-white/8">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Back to Site
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
