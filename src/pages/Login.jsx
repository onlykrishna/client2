import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    try {
      const user = await login(username, password);
      toast.success(`Welcome back, ${user.name}! 🎉`);
      navigate(user.isAdmin ? '/admin' : from);
    } catch (err) {
      setError(err.message);
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
          <p className="opacity-80 mt-2">Secure Admin Login</p>
        </div>

        <form onSubmit={handleLogin} className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-100 p-4 font-mono font-bold focus:ring-kerala-green focus:border-kerala-green"
                placeholder="Admin Username"
                autoComplete="username"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-100 p-4 font-mono font-bold focus:ring-kerala-green focus:border-kerala-green"
                placeholder="********"
                autoComplete="current-password"
              />
            </div>

            {error && <p className="mb-4 text-sm text-kerala-red font-bold text-center">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-kerala-gold text-kerala-dark font-black py-4 rounded-xl shadow-lg hover:bg-yellow-400 transition-all disabled:opacity-50 uppercase tracking-widest"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
        </form>
      </motion.div>
    </div>
  );
}
