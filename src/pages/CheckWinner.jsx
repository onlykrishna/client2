import { useState, useEffect } from 'react';
import { MOCK_DRAWS } from '../utils/mockData';
import { useTicketStore } from '../store/ticketStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CheckWinner() {
  const [ticketInput, setTicketInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [recentChecks, setRecentChecks] = useState([]);
  const { tickets } = useTicketStore();

  const handleTextChange = (e) => {
    let val = e.target.value.toUpperCase();
    if (val && !val.startsWith('KL')) {
      if (val.length <= 6 && !isNaN(val)) val = 'KL' + val;
      else if (val.startsWith('K')) val = 'KL' + val.substring(1);
      else val = 'KL' + val;
    }
    setTicketInput(val.substring(0, 8));
  };

  const handleCheck = async (ticketNum) => {
    const num = (ticketNum || ticketInput).toUpperCase();
    if (num.length < 8) {
      toast.error('Please enter a valid ticket number (e.g., KL123456)');
      return;
    }

    setChecking(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1200));

    // Check today's draw
    const draw = MOCK_DRAWS[0];
    let foundPrize = null;
    
    for (const prize of draw.results) {
      if (prize.winningNumbers.includes(num)) {
        foundPrize = prize;
        break;
      }
    }

    const checkResult = foundPrize 
      ? { won: true, prizeTier: foundPrize.tier, amount: foundPrize.amount }
      : { won: false };

    setResult(checkResult);
    setChecking(false);
    
    setRecentChecks(prev => {
      const filtered = prev.filter(item => item.number !== num);
      return [{ number: num, won: foundPrize ? true : false, date: new Date().toLocaleTimeString() }, ...filtered].slice(0, 5);
    });

    if (foundPrize) {
      toast.success('🎊 CONGRATULATIONS! You are a winner!');
    } else {
      toast('Better luck next time!', { icon: '🍀' });
    }
  };

  return (
    <div className="pb-20 bg-kerala-cream min-h-screen">
       <section className="bg-kerala-green pt-16 pb-24 px-4 text-white text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Check Your Ticket</h1>
        <p className="opacity-60 font-bold uppercase tracking-widest text-xs">Instantly verify your winning status</p>
      </section>

      <div className="container mx-auto max-w-4xl px-4 -mt-10">
         <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 mb-12 border border-gray-100">
            <div className="max-w-md mx-auto relative">
               <div className="absolute left-6 top-1/2 -translate-y-1/2 text-kerala-gold text-2xl font-mono font-black pointer-events-none">#</div>
               <input
                 type="text"
                 value={ticketInput}
                 onChange={handleTextChange}
                 placeholder="KL253828"
                 className="w-full pl-12 pr-6 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl text-3xl font-mono font-black text-kerala-dark focus:ring-kerala-green focus:border-kerala-green transition-all tracking-widest placeholder:opacity-20"
               />
               <button
                 onClick={() => handleCheck()}
                 disabled={checking || ticketInput.length < 8}
                 className="w-full mt-6 bg-kerala-green text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-kerala-dark transition-all disabled:opacity-50"
               >
                 {checking ? 'Checking Numbers...' : 'Check Winner Status'}
               </button>
            </div>

            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-12 text-center"
                >
                  {result.won ? (
                    <div className="bg-gradient-to-br from-kerala-gold/20 to-kerala-green/5 border-2 border-kerala-gold rounded-[3rem] p-12 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-kerala-gold rounded-full blur-3xl"></div>
                       </div>
                       <div className="text-6xl mb-4">🎊</div>
                       <h2 className="text-4xl font-display font-black text-kerala-green mb-2">WINNER!</h2>
                       <p className="text-kerala-dark font-black uppercase tracking-[0.3em] mb-6">Congratulations</p>
                       <div className="bg-white shadow-xl rounded-2xl py-6 border border-kerala-gold/20 max-w-xs mx-auto">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{result.prizeTier} Prize</p>
                          <p className="text-5xl font-display font-black text-kerala-gold italic">{result.amount}</p>
                       </div>
                       <button className="mt-10 bg-kerala-dark text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg text-sm">
                         Claim Your Prize
                       </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-gray-100 rounded-[3rem] p-12 text-center">
                       <div className="text-6xl mb-4">🍀</div>
                       <h2 className="text-3xl font-display font-bold text-gray-400 mb-2">Better Luck Next Time</h2>
                       <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">This ticket did not win any prize in today's draw</p>
                       <button 
                         onClick={() => setTicketInput('')}
                         className="text-kerala-green font-black uppercase tracking-widest text-xs hover:underline decoration-2"
                        >
                         Check Another Number
                        </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         {/* Recently Checked/User Tickets */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
               <h4 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                 <span className="text-xl">📋</span> Your Tickets
               </h4>
               <div className="space-y-3">
                  {tickets.length > 0 ? tickets.slice(0, 5).map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTicketInput(t.ticketNumber);
                        handleCheck(t.ticketNumber);
                      }}
                      className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-kerala-green hover:text-white rounded-2xl transition-all border border-gray-100 group"
                    >
                       <span className="font-mono font-black text-lg tracking-widest">{t.ticketNumber}</span>
                       <span className="text-[10px] font-black uppercase border border-current px-2 py-0.5 rounded opacity-50 group-hover:opacity-100">Quick Check</span>
                    </button>
                  )) : (
                    <p className="text-gray-400 text-sm text-center py-8 italic uppercase font-bold tracking-widest">No tickets in your account</p>
                  )}
               </div>
            </div>

            <div className="bg-kerala-dark text-white rounded-[2.5rem] p-8 shadow-xl">
               <h4 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                 <span className="text-xl">🕰️</span> Recent Checks
               </h4>
               <div className="space-y-4">
                  {recentChecks.length > 0 ? recentChecks.map((item, i) => (
                    <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0">
                       <div>
                         <p className="font-mono font-black text-lg tracking-widest text-kerala-gold">{item.number}</p>
                         <p className="text-[8px] opacity-40 uppercase font-black">{item.date}</p>
                       </div>
                       <span className={`text-[10px] font-black uppercase rounded-full px-3 py-1 ${item.won ? 'bg-kerala-gold text-kerala-dark' : 'bg-white/10 text-white/50'}`}>
                         {item.won ? 'WINNER' : 'NOT WON'}
                       </span>
                    </div>
                  )) : (
                    <p className="text-white/20 text-sm text-center py-8 italic uppercase font-bold tracking-widest">No recently checked numbers</p>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
