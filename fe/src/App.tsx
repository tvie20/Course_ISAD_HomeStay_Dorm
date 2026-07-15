import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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

// New Views (Lazy or standard imports)
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

export default function App() {
  const [appState, setAppState] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');
  const [user, setUser] = useState<{username: string, role: Role} | null>(null);
  const [activeMenu, setActiveMenu] = useState<string>('');

  const handleLogin = async (username: string, password?: string) => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        const { username: employeeId, role } = data.data;
        setUser({ username: employeeId, role });
        setAppState('dashboard');
        
        if (role === 'admin') setActiveMenu('branches');
        else if (role === 'sale') setActiveMenu('schedule');
        else if (role === 'accountant') setActiveMenu('reconciliation');
        else if (role === 'manager') setActiveMenu('room_inspection');
        else if (role === 'guest') setActiveMenu('view_contract');
      } else {
        alert("Đăng nhập thất bại: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối đến máy chủ");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveMenu('');
    setAppState('landing');
  };

  if (appState === 'landing') {
    return <LandingPage onNavigate={setAppState} />;
  }

  if (appState === 'login') {
    return (
      <div className="relative">
        <button 
          onClick={() => setAppState('landing')}
          className="absolute top-6 left-6 text-gray-500 hover:text-[#B7705F] font-medium z-10 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
        </button>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  if (appState === 'register') {
    return (
      <div className="relative min-h-screen bg-[#F9F7F6]">
         <div className="pt-6 pl-6 absolute top-0 left-0 z-10">
            <button 
              onClick={() => setAppState('landing')}
              className="text-gray-500 hover:text-[#B7705F] font-medium flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
            </button>
         </div>
         <GuestRegistration onReturn={() => setAppState('landing')} />
      </div>
    );
  }

  // Dashboard state
  // For sidebars, map the menu id to the component
  const getViewRender = () => {
    if (user?.role === 'admin') {
       switch (activeMenu) {
         case 'branches': return <BranchManagement />;
         case 'users': return <UserManagement />;
         case 'rooms': return <RoomManagement />;
         case 'assets_management': return <AdminAssetsManagement />;
         default: return <ViewPlaceholder name={activeMenu} />;
       }
    }

    if (user?.role === 'sale') {
       switch (activeMenu) {
         case 'schedule': return <ScheduleView employeeId={user.username} />;
         case 'initial_payments': return <InitialPayment />;
         case 'checkin': return <CheckIn />;
         case 'leases': return <LeaseContract />; // Mock for booking/contract
         case 'room_status': return <RoomStatus />;
         default: return <ViewPlaceholder name={activeMenu} />;
       }
    }

    if (user?.role === 'accountant') {
       switch (activeMenu) {
         case 'reconciliation': return <FinancialReconciliation />;
         case 'liquidation': return <Liquidation />;
         default: return <ViewPlaceholder name={activeMenu} />;
       }
    }

    if (user?.role === 'manager') {
       switch (activeMenu) {
         case 'room_inspection': return <RoomInspection />;
         case 'room_handover': return <Handover />;
         case 'checkout': return <CheckOut />;
         case 'assets_management': return <AssetsManagement />;
         default: return <ViewPlaceholder name={activeMenu} />;
       }
    }

    if (user?.role === 'guest') {
       // user.username serves as the customerId (e.g., "KH0001") if they log in with that.
       // Default fallback to "KH0001" if they log in with generic "GUEST001".
       let customerId = 'KH0001';
       const rawUsername = user.username.toUpperCase();
       if (rawUsername.startsWith('KH')) {
           customerId = rawUsername;
       } else if (rawUsername.startsWith('GUEST_KH')) {
           customerId = rawUsername.replace('GUEST_', '');
       }
       
       switch (activeMenu) {
         case 'view_contract': return <ViewContract customerId={customerId} />;
         case 'checkout_request': return <CheckoutRequest customerId={customerId} />;
         case 'service_payment': return <ServicePayment onNavigate={setActiveMenu} customerId={customerId} />;
         default: return <ViewPlaceholder name={activeMenu} />;
       }
    }

    return <ViewPlaceholder name={activeMenu} />;
  };

  return (
    <div className="flex min-h-screen bg-[#FAF5F3]">
      <Sidebar 
        role={user!.role} 
        username={user!.username} 
        activeMenu={activeMenu} 
        onMenuSelect={setActiveMenu} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-[300px] min-h-screen overflow-y-auto">
          {getViewRender()}
      </main>
    </div>
  );
}
