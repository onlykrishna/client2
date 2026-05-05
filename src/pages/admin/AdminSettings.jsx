// Settings Panel component to be used in AdminDashboard
import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../firebase/db';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [upiId, setUpiId] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [gpayPhone, setGpayPhone] = useState('');
  const [drawTime, setDrawTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchSettings = async () => {
     setFetching(true);
     try {
       const s = await getSettings();
       if(s) {
          setUpiId(s.upiId || '8271073807@ptyes');
          setWhatsappPhone(s.whatsappPhone || '9748082266');
          setGpayPhone(s.gpayPhone || '8271073807');
          setDrawTime(s.drawTime || '11:00 AM');
       }
     } catch (e) {
       toast.error("Failed to load settings");
     } finally {
       setFetching(false);
     }
  };

  useEffect(() => {
     fetchSettings();
  }, []);

  const handleSave = async () => {
     if (!upiId || !whatsappPhone || !gpayPhone || !drawTime) {
        toast.error("All fields are required");
        return;
     }

     setLoading(true);
     try {
       const dataToSave = { 
         upiId: upiId.trim(), 
         whatsappPhone: whatsappPhone.trim(), 
         gpayPhone: gpayPhone.trim(), 
         drawTime: drawTime.trim() 
       };
       await updateSettings(dataToSave);
       toast.success('Settings updated successfully!');
       await fetchSettings(); // Refresh to confirm
     } catch(e) {
       toast.error(e.message);
     } finally {
       setLoading(false);
     }
  };

  if (fetching) return <div className="p-8 text-gray-400 font-black uppercase tracking-widest animate-pulse">Loading System Configuration...</div>;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 max-w-2xl">
       <div className="flex justify-between items-center mb-6">
          <h2 className="font-display font-black text-2xl text-kerala-dark">System Settings</h2>
          <button onClick={fetchSettings} className="text-[10px] font-black uppercase text-kerala-green hover:underline">Refresh Data</button>
       </div>
       
       <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">WhatsApp Number (Screenshots)</label>
              <input 
                type="text" 
                value={whatsappPhone} 
                onChange={e=>setWhatsappPhone(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold font-mono focus:ring-kerala-green focus:border-kerala-green transition-all"
                placeholder="e.g. 9748082266"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">GPay Number (Mobile Pay)</label>
              <input 
                type="text" 
                value={gpayPhone} 
                onChange={e=>setGpayPhone(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold font-mono focus:ring-kerala-green focus:border-kerala-green transition-all"
                placeholder="e.g. 8271073807"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Payment UPI ID (QR Code)</label>
            <input 
              type="text" 
              value={upiId} 
              onChange={e=>setUpiId(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold font-mono focus:ring-kerala-green focus:border-kerala-green transition-all"
              placeholder="e.g. 8271073807@ptyes"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Daily Draw Time</label>
            <input 
              type="text" 
              value={drawTime} 
              onChange={e=>setDrawTime(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold font-mono focus:ring-kerala-green focus:border-kerala-green transition-all"
              placeholder="e.g. 11:00 AM"
            />
            <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest italic">Format: HH:MM AM/PM (e.g., 11:00 AM)</p>
          </div>

          <div className="pt-4 border-t border-gray-50">
            <button 
               onClick={handleSave} 
               disabled={loading}
               className="w-full bg-kerala-dark text-kerala-gold py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
               {loading ? (
                 <>
                   <span className="w-4 h-4 border-2 border-kerala-gold border-t-transparent rounded-full animate-spin"></span>
                   Saving Changes...
                 </>
               ) : 'Update Configuration'}
            </button>
          </div>
       </div>
    </div>
  );
}
