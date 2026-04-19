import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublishResults from './PublishResults';
import AllUsers from './AllUsers';
import SoldTickets from './SoldTickets';
import AdminSettings from './AdminSettings';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('Approvals');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Admin logged out');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Approvals', icon: '📝' },
    { name: 'Sold Tickets', icon: '🎫' },
    { name: 'Publish Results', icon: '🏆' },
    { name: 'Settings', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Approvals': return <AllUsers />;
      case 'Sold Tickets': return <SoldTickets />;
      case 'Publish Results': return <PublishResults />;
      case 'Settings': return <AdminSettings />;
      default: return <AllUsers />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-kerala-dark text-white p-6 lg:p-8 flex flex-col lg:min-h-screen lg:sticky lg:top-0">
        <div className="mb-8 lg:mb-12">
            <h2 className="text-xl lg:text-2xl font-display font-black text-kerala-gold">Admin Panel</h2>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mt-1">Kerala Jackpots Daily</p>
        </div>

        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-2 lg:space-y-2 no-scrollbar">
            {menuItems.map(item => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex-shrink-0 lg:w-full flex items-center gap-3 lg:gap-4 px-5 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all font-bold text-[10px] lg:text-sm uppercase tracking-widest ${activeTab === item.name ? 'bg-kerala-green text-white shadow-xl' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
              >
                <span className="text-lg lg:text-xl">{item.icon}</span>
                {item.name}
              </button>
            ))}
        </nav>

        <div className="mt-4 lg:mt-auto pt-4 lg:pt-8 border-t border-white/5">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center lg:justify-start gap-4 px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-kerala-red hover:bg-kerala-red/10 transition-all font-bold text-[10px] lg:text-sm tracking-widest uppercase"
           >
             <span>🚪</span> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-12 overflow-x-hidden">
         <div className="flex justify-between items-center mb-12">
            <div>
               <h1 className="text-3xl font-display font-black text-kerala-dark">{activeTab}</h1>
            </div>
            <div className="text-right hidden sm:block">
               <p className="text-[10px] font-black uppercase text-gray-400">Environment</p>
               <span className="bg-green-100 text-green-600 px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter border border-green-200">PRODUCTION</span>
            </div>
         </div>

         {renderContent()}
      </main>
    </div>
  );
}
