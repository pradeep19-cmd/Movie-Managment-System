import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import ToastContainer from '../components/ToastContainer';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
