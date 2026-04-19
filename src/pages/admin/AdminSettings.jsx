// Settings Panel component to be used in AdminDashboard
import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../firebase/db';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [upiId, setUpiId] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     getSettings().then(s => {
        if(s) {
           setUpiId(s.upiId || '');
           setAdminPhone(s.adminPhone || '');
        }
     });
  }, []);

  const handleSave = async () => {
     setLoading(true);
     try {
       await updateSettings({ upiId, adminPhone });
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
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Payment UPI ID (QR Code)</label>
            <input 
              type="text" 
              value={upiId} 
              onChange={e=>setUpiId(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold font-mono focus:ring-kerala-green focus:border-kerala-green"
              placeholder="82701073807@ptyes"
            />
            <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">This will automatically generate the QR code on the payment page.</p>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Admin WhatsApp Number</label>
            <input 
              type="text" 
              value={adminPhone} 
              onChange={e=>setAdminPhone(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold font-mono focus:ring-kerala-green focus:border-kerala-green"
              placeholder="9748082266"
            />
            <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Users will send payment screenshots to this number.</p>
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
