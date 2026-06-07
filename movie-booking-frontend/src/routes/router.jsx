import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public pages
import HomePage from '../pages/HomePage';
import MoviesPage from '../pages/MoviesPage';
import MovieDetailsPage from '../pages/MovieDetailsPage';
import ShowsPage from '../pages/ShowsPage';
import BookTicketPage from '../pages/BookTicketPage';
import BookingsPage from '../pages/BookingsPage';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminMovies from '../pages/admin/AdminMovies';
import AdminTheaters from '../pages/admin/AdminTheaters';
import AdminShows from '../pages/admin/AdminShows';
import AdminBookings from '../pages/admin/AdminBookings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movies', element: <MoviesPage /> },
      { path: 'movies/:id', element: <MovieDetailsPage /> },
      { path: 'shows', element: <ShowsPage /> },
      { path: 'book-ticket', element: <BookTicketPage /> },
      { path: 'bookings', element: <BookingsPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'movies', element: <AdminMovies /> },
      { path: 'theaters', element: <AdminTheaters /> },
      { path: 'shows', element: <AdminShows /> },
      { path: 'bookings', element: <AdminBookings /> },
    ],
  },
]);

export default router;
