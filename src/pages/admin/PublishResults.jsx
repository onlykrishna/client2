import { useState, useEffect } from 'react';
import { getActiveDraws, updateSettings, getSettings } from '../../firebase/db';
import { PRIZE_STRUCTURE } from '../../utils/mockData';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { generateTicketBatch } from '../../utils/ticketGenerator';
import toast from 'react-hot-toast';

export default function PublishResults() {
  const [activeDraws, setActiveDraws] = useState([]);
  const [selectedDrawId, setSelectedDrawId] = useState('');
  const [resultsData, setResultsData] = useState({});
  const [drawDetails, setDrawDetails] = useState(null);

  useEffect(() => {
     getActiveDraws().then(draws => {
        setActiveDraws(draws);
        if(draws.length > 0) loadDraw(draws[0].id);
     });
  }, []);

  const loadDraw = async (id) => {
     setSelectedDrawId(id);
     const snap = await getDoc(doc(db, 'draws', id));
     const data = snap.data();
     setDrawDetails(data);
     
     if (data.results) {
        // Load existing results
        const form = {};
        for(let p of data.results) {
           form[p.tier] = p.winningNumbers.join('\n');
        }
        setResultsData(form);
     } else {
        // Initialize empty
        setResultsData(PRIZE_STRUCTURE.reduce((acc, prize) => ({...acc, [prize.tier]: ''}), {}));
     }
  };

  const handleGenerateRandom = (tier, count) => {
    // Generate tickets that are NOT in the active 200 tickets
    const activeNumbers = drawDetails?.tickets?.map(t => t.number) || [];
    let batch = [];
    while(batch.length < count) {
       const newNum = generateTicketBatch(1)[0];
       if(!activeNumbers.includes(newNum)) {
          batch.push(newNum);
       }
    }
    setResultsData(prev => ({ ...prev, [tier]: batch.join('\n') }));
    toast.success(`Generated ${count} numbers for ${tier} prize`);
  };

  const publishResults = async () => {
    // Validate
    const results = [];
    for(let prize of PRIZE_STRUCTURE) {
       const numArr = (resultsData[prize.tier] || '').split('\n').map(x=>x.trim()).filter(x=>x!=='');
       /*
       if(numArr.length === 0) {
          toast.error(`Please provide winning tickets for ${prize.tier} Prize`);
          return;
       }
       */
       results.push({ ...prize, winningNumbers: numArr });
    }

    try {
      await updateDoc(doc(db, 'draws', selectedDrawId), { 
         results,
         status: 'completed'
      });
      toast.success('Results published successfully!');
    } catch(e) {
      toast.error(e.message);
    }
  };

  const notifyWinner = (number, tier, amount) => {
     // Admin wants to notify
     const msg = `Congratulations!\nYour Ticket Number ${number} has won the ${tier} Prize of ${amount}.\nPlease reply with your details to claim the prize.`;
     const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
     window.open(url, '_blank');
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
         <div className="flex-1 w-full">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Draw</label>
            <select 
              value={selectedDrawId}
              onChange={(e) => loadDraw(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 px-4 font-bold focus:ring-kerala-green focus:border-kerala-green"
            >
               {activeDraws.map(d => <option key={d.id} value={d.id}>{d.date} - {d.timeStr} ({d.status.toUpperCase()})</option>)}
            </select>
         </div>
         <button 
           onClick={() => {
             PRIZE_STRUCTURE.forEach(p => handleGenerateRandom(p.tier, p.winners > 5 ? 5 : p.winners));
           }}
           className="bg-kerala-gold text-kerala-dark px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 shadow-lg"
         >
           Auto-Fill Unsold Random
         </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         {PRIZE_STRUCTURE.map((prize) => {
           const nums = (resultsData[prize.tier] || '').split('\n').map(x=>x.trim()).filter(x=>x);
           return (
             <div key={prize.tier} className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-50 flex flex-col group">
                <div className="flex items-start justify-between mb-6">
                   <div>
                      <h4 className="font-display font-black text-lg text-kerala-dark italic uppercase">{prize.tier} Prize</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{prize.amount} • Required: {prize.winners}</p>
                   </div>
                   <div className="flex gap-2">
                      <button 
                         onClick={() => handleGenerateRandom(prize.tier, prize.winners > 5 ? 5 : prize.winners)}
                         className="bg-gray-100 text-gray-500 hover:bg-gray-200 px-3 py-1 rounded-[4px] text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                         Randomize
                      </button>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                  <textarea
                    value={resultsData[prize.tier]}
                    onChange={(e) => setResultsData(prev => ({ ...prev, [prize.tier]: e.target.value }))}
                    placeholder="Enter KLXXXXXX (one per line)"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-xs font-bold focus:ring-kerala-green focus:border-kerala-green min-h-[100px]"
                  />
                  
                  {drawDetails?.status === 'completed' && nums.length > 0 && (
                     <div className="bg-green-50 p-4 border border-green-100 rounded-xl max-h-[150px] overflow-y-auto">
                        <p className="text-[10px] font-black text-green-600 uppercase mb-2">Winners to notify</p>
                        <ul className="space-y-2">
                           {nums.map((n, i) => (
                              <li key={i} className="flex justify-between items-center bg-white px-3 py-2 rounded shadow-sm">
                                 <span className="font-mono text-xs font-bold">{n}</span>
                                 <button onClick={()=>notifyWinner(n, prize.tier, prize.amount)} className="text-[10px] bg-[#25D366] text-white px-2 py-1 rounded font-bold uppercase tracking-widest">Notify</button>
                              </li>
                           ))}
                        </ul>
                     </div>
                  )}
                </div>
             </div>
           );
         })}
      </div>

      <div className="sticky bottom-8 left-0 right-0 max-w-xl mx-auto z-50">
         <button
            onClick={publishResults}
            className="w-full bg-kerala-green text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transform transition-all border-4 border-white/20"
         >
           Publish Results to App
         </button>
      </div>
    </div>
  );
}
