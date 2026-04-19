import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Results() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [days, setDays] = useState([]);
  const [resultsCache, setResultsCache] = useState({});

  useEffect(() => {
     const fetchDraws = async () => {
        const q = query(collection(db, 'draws'), orderBy('date', 'desc'), limit(10));
        const snap = await getDocs(q);
        const fetchedDays = [];
        const cache = {};
        snap.forEach(doc => {
           const d = { id: doc.id, ...doc.data() };
           fetchedDays.push({ id: d.id, label: d.timeStr, date: d.date });
           cache[d.id] = d;
        });
        setDays(fetchedDays);
        setResultsCache(cache);
        if(fetchedDays.length > 0) setSelectedDay(fetchedDays[0].id);
     };
     fetchDraws();
  }, []);

  const draw = resultsCache[selectedDay];

  if (days.length === 0) return <div className="text-center py-20 bg-kerala-cream min-h-screen">Loading Results...</div>;

  return (
    <div className="pb-20 bg-kerala-cream min-h-screen">
      <section className="bg-kerala-green pt-16 pb-32 px-4 text-white text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Lottery Results</h1>
        <p className="opacity-60 font-bold uppercase tracking-widest text-xs">Verified results released at 11 AM & 3 PM Daily</p>
      </section>

      <div className="container mx-auto max-w-4xl px-4 -mt-16">
        {/* Draw Selector */}
        <div className="flex overflow-x-auto bg-white p-2 rounded-3xl shadow-2xl mb-12 gap-2 hide-scrollbar">
           {days.map(day => (
             <button
               key={day.id}
               onClick={() => setSelectedDay(day.id)}
               className={`min-w-[120px] flex-1 py-4 px-2 rounded-2xl flex flex-col items-center gap-1 transition-all flex-shrink-0 ${selectedDay === day.id ? 'bg-kerala-green text-white shadow-lg' : 'text-gray-400 font-bold hover:bg-gray-50'}`}
             >
                <span className="text-[10px] uppercase font-black tracking-widest opacity-60">{day.label}</span>
                <span className="text-sm font-black">{day.date}</span>
                {day.id === days[0].id && selectedDay !== day.id && <span className="absolute top-2 right-2 bg-red-500 w-2 h-2 rounded-full animate-ping"></span>}
             </button>
           ))}
        </div>

        <AnimatePresence mode="wait">
          {draw && (
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {!draw.results || draw.status === 'upcoming' ? (
              <div className="bg-white rounded-[3rem] p-16 text-center shadow-xl border border-gray-100">
                 <div className="text-6xl mb-6">🕒</div>
                 <h2 className="text-3xl font-display font-bold mb-4">Results Coming Soon</h2>
                 <p className="text-gray-400 mb-8 max-w-md mx-auto">Winning numbers will be announced live. Stay tuned and best of luck!</p>
              </div>
            ) : (
              <div className="space-y-8">
                 {/* Top 3 Hero Cards */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {draw.results.slice(0, 3).map((res, idx) => {
                      if (!res.winningNumbers || res.winningNumbers.length === 0) return null;
                      return (
                      <div key={res.tier} className={`rounded-[2.5rem] p-8 text-center shadow-xl relative overflow-hidden ${idx === 0 ? 'bg-kerala-gold text-kerala-dark md:scale-110 md:z-10' : 'bg-kerala-dark text-white'}`}>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">{res.tier} Prize Winner</p>
                        <p className="text-3xl font-display font-black italic mb-4">{res.amount}</p>
                        <div className="bg-white/10 rounded-2xl py-4 border border-white/10">
                           <p className="text-2xl font-mono font-black tracking-widest">{res.winningNumbers[0]}</p>
                        </div>
                        {idx === 0 && <div className="absolute top-4 right-4 text-3xl opacity-20">👑</div>}
                      </div>
                    )})}
                 </div>

                 {/* Results List */}
                 <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">
                   <h3 className="text-2xl font-display font-bold mb-8 text-center pb-8 border-b border-gray-100">Full Winning List</h3>
                   <div className="divide-y divide-gray-50">
                      {draw.results.map((prize) => {
                        if(!prize.winningNumbers || prize.winningNumbers.length === 0) return null;
                        return (
                        <div key={prize.tier} className="py-8 flex flex-col md:flex-row md:items-center gap-6 group">
                           <div className="min-w-[150px]">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{prize.tier} Prize</p>
                              <p className="text-xl font-display font-black text-kerala-green italic">{prize.amount}</p>
                           </div>
                           <div className="flex-1 flex flex-wrap gap-2">
                              {prize.winningNumbers.slice(0, 20).map(num => (
                                <span key={num} className="font-mono bg-kerala-cream text-kerala-dark px-3 py-1 rounded-lg text-xs font-black border border-kerala-green/5 group-hover:bg-kerala-gold/10 group-hover:border-kerala-gold/20 transition-colors">
                                   {num}
                                </span>
                              ))}
                              {prize.winningNumbers.length > 20 && (
                                <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-lg text-[10px] font-black flex items-center">
                                  + {prize.winningNumbers.length - 20} More
                                </span>
                              )}
                           </div>
                        </div>
                      )})}
                   </div>
                   
                   <div className="mt-12 text-center p-8 bg-kerala-green/5 rounded-3xl border border-kerala-green/10">
                      <h4 className="text-xl font-display font-bold mb-2">Check If You Won!</h4>
                      <p className="text-gray-500 text-sm mb-6 uppercase font-bold tracking-widest">Compare your ticket numbers instantly</p>
                      <Link to="/check-winner" className="bg-kerala-green text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest shadow-lg inline-block">Check Now</Link>
                   </div>
                 </div>
              </div>
            )}
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
