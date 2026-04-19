// Settings Panel component to be used in AdminDashboard
import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../firebase/db';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [upiId, setUpiId] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [qrBase64, setQrBase64] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     getSettings().then(s => {
        if(s) {
           setUpiId(s.upiId || '');
           setAdminPhone(s.adminPhone || '');
           setQrBase64(s.qrBase64 || '');
        }
     });
  }, []);

  const handleSave = async () => {
     setLoading(true);
     try {
       await updateSettings({ upiId, adminPhone, qrBase64 });
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
              placeholder="8271073807@ptyes"
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

          <div>
            <label className="block text-[10px] font-black text-kerala-green uppercase tracking-widest mb-2 flex items-center gap-2">Native Merchant QR Image (Recommended)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                 const file = e.target.files[0];
                 if(file) {
                    if(file.size > 800000) {
                       toast.error("File is too large! Please compress it under 800KB.");
                       return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                       setQrBase64(reader.result);
                    };
                    reader.readAsDataURL(file);
                 }
              }}
              className="w-full bg-gray-50 border-2 border-gray-100 border-dashed rounded-xl px-4 py-4 font-bold text-xs focus:ring-kerala-gold"
            />
            <p className="text-[10px] text-gray-400 mt-2 font-bold tracking-widest">If Google Pay rejects dynamic QR codes, simply upload your physical Paytm/PhonePe QR code screenshot here. This absolutely guarantees 100% scan success across all apps.</p>
            {qrBase64 && (
               <div className="mt-4 p-4 bg-white border-2 border-gray-100 rounded-xl inline-block shadow-sm">
                  <p className="text-[10px] text-kerala-green font-black uppercase tracking-widest mb-2 border-b pb-2">Current Bound QR Code</p>
                  <img src={qrBase64} alt="Native QR Code" className="w-32 h-32 object-contain mx-auto" />
                  <button onClick={() => setQrBase64('')} className="mt-2 w-full text-center text-[10px] font-bold text-red-500 uppercase">Remove</button>
               </div>
            )}
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
