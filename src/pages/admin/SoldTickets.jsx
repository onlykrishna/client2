import { useState, useEffect } from 'react';
import { listenToOrders } from '../../firebase/db';

export default function SoldTickets() {
  const [soldOrders, setSoldOrders] = useState([]);

  useEffect(() => {
     const unsub = listenToOrders((orders) => {
        // filter only approved orders
        const approvedOrders = orders.filter(o => o.status === 'approved');
        setSoldOrders(approvedOrders);
     });
     return () => unsub();
  }, []);

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
       <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-display font-black text-xl text-kerala-dark">Sold Tickets Directory</h2>
          <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-widest">({soldOrders.length}) Approved Transactions & Customers</p>
       </div>
       <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
             <tr>
                <th className="px-8 py-4">Ticket Number</th>
                <th className="px-8 py-4">Buyer Details</th>
                <th className="px-8 py-4">Amount Paid</th>
                <th className="px-8 py-4">Status & Date</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
             {soldOrders.length === 0 ? (
               <tr><td colSpan="4" className="text-center py-8 text-gray-400 text-xs font-bold uppercase tracking-widest">No tickets sold yet</td></tr>
             ) : soldOrders.map((o) => (
               <tr key={o.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1 items-start">
                      {o.tickets.map(t => <span key={t} className="bg-kerala-gold/20 border border-kerala-gold/50 text-kerala-dark px-2 py-0.5 rounded text-[10px] font-mono font-black">{t}</span>)}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <p className="font-bold text-sm text-kerala-dark">{o.userName}</p>
                     <p className="text-[10px] text-gray-400 font-mono">+91 {o.userPhone}</p>
                  </td>
                  <td className="px-8 py-6 font-black text-xs text-kerala-green italic">₹{o.totalPrice}</td>
                  <td className="px-8 py-6">
                     <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border bg-green-100 text-green-600 border-green-200">
                       SOLD
                     </span>
                  </td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>
  );
}
