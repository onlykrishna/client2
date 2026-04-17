import { motion } from 'framer-motion';

export default function TicketCard({ ticketNumber, drawDate, status, prize }) {
  const isWinner = status === 'winner';
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-2xl overflow-hidden shadow-xl border ${isWinner ? 'border-kerala-gold ring-2 ring-kerala-gold/20' : 'border-kerala-green/10'}`}
    >
      <div className={`p-6 ${isWinner ? 'bg-gradient-to-br from-kerala-dark to-kerala-green' : 'bg-gradient-to-br from-kerala-green to-kerala-dark'} text-white`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Official Ticket</p>
            <h4 className="font-display font-bold text-kerala-gold">Kerala Jackpots Daily</h4>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg ${status === 'active' ? 'bg-blue-500 text-white' : status === 'winner' ? 'bg-kerala-gold text-kerala-dark' : 'bg-gray-500 text-white'}`}>
            {status === 'winner' ? '🏆 Winner' : status}
          </div>
        </div>

        <div className="flex flex-col items-center py-4 bg-white/5 rounded-xl border border-white/10 mb-6 group">
          <p className="text-[10px] font-black text-white/40 uppercase mb-2 tracking-widest">Ticket Number</p>
          <p className="text-4xl font-mono font-black text-kerala-gold tracking-widest drop-shadow-lg group-hover:scale-110 transition-transform">
            {ticketNumber}
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase text-white/30">Draw Date</p>
            <p className="font-bold text-xs">{drawDate} | 3:00 PM</p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center opacity-20">
             <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="50" r="40" stroke="white" strokeWidth="5" fill="none" strokeDasharray="10 5" /></svg>
          </div>
        </div>
      </div>

      {isWinner && (
        <div className="bg-kerala-gold text-kerala-dark p-4 text-center font-black italic uppercase tracking-widest animate-pulse border-t border-kerala-gold/30">
          Won {prize?.tier} Prize: ₹{prize?.amount?.toLocaleString()}
        </div>
      )}
      
      {/* Decorative dots for perforated effect */}
      <div className="absolute top-1/2 left-0 w-4 h-4 rounded-full bg-kerala-cream -translate-x-1/2 shadow-inner"></div>
      <div className="absolute top-1/2 right-0 w-4 h-4 rounded-full bg-kerala-cream translate-x-1/2 shadow-inner"></div>
    </motion.div>
  );
}
