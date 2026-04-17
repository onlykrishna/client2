import { useState, useMemo } from 'react';
import { useTicketStore } from '../store/ticketStore';
import TicketCard from '../components/lottery/TicketCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MyTickets() {
  const { tickets } = useTicketStore();
  const [filter, setFilter] = useState('All');
  
  const stats = useMemo(() => {
    const totalSpent = tickets.length * 149; // Simplified
    const active = tickets.filter(t => t.status === 'active').length;
    const winners = tickets.filter(t => t.status === 'winner');
    const totalWon = winners.reduce((sum, t) => sum + (t.prize?.amount || 0), 0);
    
    return {
      totalSpent,
      active,
      winners: winners.length,
      totalWon
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (filter === 'All') return tickets;
    return tickets.filter(t => t.status.toLowerCase() === filter.toLowerCase());
  }, [tickets, filter]);

  return (
    <div className="pb-20 bg-kerala-cream min-h-screen">
      <section className="bg-kerala-green pt-12 pb-24 px-4 text-white">
        <div className="container mx-auto max-w-6xl">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-display font-bold">My Tickets</h1>
                <p className="opacity-60 font-bold uppercase tracking-widest text-[10px] mt-1">You have {tickets.length} tickets total</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                 <StatCard label="Total Spent" value={`₹${stats.totalSpent}`} color="white" />
                 <StatCard label="Active" value={stats.active} color="blue-400" />
                 <StatCard label="Winners" value={stats.winners} color="kerala-gold" />
                 <StatCard label="Total Won" value={`₹${stats.totalWon}`} color="kerala-gold" />
              </div>
           </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 -mt-10">
         {/* Filters */}
         <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl shadow-xl max-w-md mx-auto md:mx-0">
            {['All', 'Active', 'Winner', 'Expired'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === f ? 'bg-kerala-green text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                {f === 'Winner' ? 'Winners' : f}
              </button>
            ))}
         </div>

         <AnimatePresence mode="popLayout">
            {filteredTickets.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredTickets.map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <TicketCard {...t} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[3rem] p-20 text-center shadow-xl border border-gray-100"
              >
                 <div className="text-6xl mb-6">🎫</div>
                 <h3 className="text-2xl font-display font-bold mb-2">No {filter !== 'All' ? filter : ''} Tickets Found</h3>
                 <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm">You don't have any {filter.toLowerCase()} tickets at the moment. Book your first one to win big!</p>
                 <Link to="/buy-tickets" className="bg-kerala-green text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg inline-block">Book Tickets Now</Link>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorClass = color === 'kerala-gold' ? 'text-kerala-gold' : color === 'blue-400' ? 'text-blue-400' : 'text-white';
  
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[120px]">
       <p className="text-[8px] font-black uppercase opacity-40 tracking-widest mb-1">{label}</p>
       <p className={`text-xl font-black ${colorClass}`}>{value}</p>
    </div>
  );
}
