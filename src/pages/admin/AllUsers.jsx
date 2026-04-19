import { useState, useEffect } from 'react';
import { listenToOrders, approveOrder, declineOrder } from '../../firebase/db';
import toast from 'react-hot-toast';

export default function AllUsers() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
     const unsub = listenToOrders(setOrders);
     return () => unsub();
  }, []);

  const generateTicketPDF = (order) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFillColor(34, 139, 34);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('KERALA JACKPOTS DAILY', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('OFFICIAL TICKET CONFIRMATION', 105, 30, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Customer: ${order.userName}`, 20, 55);
    doc.text(`Phone: +91 ${order.userPhone}`, 20, 62);
    doc.text(`Status: APPROVED`, 20, 69);
    const tableData = order.tickets.map((t, i) => [i + 1, t, 'CONFIRMED']);
    doc.autoTable({
      startY: 80,
      head: [['#', 'Ticket Number', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [34, 139, 34] }
    });
    doc.save(`Tickets_${order.userName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleApprove = async (order) => {
     try {
       await approveOrder(order.id);
       toast.success(`Approved order for ${order.userName}`);
       // Open WhatsApp to send confirmation
       const tix = order.tickets.join(', ');
       const msg = `Hello ${order.userName},\n\nYour payment of ₹${order.totalPrice} has been approved!\nHere are your tickets: ${tix}\n\nI have attached your PDF ticket as well. Good luck!`;
       window.open(`https://wa.me/${order.userPhone}?text=${encodeURIComponent(msg)}`, '_blank');
     } catch(e) {
       toast.error(e.message);
     }
  };

  const handleDecline = async (order) => {
     if(!window.confirm(`Decline and release tickets for ${order.userName}?`)) return;
     try {
       await declineOrder(order.id);
       toast.success(`Declined order for ${order.userName}`);
       const msg = `Hello ${order.userName},\n\nAdmin has declined your ticket purchase request for ₹${order.totalPrice}.\nPlease contact us if you believe this is a mistake or provide a new screenshot.`;
       window.open(`https://wa.me/${order.userPhone}?text=${encodeURIComponent(msg)}`, '_blank');
     } catch(e) {
       toast.error(e.message);
     }
  };

  const handleChatManual = (order) => {
    window.open(`https://wa.me/${order.userPhone}`, '_blank');
  };

  return (
    <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
       <div className="p-5 lg:p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 className="font-display font-black text-lg lg:text-xl text-kerala-dark">User & Order Management ({orders.length})</h2>
            <p className="text-[10px] lg:text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-widest">Manage all ticket statuses and notifications</p>
          </div>
          <span className="text-[10px] font-black bg-kerala-gold/10 text-kerala-gold px-3 py-1 rounded-full uppercase">Live Sync Active</span>
       </div>
       <div className="overflow-x-auto">
         <table className="w-full text-left min-w-[700px]">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
               <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Tickets</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">User Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {orders.length === 0 ? (
                 <tr><td colSpan="5" className="text-center py-12 text-gray-400 text-xs font-bold uppercase tracking-widest">No transaction history found</td></tr>
               ) : orders.map((o) => (
                 <tr key={o.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                       <p className="font-bold text-sm text-kerala-dark">{o.userName}</p>
                       <p className="text-[10px] text-gray-400 font-mono">+91 {o.userPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {o.tickets.map(t => <span key={t} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[9px] font-mono font-black">{t}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-sm text-kerala-green italic">₹{o.totalPrice}</td>
                    <td className="px-6 py-4">
                       {(() => {
                         const orderDate = o.drawId?.split('-').slice(0, 3).join('-'); // e.g. 2026-04-19
                         const today = new Date().toLocaleDateString('en-CA');
                         const isPast = orderDate < today;
                         return (
                           <div className="flex flex-col gap-1">
                             <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${o.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' : o.status === 'declined' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                               {o.status}
                             </span>
                             {isPast && o.status === 'pending' && (
                               <span className="text-[8px] text-red-500 font-bold uppercase tracking-tighter animate-pulse">! Draw Expired</span>
                             )}
                           </div>
                         );
                       })()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex flex-wrap gap-2 justify-end">
                        {o.status === 'pending' ? (
                          <>
                            <button 
                              onClick={()=>handleApprove(o)} 
                              className="bg-kerala-green text-white px-4 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest hover:brightness-110 shadow-md hover:scale-105 transition-all"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={()=>handleDecline(o)} 
                              className="bg-kerala-red text-white px-4 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest hover:brightness-110 shadow-md hover:scale-105 transition-all"
                            >
                              Decline
                            </button>
                          </>
                        ) : o.status === 'approved' ? (
                          <>
                             <button 
                               onClick={()=>generateTicketPDF(o)} 
                               className="bg-blue-600 text-white px-4 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest shadow-md hover:scale-105 transition-all"
                             >
                               PDF
                             </button>
                             <button 
                               onClick={()=>handleApprove(o)} 
                               className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest border border-gray-200"
                             >
                               Resend
                             </button>
                          </>
                        ) : (
                          <button 
                            onClick={()=>handleApprove(o)} 
                            className="bg-kerala-dark text-kerala-gold px-4 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest hover:brightness-110 shadow-md hover:scale-105 transition-all"
                          >
                            Re-Approve
                          </button>
                        )}
                        <button 
                          onClick={()=>handleChatManual(o)} 
                          className="bg-[#25D366] text-white px-4 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest shadow-md hover:scale-105 transition-all"
                        >
                          Chat
                        </button>
                      </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
       </div>
    </div>
  );
}
