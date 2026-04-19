import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CountdownTimer from '../components/lottery/CountdownTimer';
import PrizeTable from '../components/lottery/PrizeTable';
import { PACKAGES } from '../utils/mockData';
import { motion } from 'framer-motion';
import { getSettings } from '../firebase/db';

export default function Home() {
  const [drawTime, setDrawTime] = useState('11:00 AM');
  const [nextDrawDate, setNextDrawDate] = useState(new Date());

  useEffect(() => {
    getSettings().then(s => {
      const timeStr = s?.drawTime || '11:00 AM';
      setDrawTime(timeStr);
      
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
      
      const target = new Date();
      target.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      
      if (new Date() > target) {
        target.setDate(target.getDate() + 1);
      }
      setNextDrawDate(target);
    });
  }, []);

  return (
    <div className="flex flex-col w-full pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="bg-kerala-dark text-white pt-12 pb-20 px-4 relative overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#d4a017_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-kerala-gold font-black uppercase tracking-[0.3em] text-sm mb-4"
          >
            Mega Bumper Dhamaka
          </motion.p>
          
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl md:text-8xl font-display font-black leading-tight mb-8"
          >
            Win <span className="text-kerala-gold drop-shadow-[0_0_15px_rgba(212,160,23,0.4)]">₹25 CRORE</span>
          </motion.h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
              <p className="text-[10px] uppercase font-black text-white/50 mb-2 tracking-widest text-center">Next Draw In</p>
              <CountdownTimer targetTime={nextDrawDate} />
            </div>
            
            <div className="hidden md:block h-12 w-px bg-white/20"></div>

            <div className="text-left">
              <p className="text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-kerala-red rounded-full animate-ping"></span>
                Daily Draw at {drawTime}
              </p>
              <p className="text-sm opacity-60">Verified & Authorized Results</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/buy-tickets" 
              className="bg-kerala-gold text-kerala-dark px-10 py-5 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(212,160,23,0.3)] hover:translate-y-[-2px] hover:shadow-[0_15px_40px_rgba(212,160,23,0.4)] transition-all uppercase tracking-widest"
            >
              Book Tickets Now
            </Link>
            <Link 
              to="/results" 
              className="bg-white/5 backdrop-blur border border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all uppercase tracking-widest"
            >
              View Results
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Packages Quick View */}
      <section className="container mx-auto max-w-6xl px-4 -mt-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center group relative overflow-hidden"
            >
              {pkg.tag && (
                <div className="absolute top-4 right-[-35px] bg-kerala-green text-white text-[10px] font-black py-1 px-10 rotate-45 uppercase">
                  {pkg.tag}
                </div>
              )}
              <h3 className="font-display text-2xl font-bold mb-2">{pkg.label}</h3>
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {idx === 0 ? '🎫' : idx === 1 ? '🎫🎫' : '🎟️🎟️🎟️'}
              </div>
              <div className="text-center mb-6">
                <p className="text-4xl font-black text-kerala-green">₹{pkg.price}</p>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                  {pkg.count} {pkg.count === 1 ? 'Ticket' : 'Tickets'} • ₹{pkg.perTicket}/ea
                </p>
              </div>
              <Link 
                to="/buy-tickets"
                className="w-full bg-gray-50 border border-gray-200 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-kerala-green hover:text-white hover:border-kerala-green transition-all text-center"
              >
                Choose
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ticker */}
      <div className="bg-kerala-green py-3 overflow-hidden whitespace-nowrap border-y border-kerala-gold/30">
        <div className="flex animate-marquee">
          {Array(5).fill(0).map((_, i) => (
            <span key={i} className="text-white font-mono text-sm mx-10 flex items-center gap-2">
              <span className="text-kerala-gold">🏆</span> KL{Math.floor(100000 + Math.random() * 899999)} Wins ₹10,000!
            </span>
          ))}
        </div>
      </div>

      {/* Prize structure section */}
      <section className="bg-kerala-cream py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-kerala-dark mb-4">Prize Structure</h2>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Massive Payouts Every Single Day</p>
          </div>
          <PrizeTable />
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-display font-bold mb-16">Start Winning in 3 Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-[25%] right-[25%] h-px bg-dashed border-t-2 border-dashed border-gray-100"></div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 bg-kerala-green/10 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-inner">🎫</div>
              <h4 className="font-black text-lg mb-2 uppercase">1. Pick Your Pack</h4>
              <p className="text-gray-500 text-sm">Select from our discount packages start from ₹149.</p>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 bg-kerala-gold/10 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-inner">🔒</div>
              <h4 className="font-black text-lg mb-2 uppercase">2. Secure Payment</h4>
              <p className="text-gray-500 text-sm">Pay instantly via UPI, Card, or Netbanking.</p>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 bg-kerala-red/10 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-inner">🏆</div>
              <h4 className="font-black text-lg mb-2 uppercase">3. Win Big</h4>
              <p className="text-gray-500 text-sm">Check your results at {drawTime} and claim your prize!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-kerala-dark py-20 px-4 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center items-center">
             <div>
               <p className="text-4xl mb-2">📜</p>
               <h5 className="font-black text-xs uppercase tracking-widest text-kerala-gold">Govt Authorized</h5>
             </div>
             <div>
               <p className="text-4xl mb-2">🚀</p>
               <h5 className="font-black text-xs uppercase tracking-widest text-kerala-gold">Instant Payouts</h5>
             </div>
             <div>
               <p className="text-4xl mb-2">💎</p>
               <h5 className="font-black text-xs uppercase tracking-widest text-kerala-gold">Secure Platform</h5>
             </div>
             <div>
               <p className="text-4xl mb-2">📈</p>
               <h5 className="font-black text-xs uppercase tracking-widest text-kerala-gold">1.2M+ Users</h5>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
