import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ToastContainer from '../components/ToastContainer';
import { Film } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="border-t border-white/8 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                <Film size={14} className="text-white" />
              </div>
              <span className="text-gray-400 text-sm font-medium">CineBook</span>
            </div>
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} CineBook. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-gray-600">
              <span>Movie Ticket Booking System</span>
            </div>
          </div>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
