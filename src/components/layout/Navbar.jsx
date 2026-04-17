import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Buy Tickets', path: '/buy-tickets' },
    { name: 'My Tickets', path: '/my-tickets' },
    { name: 'Results', path: '/results' },
    { name: 'Check Winner', path: '/check-winner' },
  ];

  return (
    <nav className="bg-kerala-green text-white shadow-lg sticky top-0 z-50 border-b-2 border-kerala-gold">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-display font-bold flex items-center gap-2">
          <span className="text-2xl md:text-3xl">🎰</span>
          <span className="hidden sm:inline">Kerala Jackpots</span>
          <span className="sm:hidden">Kerala</span>
        </Link>
        
        <div className="hidden lg:flex gap-6 items-center font-body text-sm font-bold uppercase tracking-wide">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`hover:text-kerala-gold transition-colors ${location.pathname === link.path ? 'text-kerala-gold' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="bg-kerala-red text-[10px] px-2 py-1 rounded font-black animate-pulse">
              ADMIN
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-all border border-white/10">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] opacity-60 font-bold uppercase leading-none">Wallet</p>
                  <p className="text-xs font-bold text-kerala-gold">₹{user.walletBalance}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-kerala-gold text-kerala-dark flex items-center justify-center font-black shadow-inner">
                  {user.name.charAt(0)}
                </div>
              </Link>
              <button onClick={logout} className="text-white/60 hover:text-white hidden lg:block">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-kerala-gold text-kerala-dark px-6 py-2 rounded-full font-black text-xs shadow-lg hover:bg-yellow-400 transition-all uppercase tracking-widest">
              Login
            </Link>
          )}
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white/80"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-kerala-dark border-t border-white/10 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4 font-bold text-sm">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-white/5">{link.name}</Link>
              ))}
              {isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-kerala-red py-2 border-b border-white/5">Admin Dashboard</Link>}
              {user && <button onClick={logout} className="text-left text-white/50 py-2">Logout</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
