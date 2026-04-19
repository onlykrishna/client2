import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublishResults from './PublishResults';
import AllUsers from './AllUsers';
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
    { name: 'Publish Results', icon: '🏆' },
    { name: 'Settings', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Approvals': return <AllUsers />;
      case 'Publish Results': return <PublishResults />;
      case 'Settings': return <AdminSettings />;
      default: return <AllUsers />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-kerala-dark text-white p-8 flex flex-col min-h-screen sticky top-0">
        <div className="mb-12">
            <h2 className="text-2xl font-display font-black text-kerala-gold">Admin Panel</h2>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mt-1">Kerala Jackpots Daily</p>
        </div>

        <nav className="flex-1 space-y-2">
            {menuItems.map(item => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm uppercase tracking-widest ${activeTab === item.name ? 'bg-kerala-green text-white shadow-xl' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </button>
            ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-kerala-red hover:bg-kerala-red/10 transition-all font-bold text-sm tracking-widest uppercase"
           >
             <span>🚪</span> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
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
