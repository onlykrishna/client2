import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function CheckWinner() {
  const [ticketInput, setTicketInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [recentChecks, setRecentChecks] = useState([]);
  const [recentDraws, setRecentDraws] = useState([]);

  useEffect(() => {
    const fetchLatestDraws = async () => {
      const q = query(collection(db, 'draws'), orderBy('date', 'desc'), limit(10));
      const snap = await getDocs(q);
      const draws = [];
      snap.forEach(d => draws.push({ id: d.id, ...d.data() }));
      setRecentDraws(draws);
    };
    fetchLatestDraws();
  }, []);

  const handleTextChange = (e) => {
    let val = e.target.value.toUpperCase();
    if (val && !val.startsWith('KL')) {
      if (val.length <= 6 && !isNaN(val)) val = 'KL' + val;
      else if (val.startsWith('K')) val = 'KL' + val.substring(1);
      else val = 'KL' + val;
    }
    setTicketInput(val.substring(0, 8));
  };

  const handleCheck = async () => {
    const num = ticketInput.toUpperCase();
    if (num.length < 8) {
      toast.error('Please enter a valid ticket number (e.g., KL123456)');
      return;
    }

    setChecking(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 800));

    let foundPrize = null;
    let foundDraw = null;
    
    // Check across latest 10 draws
    for (const draw of recentDraws) {
      if (!draw.results) continue;
      
      // If we haven't found a draw yet, we'll use the latest draw with results as fallback
      if (!foundDraw) foundDraw = draw;

      for (const prize of draw.results) {
        if (prize.winningNumbers && prize.winningNumbers.includes(num)) {
          foundPrize = prize;
          foundDraw = draw;
          break;
        }
      }
      if (foundPrize) break;
    }

    // If still no draw with results found, we can't show anything
    if (!foundDraw) {
      setResult({ won: false, noDraws: true });
      setChecking(false);
      return;
    }

    const checkResult = {
      won: foundPrize ? true : false,
      prizeTier: foundPrize ? foundPrize.tier : null,
      amount: foundPrize ? foundPrize.amount : null,
      date: foundDraw.date,
      allWinners: foundDraw.results,
      searchedTicket: num
    };

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
        <p className="text-[10px] mt-2 font-black text-white/40 uppercase tracking-tighter">Results available for check until 12:00 PM next day</p>
      </section>

      <div className="container mx-auto max-w-4xl px-4 -mt-10">
         <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 mb-12 border border-gray-100">
            <div className="max-w-md mx-auto relative">
               
               <input
                 type="text"
                 value={ticketInput}
                 onChange={handleTextChange}
                 placeholder="Enter Ticket No."
                 className="w-full px-6 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl text-3xl font-mono font-black text-kerala-dark focus:ring-kerala-green focus:border-kerala-green transition-all tracking-widest placeholder:opacity-20 uppercase"
               />
               <button
                 onClick={handleCheck}
                 disabled={checking || ticketInput.length < 8}
                 className="w-full mt-6 bg-kerala-red text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-red-800 transition-all disabled:opacity-50"
               >
                 {checking ? 'Checking...' : 'Check Winning'}
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
                  {result.noDraws ? (
                    <div className="bg-gray-50 border-2 border-gray-100 rounded-[3rem] p-12 text-center">
                       <h2 className="text-xl font-bold text-gray-400">No Results Found</h2>
                       <p className="text-gray-400 mt-2">Check back later for updated results.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                       {/* Main Result Card */}
                       {result.won ? (
                        <div className="bg-gradient-to-br from-kerala-gold/20 to-kerala-green/5 border-2 border-kerala-gold rounded-[3rem] p-12 relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                              <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-kerala-gold rounded-full blur-3xl"></div>
                           </div>
                           <div className="text-6xl mb-4">🎊</div>
                           <h2 className="text-4xl font-display font-black text-kerala-green mb-2">WINNER!</h2>
                           <p className="text-kerala-dark font-black uppercase tracking-[0.3em] mb-6">Draw Date: {result.date}</p>
                           <div className="bg-white shadow-xl rounded-2xl py-6 border border-kerala-gold/20 max-w-xs mx-auto mb-8">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{result.prizeTier} Prize</p>
                              <p className="text-5xl font-display font-black text-kerala-gold italic">{result.amount}</p>
                           </div>
                           <button className="bg-[#25D366] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#128C7E] transition-all shadow-[0_5px_15px_rgba(37,211,102,0.3)] text-sm flex items-center gap-2 mx-auto">
                             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                             Claim via WhatsApp
                           </button>
                        </div>
                       ) : (
                        <div className="bg-gray-50 border-2 border-gray-100 rounded-[3rem] p-12 text-center">
                           <div className="text-6xl mb-4">🍀</div>
                           <h2 className="text-3xl font-display font-bold text-gray-400 mb-2">Not a Winner</h2>
                           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Ticket {result.searchedTicket} did not win in this draw</p>
                           <p className="text-gray-400 font-black uppercase tracking-[0.3em] mb-2 text-[10px]">Draw Date: {result.date}</p>
                        </div>
                       )}

                       {/* All Winners List */}
                       <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                          <h3 className="font-display font-black text-xl text-kerala-dark mb-6 text-center uppercase tracking-widest">Draw Winners List</h3>
                          <div className="space-y-6">
                             {result.allWinners.map((prize, idx) => (
                               <div key={idx} className="border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                                  <div className="flex justify-between items-end mb-4">
                                     <div>
                                        <p className="text-[10px] font-black text-kerala-gold uppercase tracking-widest">{prize.tier} Prize</p>
                                        <p className="text-2xl font-display font-black text-kerala-green italic">{prize.amount}</p>
                                     </div>
                                  </div>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                     {prize.winningNumbers && prize.winningNumbers.length > 0 ? (
                                       prize.winningNumbers.map(num => (
                                         <div 
                                           key={num} 
                                           className={`px-3 py-2 rounded-lg font-mono font-black text-center text-sm tracking-widest border transition-all ${num.trim() === result.searchedTicket.trim() ? 'bg-kerala-gold text-kerala-dark border-kerala-gold shadow-lg scale-105 ring-2 ring-kerala-gold ring-offset-2' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                                         >
                                            {num}
                                         </div>
                                       ))
                                     ) : (
                                       <div className="col-span-full py-2 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                          Waiting for Result...
                                       </div>
                                     )}
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         {/* Recently Checked */}
         <div className="max-w-xl mx-auto">
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
