import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ManageDraws from './ManageDraws';
import PublishResults from './PublishResults';
import AllUsers from './AllUsers';
import AllTickets from './AllTickets';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Admin logged out');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Manage Draws', icon: '🎰' },
    { name: 'Publish Results', icon: '📝' },
    { name: 'All Users', icon: '👥' },
    { name: 'All Tickets', icon: '🎫' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <StatsOverview />;
      case 'Manage Draws': return <ManageDraws />;
      case 'Publish Results': return <PublishResults />;
      case 'All Users': return <AllUsers />;
      case 'All Tickets': return <AllTickets />;
      default: return <StatsOverview />;
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
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-kerala-gold flex items-center justify-center text-kerala-dark font-black">A</div>
              <div>
                 <p className="text-sm font-bold truncate max-w-[120px]">{user?.name}</p>
                 <p className="text-[10px] opacity-40 uppercase tracking-tighter">Root Administrator</p>
              </div>
           </div>
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
               <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Management Interface v1.0.4</p>
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

function StatsOverview() {
  return (
    <div className="space-y-12">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatsCard label="Revenue (Today)" value="₹47,850" change="+12%" icon="📈" />
         <StatsCard label="Tickets (Today)" value="284" change="+5.4%" icon="🎫" />
         <StatsCard label="Active Users" value="1,247" change="+0.2%" icon="👥" />
         <StatsCard label="Pending Draws" value="1" change="0" icon="🎰" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
            <h4 className="font-display font-bold text-lg mb-8 uppercase tracking-widest text-gray-400">Weekly Revenue</h4>
            <div className="h-64 flex items-end justify-between gap-4 px-4 pt-4 border-l border-b border-gray-100 pb-2">
               {[
                 { day: 'Mon', h: '40%' }, { day: 'Tue', h: '65%' }, { day: 'Wed', h: '55%' },
                 { day: 'Thu', h: '80%' }, { day: 'Fri', h: '95%' }, { day: 'Sat', h: '70%' }, { day: 'Sun', h: '85%' }
               ].map(bar => (
                 <div key={bar.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-kerala-green rounded-t-lg transition-all hover:bg-kerala-gold" style={{ height: bar.h }}></div>
                    <span className="text-[10px] font-black text-gray-300 uppercase">{bar.day}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center">
            <h4 className="font-display font-bold text-lg mb-8 uppercase tracking-widest text-gray-400 self-start">Package Popularity</h4>
            <div className="relative w-48 h-48 rounded-full border-[1.5rem] border-kerala-green flex items-center justify-center">
                <div className="absolute inset-[-1.5rem] rounded-full border-[1.5rem] border-kerala-gold" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 50%)' }}></div>
                <div>
                   <p className="text-3xl font-black">62%</p>
                   <p className="text-[10px] font-black opacity-40 uppercase">Mega Pack</p>
                </div>
            </div>
            <div className="flex gap-6 mt-12">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-kerala-green rounded-full"></div>
                  <span className="text-[10px] font-black uppercase">Mega Pack</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-kerala-gold rounded-full"></div>
                  <span className="text-[10px] font-black uppercase">Triple Pack</span>
               </div>
            </div>
         </div>
      </div>

      {/* Tables Section */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
         <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <h4 className="font-display font-bold text-lg uppercase tracking-widest text-gray-400">Recent Transactions</h4>
            <button className="text-[10px] font-black text-kerala-green uppercase hover:underline">View All</button>
         </div>
         <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
               <tr>
                  <th className="px-8 py-4">TX ID</th>
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Package</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Time</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {[...Array(5)].map((_, i) => (
                 <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 font-mono text-xs font-bold text-gray-500 uppercase">TX_{98732 - i}</td>
                    <td className="px-8 py-6">
                       <p className="font-bold text-sm">Customer {i + 1}</p>
                       <p className="text-[10px] text-gray-400">+91 98XXX XXX{i}</p>
                    </td>
                    <td className="px-8 py-6 font-black text-[10px] uppercase">Mega Pack (6)</td>
                    <td className="px-8 py-6 font-black text-kerala-green italic">₹596.00</td>
                    <td className="px-8 py-6">
                       <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-tighter">Paid</span>
                    </td>
                    <td className="px-8 py-6 text-xs text-gray-400 font-bold uppercase">10:{12+i} AM</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}

function StatsCard({ label, value, change, icon }) {
  const isUp = change.includes('+');
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 transition-transform hover:translate-y-[-5px]">
       <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shadow-inner border border-gray-100">{icon}</div>
          <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${isUp ? 'bg-green-50 text-green-500 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
            {change}
          </span>
       </div>
       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
       <p className="text-3xl font-display font-black text-kerala-dark italic">{value}</p>
    </div>
  );
}
