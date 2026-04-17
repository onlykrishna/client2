import { useState } from 'react';
import { MOCK_DRAWS, PRIZE_STRUCTURE } from '../../utils/mockData';
import { generateTicketBatch } from '../../utils/ticketGenerator';
import toast from 'react-hot-toast';

export default function PublishResults() {
  const [selectedDraw, setSelectedDraw] = useState(MOCK_DRAWS[0].id);
  const [resultsData, setResultsData] = useState(() => {
    return PRIZE_STRUCTURE.reduce((acc, prize) => {
      acc[prize.tier] = '';
      return acc;
    }, {});
  });

  const handleGenerateRandom = (tier, count) => {
    const batch = generateTicketBatch(count).join('\n');
    setResultsData(prev => ({ ...prev, [tier]: batch }));
    toast.success(`Generated ${count} numbers for ${tier} prize`);
  };

  const publishResults = () => {
    // Check if any empty
    const isAnyEmpty = Object.values(resultsData).some(val => val === '');
    if (isAnyEmpty) {
      toast.error('Please fill in or generate numbers for all prize tiers');
      return;
    }

    toast.success('Results published successfully! Notifying winners...', {
      duration: 4000,
      icon: '🚀'
    });
    
    // Simulate finding a specific winner for demo
    setTimeout(() => {
      toast('Alert: User KL788291 won 1st Prize!', { icon: '🏆', duration: 5000 });
    }, 2000);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
         <div className="flex-1 w-full">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Draw Date</label>
            <select 
              value={selectedDraw}
              onChange={(e) => setSelectedDraw(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 px-4 font-bold"
            >
               {MOCK_DRAWS.map(d => <option key={d.id} value={d.id}>{d.id} ({d.status.toUpperCase()})</option>)}
            </select>
         </div>
         <button 
           onClick={() => {
             PRIZE_STRUCTURE.forEach(p => handleGenerateRandom(p.tier, p.winners > 5 ? 5 : p.winners));
           }}
           className="bg-kerala-gold text-kerala-dark px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 shadow-lg"
         >
           Auto-Fill All (Random)
         </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         {PRIZE_STRUCTURE.map((prize) => (
           <div key={prize.tier} className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-50 flex flex-col group">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h4 className="font-display font-black text-lg text-kerala-dark italic uppercase">{prize.tier} Prize</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{prize.amount} • {prize.winners} Winners</p>
                 </div>
                 <button 
                   onClick={() => handleGenerateRandom(prize.tier, prize.winners > 5 ? 5 : prize.winners)}
                   className="text-[10px] font-black text-kerala-green uppercase hover:underline"
                 >
                   Randomize
                 </button>
              </div>

              <textarea
                value={resultsData[prize.tier]}
                onChange={(e) => setResultsData(prev => ({ ...prev, [prize.tier]: e.target.value }))}
                placeholder="Enter KLXXXXXX (one per line)"
                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-4 font-mono text-xs font-bold focus:ring-kerala-green focus:ring-opacity-20 transition-all min-h-[120px]"
              />
           </div>
         ))}
      </div>

      <div className="sticky bottom-8 left-0 right-0 max-w-xl mx-auto z-50">
         <button
            onClick={publishResults}
            className="w-full bg-kerala-green text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transform transition-all border-4 border-white/20"
         >
           Publish Results & Notify Winners
         </button>
      </div>
    </div>
  );
}
