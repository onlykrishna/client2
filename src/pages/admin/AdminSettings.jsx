// Settings Panel component to be used in AdminDashboard
import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../firebase/db';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [upiId, setUpiId] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [gpayPhone, setGpayPhone] = useState('');
  const [drawTime, setDrawTime] = useState('11:00 AM');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     getSettings().then(s => {
        if(s) {
           setUpiId(s.upiId || '8271073807@ptyes');
           setWhatsappPhone(s.whatsappPhone || '9748082266');
           setGpayPhone(s.gpayPhone || '8271073807');
           setDrawTime(s.drawTime || '11:00 AM');
        }
     });
  }, []);

  const handleSave = async () => {
     setLoading(true);
     try {
       await updateSettings({ upiId, whatsappPhone, gpayPhone, drawTime });
       toast.success('Settings saved successfully!');
     } catch(e) {
       toast.error(e.message);
     } finally {
       setLoading(false);
     }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 max-w-2xl">
       <h2 className="font-display font-black text-2xl mb-6 text-kerala-dark">System Settings</h2>
       
       <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">WhatsApp Number (Screenshots)</label>
              <input 
                type="text" 
                value={whatsappPhone} 
                onChange={e=>setWhatsappPhone(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold font-mono focus:ring-kerala-green focus:border-kerala-green"
                placeholder="9748082266"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">GPay Number (Mobile Pay)</label>
              <input 
                type="text" 
                value={gpayPhone} 
                onChange={e=>setGpayPhone(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold font-mono focus:ring-kerala-green focus:border-kerala-green"
                placeholder="8271073807"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Payment UPI ID (QR Code)</label>
            <input 
              type="text" 
              value={upiId} 
              onChange={e=>setUpiId(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold font-mono focus:ring-kerala-green focus:border-kerala-green"
              placeholder="8271073807@ptyes"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Daily Draw Time</label>
            <input 
              type="text" 
              value={drawTime} 
              onChange={e=>setDrawTime(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold font-mono focus:ring-kerala-green focus:border-kerala-green"
              placeholder="11:00 AM"
            />
            <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest italic">Example: 11:00 AM or 04:30 PM</p>
          </div>

          <button 
             onClick={handleSave} 
             disabled={loading}
             className="w-full bg-kerala-gold text-kerala-dark py-4 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-yellow-400 transition-all mt-8"
          >
             {loading ? 'Saving...' : 'Save Configuration'}
          </button>
       </div>
    </div>
  );
}
