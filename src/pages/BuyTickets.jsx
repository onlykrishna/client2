import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PACKAGES } from '../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/lottery/PaymentModal';
import TicketSuccessModal from '../components/lottery/TicketSuccessModal';
import PrizeTable from '../components/lottery/PrizeTable';
import toast from 'react-hot-toast';

export default function BuyTickets() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [boughtTickets, setBoughtTickets] = useState([]);
  const [isPrizesExpanded, setIsPrizesExpanded] = useState(false);

  const handleBookNow = (pkg) => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login', { state: { from: { pathname: '/buy-tickets' } } });
      return;
    }
    
    if (user.walletBalance < pkg.price) {
      toast.error('Insufficient wallet balance. Please add money.');
      navigate('/profile');
      return;
    }

    setSelectedPkg(pkg);
    setIsPaymentOpen(true);
  };

  const onPaymentSuccess = (tickets) => {
    setIsPaymentOpen(false);
    setBoughtTickets(tickets);
    setIsSuccessOpen(true);
    toast.success(`🎫 ${tickets.length} tickets booked successfully!`);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <section className="bg-kerala-green pt-16 pb-24 px-4 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Book Your Tickets</h1>
        <p className="opacity-70 text-lg">Official Daily Draw — April 17, 3:00 PM</p>
      </section>

      <div className="container mx-auto max-w-6xl px-4 -mt-12">
        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              whileHover={{ y: -10 }}
              className={`bg-white rounded-[2rem] p-8 shadow-2xl border-2 transition-all flex flex-col items-center relative overflow-hidden ${selectedPkg?.id === pkg.id ? 'border-kerala-gold ring-4 ring-kerala-gold/10' : 'border-white'}`}
            >
               {pkg.tag && (
                 <div className="absolute top-4 right-0 bg-kerala-gold text-kerala-dark text-[10px] font-black px-6 py-1 rounded-l-full uppercase tracking-widest animate-pulse">
                   {pkg.tag}
                 </div>
               )}

               <div className="w-20 h-20 bg-kerala-cream rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner">
                  {idx === 0 ? '🎫' : idx === 1 ? '🎫🎫' : '🎟️🎟️🎟️'}
               </div>

               <h3 className="font-display text-2xl font-black mb-2">{pkg.label}</h3>
               <div className="mb-2">
                 <span className="text-5xl font-black text-kerala-green italic">₹{pkg.price}</span>
               </div>
               
               <div className="flex flex-col items-center mb-8 gap-2">
                  <span className="bg-kerala-green/5 text-kerala-green px-4 py-1 rounded-full text-xs font-black uppercase">
                    {pkg.count} Tickets Included
                  </span>
                  {pkg.savings > 0 && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase animate-bounce">
                      Save ₹{pkg.savings}
                    </span>
                  )}
               </div>

               <button
                  onClick={() => handleBookNow(pkg)}
                  className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all uppercase tracking-widest ${idx === 1 ? 'bg-kerala-gold text-kerala-dark hover:bg-yellow-400' : 'bg-kerala-green text-white hover:bg-kerala-dark'}`}
               >
                 Book Now
               </button>
               
               <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-tighter">Only ₹{pkg.perTicket} per ticket</p>
            </motion.div>
          ))}
        </div>

        {/* Ticket Preview section */}
        <div className="bg-kerala-dark rounded-[3rem] p-10 md:p-16 mb-16 text-white text-center shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
           <h2 className="text-3xl font-display font-bold mb-4">What you'll get</h2>
           <p className="opacity-60 mb-12 max-w-md mx-auto">Your tickets are generated instantly with unique serial numbers registered under your profile.</p>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gradient-to-br from-white/10 to-transparent border border-white/5 p-6 rounded-2xl transform rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                   <p className="text-[10px] font-black opacity-30 tracking-[0.3em] uppercase mb-1">Preview</p>
                   <p className="text-2xl font-mono font-black text-kerala-gold">KL{Math.floor(100000 + Math.random() * 899999)}</p>
                   <p className="text-[8px] font-bold mt-2 opacity-20">SERIAL: {Math.random().toString(36).substr(2, 10).toUpperCase()}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Prize Structure Accordion */}
        <div className="max-w-4xl mx-auto mb-20 text-center">
           <button 
             onClick={() => setIsPrizesExpanded(!isPrizesExpanded)}
             className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest text-kerala-green hover:underline decoration-2"
           >
             {isPrizesExpanded ? 'Collapse' : 'View'} Prize Structure
             <svg className={`w-4 h-4 transition-transform ${isPrizesExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
           </button>
           
           <AnimatePresence>
             {isPrizesExpanded && (
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 'auto', opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden mt-8"
               >
                 <PrizeTable />
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Trust features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
           <div className="bg-white p-8 rounded-3xl group transition-all">
             <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all">🛡️</div>
             <h4 className="font-black text-xs uppercase tracking-widest mb-2 font-display">Govt Authorized</h4>
             <p className="text-xs text-gray-500 leading-relaxed">Kerala State Authorized Daily Lottery Tickets</p>
           </div>
           <div className="bg-white p-8 rounded-3xl group transition-all">
             <div className="w-16 h-16 bg-kerala-gold/10 text-kerala-gold rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 group-hover:bg-kerala-gold group-hover:text-kerala-dark transition-all">⭐</div>
             <h4 className="font-black text-xs uppercase tracking-widest mb-2 font-display">Fast Winning</h4>
             <p className="text-xs text-gray-500 leading-relaxed">Daily draws at 3:00 PM with instant results</p>
           </div>
           <div className="bg-white p-8 rounded-3xl group transition-all">
             <div className="w-16 h-16 bg-kerala-green/10 text-kerala-green rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 group-hover:bg-kerala-green group-hover:text-white transition-all">✅</div>
             <h4 className="font-black text-xs uppercase tracking-widest mb-2 font-display">Secure Payment</h4>
             <p className="text-xs text-gray-500 leading-relaxed">Encrypted payments and verified wallet transactions</p>
           </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        pkg={selectedPkg}
        onSuccess={onPaymentSuccess}
      />

      <TicketSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        tickets={boughtTickets}
      />
    </div>
  );
}
