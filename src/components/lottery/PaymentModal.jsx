import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTicketStore } from '../../store/ticketStore';
import toast from 'react-hot-toast';

export default function PaymentModal({ isOpen, onClose, pkg, onSuccess }) {
  const [activeTab, setActiveTab] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const { purchaseTickets } = useTicketStore();

  const handlePayment = async () => {
    if (activeTab === 'upi' && !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID');
      return;
    }

    setProcessing(true);
    try {
      const result = await purchaseTickets(pkg.id);
      if (result.success) {
        onSuccess(result.tickets);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-kerala-dark/80 backdrop-blur-sm"
      ></motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] relative z-[101] overflow-hidden shadow-2xl"
      >
        <div className="bg-gray-50 border-b border-gray-100 p-8 flex justify-between items-center">
            <div>
               <h3 className="font-display font-black text-xl">Complete Payment</h3>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Book {pkg?.count} Tickets</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-tighter">Amount to Pay</p>
               <p className="text-3xl font-black text-kerala-green italic leading-none">₹{pkg?.price}</p>
            </div>
        </div>

        <div className="p-8">
            <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl">
               {['UPI', 'Card', 'Net Banking'].map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab.toLowerCase())}
                   className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.toLowerCase() ? 'bg-white shadow-md text-kerala-green' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'upi' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  key="upi"
                >
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Your UPI ID (e.g. name@okhdfc)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-6 text-lg font-bold focus:ring-kerala-green focus:border-kerala-green mb-8"
                    placeholder="mobile@upi"
                  />
                </motion.div>
              )}
              {activeTab === 'card' && (
                <motion.div
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 10 }}
                   key="card"
                   className="space-y-4 mb-8"
                >
                   <input type="text" placeholder="Card Number" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4" disabled />
                   <div className="flex gap-4">
                     <input type="text" placeholder="MM/YY" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4" disabled />
                     <input type="text" placeholder="CVV" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4" disabled />
                   </div>
                   <p className="text-[10px] text-gray-400 font-bold italic">Card payment is disabled in mock mode.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
               disabled={processing || (activeTab === 'card')}
               onClick={handlePayment}
               className="w-full bg-kerala-green text-white font-black py-5 rounded-2xl shadow-xl hover:bg-kerala-dark transition-all disabled:opacity-50 uppercase tracking-[0.2em] relative overflow-hidden"
            >
               {processing ? (
                 <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                 </span>
               ) : (
                 `Pay ₹${pkg?.price}`
               )}
            </button>
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">Secure & Encrypted Transactions 🛡️</p>
        </div>
      </motion.div>
    </div>
  );
}
