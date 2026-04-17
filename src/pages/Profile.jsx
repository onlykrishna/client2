import { useAuth } from '../hooks/useAuth';
import { useTicketStore } from '../store/ticketStore';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, logout } = useAuth();
  const { tickets } = useTicketStore();
  const [showAddMoney, setShowAddMoney] = useState(false);

  const stats = useMemo(() => {
    const totalSpent = tickets.length * 149;
    const winners = tickets.filter(t => t.status === 'winner');
    const totalWon = winners.reduce((sum, t) => sum + (t.prize?.amount || 0), 0);
    return { totalSpent, prizesWon: winners.length, totalWon };
  }, [tickets]);

  if (!user) return null;

  return (
    <div className="pb-20 bg-kerala-cream min-h-screen">
      <section className="bg-kerala-green pt-12 pb-24 px-4 text-white">
        <div className="container mx-auto max-w-4xl text-center">
            <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-[2rem] border border-white/20 flex items-center justify-center text-4xl shadow-xl mx-auto mb-6">
               {user.name.charAt(0)}
            </div>
            <h1 className="text-3xl font-display font-bold">{user.name}</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
               <span className="text-sm opacity-60 font-mono tracking-widest">+91 {user.phone}</span>
               <span className="bg-kerala-gold/20 text-kerala-gold px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border border-kerala-gold/20">
                 {user.kycStatus}
               </span>
            </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 -mt-12 space-y-8">
         {/* Wallet Card */}
         <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-gray-100">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="text-center md:text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Available Balance</p>
                  <p className="text-6xl font-display font-black text-kerala-green italic leading-none">₹{user.walletBalance}</p>
               </div>
               <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => toast('Payment gateway simulated!', { icon: '💳' })}
                    className="flex-1 md:w-48 bg-kerala-gold text-kerala-dark py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-yellow-400 transition-all"
                  >
                    Add Money
                  </button>
                  <button className="flex-1 md:w-48 bg-gray-50 text-gray-400 border border-gray-100 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all">
                    Withdraw
                  </button>
               </div>
            </div>
            
            <div className="mt-12 p-6 bg-gray-50 rounded-3xl border border-gray-100">
               <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-400 mb-6">Recent Transactions</h4>
               <div className="space-y-4">
                  {[
                    { id: 1, type: 'Purchase', date: 'Apr 17, 09:12 AM', amount: '-₹399', status: 'Success' },
                    { id: 2, type: 'Winning Credit', date: 'Apr 16, 03:15 PM', amount: '+₹25,000', status: 'Success' },
                    { id: 3, type: 'Purchase', date: 'Apr 16, 10:45 AM', amount: '-₹149', status: 'Success' }
                  ].map(tx => (
                    <div key={tx.id} className="flex justify-between items-center">
                       <div>
                         <p className="font-black text-sm uppercase">{tx.type}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase">{tx.date}</p>
                       </div>
                       <p className={`font-black ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-kerala-red'}`}>{tx.amount}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Stats Row */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <QuickStat label="Tickets Bought" value={tickets.length} icon="🎫" />
            <QuickStat label="Total Spent" value={`₹${stats.totalSpent}`} icon="💸" />
            <QuickStat label="Prizes Won" value={stats.prizesWon} icon="🏆" />
            <QuickStat label="Total Winnings" value={`₹${stats.totalWon}`} icon="💰" />
         </div>

         {/* Account Settings */}
         <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
            <h4 className="font-display font-black text-xl mb-8">Account Settings</h4>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">📱</div>
                     <div>
                       <p className="font-black text-xs uppercase tracking-widest">Phone Number</p>
                       <p className="text-sm font-bold opacity-60">+91 {user.phone}</p>
                     </div>
                  </div>
                  <span className="text-[10px] font-black uppercase text-kerala-green underline">Verified</span>
               </div>

               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">📄</div>
                     <div>
                       <p className="font-black text-xs uppercase tracking-widest">KYC Verification</p>
                       <p className="text-sm font-bold opacity-60">Status: {user.kycStatus}</p>
                     </div>
                  </div>
                  <button className="text-[10px] font-black uppercase text-kerala-gold">Update</button>
               </div>

               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">🔔</div>
                     <div>
                       <p className="font-black text-xs uppercase tracking-widest">Notifications</p>
                       <p className="text-sm font-bold opacity-60">SMS & Email Alerts</p>
                     </div>
                  </div>
                  <div className="w-12 h-6 bg-kerala-green rounded-full relative flex items-center px-1">
                     <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                  </div>
               </div>
            </div>

            <button
               onClick={() => {
                 logout();
                 toast.success('Logged out successfully');
               }}
               className="w-full mt-12 py-5 rounded-2xl border-2 border-kerala-red text-kerala-red font-black uppercase tracking-[0.2em] hover:bg-kerala-red hover:text-white transition-all text-sm"
            >
               Logout Account
            </button>
         </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-50 text-center">
       <span className="text-2xl mb-2 inline-block">{icon}</span>
       <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">{label}</p>
       <p className="text-lg font-black text-kerala-dark truncate">{value}</p>
    </div>
  );
}
