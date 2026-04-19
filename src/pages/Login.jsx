import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSendOTP = () => {
    if (phone === '9999999999') {
      toast.success('OTP sent! Use 123456');
      setStep(2);
      setError('');
    } else if (phone === '0000000000') {
      toast.success('OTP sent! Use 000000');
      setStep(2);
      setError('');
    } else {
      setError('User not found. Try 9999999999');
      toast.error('User not found');
    }
  };

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    try {
      const user = await login(phone, otp);
      toast.success(`Welcome back, ${user.name}! 🎉`);
      navigate(user.isAdmin ? '/admin' : from);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const quickLogin = async (p, o) => {
    setPhone(p);
    setOtp(o);
    try {
      const user = await login(p, o);
      toast.success(`Welcome back, ${user.name}! 🎉`);
      navigate(user.isAdmin ? '/admin' : from);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-kerala-cream">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-kerala-green/10"
      >
        <div className="bg-kerala-green p-8 text-white text-center">
          <h2 className="text-3xl font-display font-bold">Kerala Jackpots</h2>
          <p className="opacity-80 mt-2">Login to your account</p>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 block w-full rounded-none rounded-r-xl border-gray-300 focus:ring-kerala-green focus:border-kerala-green font-mono"
                    placeholder="9999999999"
                  />
                </div>
                {error && <p className="mt-2 text-sm text-kerala-red">{error}</p>}
                
                <button
                  onClick={handleSendOTP}
                  className="w-full mt-6 bg-kerala-green text-white font-bold py-4 rounded-xl shadow-lg hover:bg-opacity-90 transition-all"
                >
                  Send OTP
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full text-center text-4xl font-mono tracking-[0.5em] rounded-xl border-gray-300 focus:ring-kerala-green focus:border-kerala-green"
                  placeholder="000000"
                />
                {error && <p className="mt-2 text-sm text-kerala-red">{error}</p>}
                
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full mt-6 bg-kerala-gold text-kerala-dark font-bold py-4 rounded-xl shadow-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
                
                <button 
                  onClick={() => setStep(1)}
                  className="w-full mt-4 text-sm text-gray-500 hover:text-kerala-green underline"
                >
                  Change Phone Number
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">Admin Quick Access</p>
            <div className="flex justify-center">
              <button 
                onClick={() => quickLogin('0000000000', '000000')}
                className="w-full text-xs font-black uppercase tracking-widest border border-kerala-gold/30 bg-kerala-gold text-kerala-dark py-4 rounded-xl shadow-lg hover:bg-yellow-400 hover:scale-105 transition-all"
              >
                Login as Administrator
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
