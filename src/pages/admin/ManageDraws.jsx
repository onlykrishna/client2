import { useState } from 'react';
import { MOCK_DRAWS } from '../../utils/mockData';
import toast from 'react-hot-toast';

export default function ManageDraws() {
  const [draws, setDraws] = useState(MOCK_DRAWS);

  const toggleStatus = (id) => {
    setDraws(prev => prev.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === 'upcoming' ? 'live' : d.status === 'live' ? 'completed' : 'upcoming';
        toast.success(`Draw ${id} moved to ${nextStatus.toUpperCase()}`);
        return { ...d, status: nextStatus };
      }
      return d;
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <h3 className="font-display font-black text-xl text-gray-400 uppercase tracking-widest">Draw Schedule</h3>
         <button className="bg-kerala-green text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Create New Draw</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {draws.map(draw => (
           <div key={draw.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col justify-between group">
              <div>
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Draw ID</p>
                       <p className="font-mono font-black text-lg text-kerala-dark">{draw.id}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${draw.status === 'completed' ? 'bg-gray-100 text-gray-500 border-gray-200' : draw.status === 'live' ? 'bg-red-100 text-red-600 border-red-200 animate-pulse' : 'bg-blue-100 text-blue-600 border-blue-200'}`}>
                      {draw.status}
                    </span>
                 </div>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-xs font-bold font-mono">
                       <span className="text-gray-400 uppercase tracking-tighter">Tickets Sold</span>
                       <span>2,842</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold font-mono">
                       <span className="text-gray-400 uppercase tracking-tighter">Pool Amount</span>
                       <span className="text-kerala-green">₹4,23,458</span>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => toggleStatus(draw.id)}
                className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border-2 ${draw.status === 'completed' ? 'border-gray-100 text-gray-300' : 'border-kerala-dark text-kerala-dark hover:bg-kerala-dark hover:text-white'}`}
              >
                {draw.status === 'upcoming' ? 'Go Live' : draw.status === 'live' ? 'Mark Completed' : 'Archive'}
              </button>
           </div>
         ))}
      </div>
    </div>
  );
}
