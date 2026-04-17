export default function AllUsers() {
  const users = [
    { name: 'Rajan Kumar', phone: '9999999999', tickets: 12, spent: 1788, balance: 1250, kyc: 'Verified', joined: '12 Apr' },
    { name: 'Suresh Nair', phone: '9845612345', tickets: 5, spent: 745, balance: 50, kyc: 'Pending', joined: '15 Apr' },
    { name: 'Anjali Menon', phone: '9446056789', tickets: 24, spent: 3576, balance: 800, kyc: 'Verified', joined: '10 Apr' },
    { name: 'Rahul Pillai', phone: '9001234567', tickets: 1, spent: 149, balance: 1, kyc: 'Rejected', joined: '17 Apr' },
    { name: 'Lekshmi Varrier', phone: '9744123890', tickets: 8, spent: 1192, balance: 120, kyc: 'Verified', joined: '14 Apr' },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
       <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
             <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:ring-kerala-green" />
          </div>
          <button className="text-[10px] font-black text-white bg-kerala-green px-6 py-2 rounded-lg uppercase tracking-widest shadow-lg">New User</button>
       </div>
       <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
             <tr>
                <th className="px-8 py-4">Name/Phone</th>
                <th className="px-8 py-4 text-center">Tickets</th>
                <th className="px-8 py-4">Total Spent</th>
                <th className="px-8 py-4">Wallet</th>
                <th className="px-8 py-4">KYC</th>
                <th className="px-8 py-4">Joined</th>
                <th className="px-8 py-4"></th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
             {users.map((u, i) => (
               <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                     <p className="font-bold text-sm">{u.name}</p>
                     <p className="text-[10px] text-gray-400 font-mono">+91 {u.phone}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black">{u.tickets}</span>
                  </td>
                  <td className="px-8 py-6 font-black text-[10px] uppercase text-gray-600 italic">₹{u.spent}.00</td>
                  <td className="px-8 py-6 font-black text-[10px] uppercase text-kerala-green italic">₹{u.balance}.00</td>
                  <td className="px-8 py-6">
                     <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-tighter border ${u.kyc === 'Verified' ? 'bg-green-100 text-green-600 border-green-200' : u.kyc === 'Pending' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-red-100 text-red-600 border-red-200'}`}>
                       {u.kyc}
                     </span>
                  </td>
                  <td className="px-8 py-6 text-[10px] text-gray-400 font-bold uppercase">{u.joined} 2026</td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-gray-300 hover:text-kerala-green p-1 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>
  );
}
