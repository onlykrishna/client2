import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TicketCard from './TicketCard';
import toast from 'react-hot-toast';

export default function TicketSuccessModal({ isOpen, onClose, tickets }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-kerala-dark/95 backdrop-blur-md"
      ></motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl relative z-[201] text-center"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
           <div className="w-24 h-24 bg-kerala-gold rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-[0_0_50px_rgba(212,160,23,0.5)]">🎉</div>
           <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-2">Payment Successful!</h2>
           <p className="text-kerala-gold font-bold uppercase tracking-widest text-sm">Your {tickets.length} Tickets have been generated</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[50vh] overflow-y-auto px-4 py-8 mb-12 scrolling-touch scrollbar-hide">
           {tickets.map((t, idx) => (
             <motion.div
               key={t.id}
               initial={{ opacity: 0, scale: 0.5, y: 50 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ delay: 0.4 + idx * 0.1, type: 'spring' }}
             >
               <TicketCard 
                 ticketNumber={t.ticketNumber} 
                 drawDate={t.drawDate} 
                 status={t.status}
               />
             </motion.div>
           ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <button
              onClick={() => {
                onClose();
                navigate('/my-tickets');
              }}
              className="bg-kerala-gold text-kerala-dark px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-yellow-400 transition-all uppercase tracking-widest"
           >
             View My Tickets
           </button>
           <button
              onClick={() => {
                onClose();
              }}
              className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all uppercase tracking-widest"
           >
             Buy More
           </button>
        </div>
        
        <button 
          className="mt-8 text-white/40 hover:text-white flex items-center gap-2 mx-auto font-bold uppercase text-[10px] tracking-widest"
          onClick={() => {
             toast.success('📋 Ticket list copied to clipboard!');
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          Share Tickets
        </button>
      </motion.div>
    </div>
  );
}
