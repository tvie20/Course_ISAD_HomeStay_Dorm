import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import API_URL from './api';
import Login from './components/Login';
import Sidebar, { Role, MENUS } from './components/Sidebar';
import LandingPage from './views/Home/LandingPage';

// Views
import GuestRegistration from './views/Guest/GuestRegistration';
import AdminRegistration from './views/Admin/AdminRegistration';
import SaleContract from './views/Sale/SaleContract';
import CheckIn from './views/Sale/CheckIn';
import Handover from './views/Manager/Handover';
import CheckOut from './views/Manager/CheckOut';
import Liquidation from './views/Accountant/Liquidation';

// New Views
import BranchManagement from './views/Admin/BranchManagement';
import UserManagement from './views/Admin/UserManagement';
import RoomManagement from './views/Admin/RoomManagement';
import InitialPayment from './views/Sale/InitialPayment';
import FinancialReconciliation from './views/Accountant/FinancialReconciliation';
import LeaseContract from './views/Sale/LeaseContract';
import RoomStatus from './views/Sale/RoomStatus';
import ScheduleView from './views/Sale/ScheduleView';
import RoomInspection from './views/Manager/RoomInspection';
import AssetsManagement from './views/Manager/AssetsManagement';
import AdminAssetsManagement from './views/Admin/AdminAssetsManagement';

// Guest Views
import ServicePayment from './views/Guest/ServicePayment';
import CheckoutRequest from './views/Guest/CheckoutRequest';
import ViewContract from './views/Guest/ViewContract';

const ViewPlaceholder = ({ name }: { name: string }) => (
  <div className="p-8 flex items-center justify-center min-h-[50vh] text-gray-400">
    Đang chọn: {name} (Vui lòng chọn các menu trong mockup để xem UI)
  </div>
);

type UserData = { username: string, name: string, role: Role, branch?: string };

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Khôi phục user từ localStorage khi tải lại trang
    const storedUser = localStorage.getItem('user_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = async (username: string, password?: string, userType?: string) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, userType })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        const { username: employeeId, name: fullName, role, branch } = data.data;
        const userData = { username: employeeId, name: fullName || employeeId, role, branch };
        setUser(userData);
        localStorage.setItem('user_session', JSON.stringify(userData));
        
        // Điều hướng tới trang đầu tiên tương ứng role
        if (role === 'admin') navigate('/branches');
        else if (role === 'sale') navigate('/schedule');
        else if (role === 'accountant') navigate('/reconciliation');
        else if (role === 'manager') navigate('/room_inspection');
        else if (role === 'guest') navigate('/view_contract');
      } else {
        alert("Đăng nhập thất bại: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối đến máy chủ ");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
    navigate('/');
  };

  if (isInitializing) return null;

  // Lấy customerId cho guest
  let customerId = 'KH0001';
  if (user?.role === 'guest') {
     const rawUsername = user.username.toUpperCase();
     if (rawUsername.startsWith('KH')) {
         customerId = rawUsername;
     } else if (rawUsername.startsWith('GUEST_KH')) {
         customerId = rawUsername.replace('GUEST_', '');
     }
  }

  // Dashboard Layout
  const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    if (!user) return <Navigate to="/login" replace />;

    const currentMenuId = location.pathname.substring(1) || '';

    return (
      <div className="flex min-h-screen bg-[#FAF5F3]">
        <Sidebar 
          role={user.role} 
          username={user.name || user.username} 
          activeMenu={currentMenuId} 
          onMenuSelect={(id) => navigate(`/${id}`)} 
          onLogout={handleLogout}
        />
        
        <main className="flex-1 ml-[300px] min-h-screen overflow-y-auto">
            {children}
        </main>
      </div>
    );
  };

  return (
    <Routes>
      <Route path="/" element={
        user ? <Navigate to={`/${MENUS[user.role][0].id}`} replace /> : <LandingPage onNavigate={(path) => navigate(`/${path}`)} />
      } />
      
      <Route path="/login" element={
        <div className="relative">
          <button 
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 text-gray-500 hover:text-[#B7705F] font-medium z-10 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
          </button>
          <Login onLogin={handleLogin} />
        </div>
      } />

      <Route path="/register" element={
        <div className="relative min-h-screen bg-[#F9F7F6]">
           <div className="pt-6 pl-6 absolute top-0 left-0 z-10">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-[#B7705F] font-medium flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
              </button>
           </div>
           <GuestRegistration onReturn={() => navigate('/')} />
        </div>
      } />

      {/* Admin Routes */}
      <Route path="/branches" element={<DashboardLayout><BranchManagement /></DashboardLayout>} />
      <Route path="/users" element={<DashboardLayout><UserManagement /></DashboardLayout>} />
      <Route path="/rooms" element={<DashboardLayout><RoomManagement /></DashboardLayout>} />
      <Route path="/assets_management" element={<DashboardLayout>{user?.role === 'admin' ? <AdminAssetsManagement /> : <AssetsManagement />}</DashboardLayout>} />

      {/* Sale Routes */}
      <Route path="/schedule" element={<DashboardLayout><ScheduleView employeeId={user?.username || ''} branchId={user?.branch} onNavigate={(menu) => navigate(`/${menu}`)} /></DashboardLayout>} />
      <Route path="/initial_payments" element={<DashboardLayout><InitialPayment employeeId={user?.username || ''} branchId={user?.branch} /></DashboardLayout>} />
      <Route path="/checkin" element={<DashboardLayout><CheckIn employeeId={user?.username || ''} branchId={user?.branch} /></DashboardLayout>} />
      <Route path="/leases" element={<DashboardLayout><LeaseContract employeeId={user?.username || ''} branchId={user?.branch} /></DashboardLayout>} />
      <Route path="/room_status" element={<DashboardLayout><RoomStatus branchId={user?.branch} /></DashboardLayout>} />

      {/* Accountant Routes */}
      <Route path="/reconciliation" element={<DashboardLayout><FinancialReconciliation /></DashboardLayout>} />
      <Route path="/liquidation" element={<DashboardLayout><Liquidation /></DashboardLayout>} />

      {/* Manager Routes */}
      <Route path="/room_inspection" element={<DashboardLayout><RoomInspection /></DashboardLayout>} />
      <Route path="/room_handover" element={<DashboardLayout><Handover /></DashboardLayout>} />
      <Route path="/checkout" element={<DashboardLayout><CheckOut /></DashboardLayout>} />

      {/* Guest Routes */}
      <Route path="/view_contract" element={<DashboardLayout><ViewContract customerId={customerId} /></DashboardLayout>} />
      <Route path="/checkout_request" element={<DashboardLayout><CheckoutRequest customerId={customerId} /></DashboardLayout>} />
      <Route path="/service_payment" element={<DashboardLayout><ServicePayment onNavigate={(menu) => navigate(`/${menu}`)} customerId={customerId} /></DashboardLayout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
