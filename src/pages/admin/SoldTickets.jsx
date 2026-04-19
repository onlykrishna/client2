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
    doc.text(`Tickets Purchased: ${order.tickets.length}`, 20, 69);
    
    const tableData = order.tickets.map((t, i) => [i + 1, t, 'CONFIRMED']);
    doc.autoTable({
      startY: 80,
      head: [['#', 'Ticket Number', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [34, 139, 34] }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text('Thank you for choosing Kerala Jackpots Daily!', 105, finalY, { align: 'center' });

    doc.save(`Tickets_${order.userName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
       <div className="p-5 lg:p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-display font-black text-lg lg:text-xl text-kerala-dark">Sold Tickets Directory</h2>
          <p className="text-[10px] lg:text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-widest">({soldOrders.length}) Approved Transactions & Customers</p>
       </div>
       <div className="overflow-x-auto">
         <table className="w-full text-left min-w-[600px] lg:min-w-0">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
               <tr>
                  <th className="px-6 lg:px-8 py-4">Ticket Number</th>
                  <th className="px-6 lg:px-8 py-4">Buyer Details</th>
                  <th className="px-6 lg:px-8 py-4">Amount Paid</th>
                  <th className="px-6 lg:px-8 py-4">Status</th>
                  <th className="px-6 lg:px-8 py-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {soldOrders.length === 0 ? (
                 <tr><td colSpan="5" className="text-center py-8 text-gray-400 text-xs font-bold uppercase tracking-widest">No tickets sold yet</td></tr>
               ) : soldOrders.map((o) => (
                 <tr key={o.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 lg:px-8 py-4 lg:py-6">
                      <div className="flex flex-wrap gap-1 items-start max-w-[150px]">
                        {o.tickets.map(t => <span key={t} className="bg-kerala-gold/20 border border-kerala-gold/50 text-kerala-dark px-2 py-0.5 rounded text-[10px] font-mono font-black">{t}</span>)}
                      </div>
                    </td>
                    <td className="px-6 lg:px-8 py-4 lg:py-6">
                       <p className="font-bold text-sm text-kerala-dark">{o.userName}</p>
                       <p className="text-[10px] text-gray-400 font-mono">+91 {o.userPhone}</p>
                    </td>
                    <td className="px-6 lg:px-8 py-4 lg:py-6 font-black text-xs text-kerala-green italic">₹{o.totalPrice}</td>
                    <td className="px-6 lg:px-8 py-4 lg:py-6">
                       <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border bg-green-100 text-green-600 border-green-200">
                         SOLD
                       </span>
                    </td>
                    <td className="px-6 lg:px-8 py-4 lg:py-6 text-right">
                       <button 
                         onClick={() => generateTicketPDF(o)}
                         className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded font-black text-[10px] uppercase tracking-widest hover:bg-blue-100"
                        >
                         Download PDF
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
       </div>
    </div>
  );
}
