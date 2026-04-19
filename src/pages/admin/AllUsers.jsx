import { useState, useEffect } from 'react';
import { listenToOrders, approveOrder } from '../../firebase/db';
import toast from 'react-hot-toast';

export default function AllUsers() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
     // Listen to all orders for admin review
     const unsub = listenToOrders(setOrders);
     return () => unsub();
  }, []);

  const handleApprove = async (order) => {
     try {
       await approveOrder(order.id);
       toast.success(`Approved order for ${order.userName}`);
     } catch(e) {
       toast.error(e.message);
     }
  };

  const handleSendMessage = (order) => {
     const tix = order.tickets.join(', ');
     const msg = `Hello ${order.userName},\n\nYour payment of ₹${order.totalPrice} has been approved!\nHere are your tickets: ${tix}\n\nBest of luck!`;
     const url = `https://wa.me/${order.userPhone}?text=${encodeURIComponent(msg)}`;
     window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
       <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-display font-black text-xl text-kerala-dark">Pending Approvals ({orders.length})</h2>
          <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-widest">Verify Screenshot on WhatsApp before approving</p>
       </div>
       <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
             <tr>
                <th className="px-8 py-4">User Details</th>
                <th className="px-8 py-4">Tickets</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
             {orders.length === 0 ? (
               <tr><td colSpan="5" className="text-center py-8 text-gray-400 text-xs font-bold uppercase tracking-widest">No pending orders</td></tr>
             ) : orders.map((o) => (
               <tr key={o.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                     <p className="font-bold text-sm">{o.userName}</p>
                     <p className="text-[10px] text-gray-400 font-mono">+91 {o.userPhone}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1">
                      {o.tickets.map(t => <span key={t} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-mono font-black">{t}</span>)}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-xs text-kerala-green italic">₹{o.totalPrice}</td>
                  <td className="px-8 py-6">
                     <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${o.status === 'approved' ? 'bg-green-100 text-green-600 border-green-200' : 'bg-orange-100 text-orange-600 border-orange-200'}`}>
                       {o.status}
                     </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button 
                      onClick={()=>handleApprove(o)} 
                      disabled={o.status === 'approved'}
                      className="text-[10px] bg-kerala-green text-white px-4 py-2 font-black uppercase border border-kerala-green rounded shadow-sm hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {o.status === 'approved' ? 'Approved' : 'Approve'}
                    </button>
                    <button onClick={()=>handleSendMessage(o)} className="text-[10px] bg-[#25D366] text-white px-4 py-2 font-black uppercase border border-[#25D366] rounded shadow-sm hover:scale-105 transition-all">
                      Message
                    </button>
                  </td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>
  );
}
