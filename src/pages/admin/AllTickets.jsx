export default function AllTickets() {
  const tickets = [
    { num: 'KL788291', user: 'Rajan Kumar', date: '2026-04-17', status: 'Winner', prize: '8th' },
    { num: 'KL253828', user: 'Rajan Kumar', date: '2026-04-17', status: 'Active', prize: '-' },
    { num: 'KL445521', user: 'Suresh Nair', date: '2026-04-17', status: 'Winner', prize: '2nd' },
    { num: 'KL112233', user: 'Anjali Menon', date: '2026-04-17', status: 'Active', prize: '-' },
    { num: 'KL579443', user: 'Rajan Kumar', date: '2026-04-17', status: 'Active', prize: '-' },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
       <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex gap-4">
            <select className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
               <option>Today: Apr 17</option>
               <option>Apr 16</option>
            </select>
            <select className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
               <option>All Status</option>
               <option>Winner</option>
               <option>Active</option>
            </select>
          </div>
          <button className="text-[10px] font-black text-gray-400 border border-gray-200 px-6 py-2 rounded-lg uppercase tracking-widest hover:bg-gray-50 transition-all">Export CSV</button>
       </div>
       <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
             <tr>
                <th className="px-8 py-4">Ticket Number</th>
                <th className="px-8 py-4">Purchased By</th>
                <th className="px-8 py-4">Draw Date</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Prize Tier</th>
                <th className="px-8 py-4 text-right">Action</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
             {tickets.map((t, i) => (
               <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                     <span className="font-mono font-black text-lg tracking-widest text-kerala-dark">{t.num}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-sm">{t.user}</p>
                  </td>
                  <td className="px-8 py-6 text-[10px] text-gray-400 font-bold uppercase">{t.date}</td>
                  <td className="px-8 py-6">
                     <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${t.status === 'Winner' ? 'bg-kerala-gold/10 text-kerala-gold border border-kerala-gold/20' : 'bg-blue-50 text-blue-500 border border-blue-100'}`}>
                       {t.status}
                     </span>
                  </td>
                  <td className="px-8 py-6 font-black text-[10px] uppercase text-gray-400 italic font-display">{t.prize}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-gray-300 hover:text-kerala-green text-[10px] font-black uppercase tracking-widest">View Details</button>
                  </td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>
  );
}
