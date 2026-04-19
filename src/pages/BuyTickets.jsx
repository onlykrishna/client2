import { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getActiveDraws, createOrder, listenToDraw, getSettings } from '../firebase/db';

const TicketGrid = memo(({ currentDraw, selectedTickets, toggleTicket }) => {
  if(!currentDraw) return null;
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-2">
      {currentDraw.tickets.map((t, idx) => {
        const isSelected = selectedTickets.includes(t.number);
        const isAvailable = t.status === 'available';
        return (
          <button
            key={idx}
            disabled={!isAvailable}
            onClick={() => toggleTicket(t.number)}
            className={`py-2 px-1 text-[10px] font-mono font-bold border transition-colors rounded ${
              !isAvailable 
                ? 'bg-kerala-red/5 text-kerala-red/30 border-red-100 cursor-not-allowed opacity-50' 
                : isSelected 
                  ? 'bg-kerala-gold text-kerala-dark border-kerala-gold shadow-md scale-105' 
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-kerala-gold hover:text-kerala-dark'
            }`}
          >
             {t.number.replace('KL', '')}
          </button>
        );
      })}
    </div>
  );
});

export default function BuyTickets() {
  const [activeDraws, setActiveDraws] = useState([]);
  const [selectedDrawId, setSelectedDrawId] = useState(null);
  const [currentDraw, setCurrentDraw] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [showPayment, setShowPayment] = useState(false);
  const [settings, setSettings] = useState({ upiId: '', adminPhone: '' });
  const [processing, setProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Initial fetch of active draws (11AM and 3PM today)
    getActiveDraws().then(draws => {
      setActiveDraws(draws);
      if(draws.length > 0) {
         setSelectedDrawId(draws[0].id);
      }
    });
    getSettings().then(setSettings);
  }, []);

  useEffect(() => {
    if (!selectedDrawId) return;
    const unsub = listenToDraw(selectedDrawId, (draw) => {
       setCurrentDraw(draw);
    });
    return () => unsub();
  }, [selectedDrawId]);

  const calculateDynamicPrice = (count) => {
    if (count === 1) return 149;
    if (count === 3) return 399;
    if (count === 6) return 596;
    // fallback or mixed logic
    const sixes = Math.floor(count / 6);
    let rem = count % 6;
    const threes = Math.floor(rem / 3);
    rem = rem % 3;
    return (sixes * 596) + (threes * 399) + (rem * 149);
  };

  const generatePDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(34, 139, 34); // Kerala Green
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('KERALA JACKPOTS DAILY', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('OFFICIAL TICKET CONFIRMATION', 105, 30, { align: 'center' });

    // User Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Customer: ${name}`, 20, 55);
    doc.text(`Phone: +91 ${phone}`, 20, 62);
    doc.text(`Draw Time: ${currentDraw.timeStr} | ${currentDraw.date}`, 20, 69);
    
    // Tickets Table
    const tableData = selectedTickets.map((t, i) => [i + 1, t, 'CONFIRMED']);
    doc.autoTable({
      startY: 80,
      head: [['#', 'Ticket Number', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [34, 139, 34] }
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text('Thank you for choosing Kerala Jackpots Daily!', 105, finalY, { align: 'center' });
    doc.text('Please keep this PDF safe for prize claim.', 105, finalY + 5, { align: 'center' });

    doc.save(`Kerala_Lottery_Tickets_${name.replace(/\s+/g, '_')}.pdf`);
    toast.success('Ticket PDF generated!');
  };

  const currentTotalPrice = calculateDynamicPrice(selectedTickets.length);

  const toggleTicket = (tNumber) => {
    setSelectedTickets(prev => {
       if(prev.includes(tNumber)) return prev.filter(t => t !== tNumber);
       return [...prev, tNumber];
    });
  };

  const handleProceed = () => {
    if(selectedTickets.length === 0) {
       toast.error("Select at least one ticket to proceed");
       return;
    }
    setShowForm(true);
  };

  const handleCreateOrder = async () => {
     if(name.trim()==='' || phone.trim()==='') {
        toast.error("Please enter Name and Phone");
        return;
     }

     setProcessing(true);
     try {
       const total = currentTotalPrice;
       const orderId = await createOrder(selectedDrawId, selectedTickets, name, phone, total);
       setOrderDetails({ orderId, total });
       setShowForm(false);
       setShowPayment(true);
     } catch (e) {
       toast.error(e.message);
     } finally {
       setProcessing(false);
     }
  };

  const openWhatsApp = () => {
     const whatsappPhone = settings.whatsappPhone || '9748082266';
     const ticketsStr = selectedTickets.join(', ');
     const msg = `Hello Admin,\nMy Name is ${name}\nMy Phone is ${phone}\nI have purchased ${selectedTickets.length} tickets for total ₹${orderDetails.total}.\nMy Tickets are: ${ticketsStr}\nHere is my payment screenshot for approval.`;
     const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(msg)}`;
     window.open(url, '_blank');
  };

  if (!currentDraw) return <div className="text-center py-20 text-kerala-dark font-black tracking-widest uppercase">Loading Tickets...</div>;

  return (
    <div className="pb-20">
      <section className="bg-kerala-green pt-12 pb-24 px-4 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Book Your Tickets</h1>
        <div className="flex justify-center gap-4 mt-6">
           {activeDraws.map(d => (
             <button 
               key={d.id} 
               onClick={() => { setSelectedDrawId(d.id); setSelectedTickets([]); }}
               className={`px-6 py-2 rounded-full font-bold text-sm tracking-widest uppercase transition-all ${selectedDrawId === d.id ? 'bg-kerala-gold text-kerala-dark shadow-xl animate-pulse' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}
             >
                {d.timeStr} Draw
             </button>
           ))}
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 -mt-12">
         {/* Ticket Grid */}
         <div className="bg-white rounded-[2rem] p-6 shadow-2xl mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-display font-black text-xl text-kerala-dark">Choose Your Tickets</h3>
               <div className="flex gap-2 text-[10px] font-black uppercase">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 border border-gray-200"></span> Available</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-kerala-gold"></span> Selected</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-kerala-red/20 opacity-50"></span> Sold</span>
               </div>
            </div>

            <TicketGrid currentDraw={currentDraw} selectedTickets={selectedTickets} toggleTicket={toggleTicket} />
         </div>

         {/* Floating Action / Checkout Bar */}
         <AnimatePresence>
           {selectedTickets.length > 0 && !showForm && !showPayment && (
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 50, opacity: 0 }}
               className="fixed bottom-0 left-0 right-0 z-[100] md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl bg-kerala-dark text-white p-4 md:rounded-3xl shadow-2xl border-t border-kerala-gold md:border flex justify-between items-center"
             >
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">{selectedTickets.length} Tickets Selected</p>
                   <p className="font-black text-2xl text-kerala-gold italic font-display leading-none">Total: ₹{currentTotalPrice}</p>
                </div>
                <button onClick={handleProceed} className="bg-kerala-green text-white px-8 py-4 rounded-xl font-black uppercase text-sm tracking-widest hover:bg-opacity-90 shadow-lg">Proceed to Buy</button>
             </motion.div>
           )}
         </AnimatePresence>

         {/* Identify Form Dialog */}
         {showForm && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white max-w-md w-full rounded-[2rem] p-8 shadow-2xl relative">
                  <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full font-bold">X</button>
                  <h3 className="font-display font-black text-2xl mb-2 text-kerala-dark">Your Details</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-6 tracking-widest">To send you ticket confirmations</p>

                  <div className="space-y-4">
                     <div>
                       <label className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">Full Name</label>
                       <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold focus:ring-kerala-green focus:border-kerala-green" placeholder="Enter your name" />
                     </div>
                     <div>
                       <label className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">WhatsApp Phone Number</label>
                       <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold font-mono focus:ring-kerala-green focus:border-kerala-green" placeholder="e.g. 9876543210" />
                     </div>
                  </div>

                  <button disabled={processing} onClick={handleCreateOrder} className="w-full mt-8 bg-kerala-green text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-opacity-90 disabled:opacity-50">
                     {processing ? 'Processing...' : `Proceed to Pay ₹${currentTotalPrice}`}
                  </button>
               </motion.div>
            </div>
         )}

         {/* Payment Scan Dialog */}
         {showPayment && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-20">
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white max-w-md w-full rounded-[2rem] p-8 shadow-2xl text-center relative my-auto">
                  
                  <div className="w-16 h-16 bg-kerala-gold/20 text-kerala-gold rounded-full flex items-center justify-center text-3xl mx-auto mb-4">₹</div>
                  <h3 className="font-display font-black text-3xl text-kerala-dark italic mb-1">₹{orderDetails.total}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Total Payable Amount</p>

                  {/* QR Code */}
                   <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 inline-block mb-6 w-full max-w-[280px]">
                      <p className="text-[9px] font-black uppercase text-kerala-green mb-4 tracking-widest">Scan or Click to Pay</p>
                      <div className="bg-white p-4 rounded-xl shadow-sm inline-block w-[180px] h-[180px] cursor-pointer hover:scale-105 transition-transform">
                         <a href={`upi://pay?pa=${settings?.upiId || '8271073807@ptyes'}&pn=Kerala%20Lottery&mc=5999&mode=02&purpose=00&am=${orderDetails?.total}&cu=INR`}>
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=${settings?.upiId || '8271073807@ptyes'}&pn=Kerala%20Lottery&mc=5999&mode=02&purpose=00&am=${orderDetails?.total}&cu=INR`)}`} 
                              alt="UPI QR Code" 
                              width="180" 
                              height="180" 
                              className="w-full h-full object-contain"
                            />
                         </a>
                      </div>
                      <div className="mt-4 flex flex-col gap-2 w-full">
                         <a href={`upi://pay?pa=${settings?.upiId || '8271073807@ptyes'}&pn=Kerala%20Lottery&mc=5999&mode=02&purpose=00&am=${orderDetails?.total}&cu=INR`} className="font-mono font-bold text-[10px] bg-white py-2 px-3 rounded shadow-sm border border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <span className="text-gray-400">UPI ID:</span>
                            <span className="text-kerala-dark truncate max-w-[150px]">{settings?.upiId || '8271073807@ptyes'}</span>
                         </a>
                         <button onClick={generatePDF} className="w-full bg-blue-50 text-blue-600 border border-blue-200 py-2 rounded font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                           📄 Download Ticket PDF
                         </button>
                         <a href={`upi://pay?pa=${settings?.upiId || '8271073807@ptyes'}&pn=Kerala%20Lottery&mc=5999&mode=02&purpose=00&am=${orderDetails?.total}&cu=INR`} className="font-mono font-bold text-[10px] bg-white py-2 px-3 rounded shadow-sm border border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <span className="text-gray-400">GPay No:</span>
                            <span className="text-kerala-dark">{settings?.gpayPhone || '8271073807'}</span>
                         </a>
                      </div>
                   </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 text-left">
                     <p className="text-[10px] text-yellow-800 font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></span> Pending Approval!</p>
                     <p className="text-xs text-yellow-700">Once you make the payment, you must send us the payment screenshot on WhatsApp for approval. We will send the approved tickets there.</p>
                  </div>

                  <button onClick={openWhatsApp} className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black uppercase text-sm shadow-[0_10px_20px_rgba(37,211,102,0.3)] hover:bg-[#128C7E] flex justify-center items-center gap-2 transition-all">
                     <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                     Send Screenshot on WhatsApp
                  </button>
                  <button onClick={() => { setShowPayment(false); setSelectedTickets([]); }} className="w-full mt-4 py-3 text-[10px] font-black uppercase text-gray-400 hover:text-kerala-dark underline tracking-widest">
                     Close & View Draw
                  </button>
               </motion.div>
            </div>
         )}
      </div>
    </div>
  );
}
