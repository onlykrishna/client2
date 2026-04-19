import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Buy Tickets', path: '/buy-tickets' },
    { name: 'Results', path: '/results' },
    { name: 'Check Winner', path: '/check-winner' },
  ];

  return (
    <nav className="bg-kerala-green text-white py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center max-w-6xl">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-kerala-gold rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg">
            <span className="text-xl">🎰</span>
          </div>
          <div>
            <h1 className="font-display font-black text-xl leading-none tracking-wide text-kerala-cream">KERALA</h1>
            <p className="text-[10px] font-bold text-kerala-gold uppercase tracking-[0.2em]">Jackpots Daily</p>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
           {links.map((link) => (
             <Link
               key={link.name}
               to={link.path}
               className={`font-black text-xs uppercase tracking-widest transition-colors ${
                 location.pathname === link.path 
                   ? 'text-kerala-gold' 
                   : 'text-white/80 hover:text-white'
               }`}
             >
               {link.name}
             </Link>
           ))}

           {isAdmin && (
             <Link to="/admin" className="bg-kerala-gold text-kerala-dark px-4 py-2 rounded font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-yellow-400">
               Admin Panel
             </Link>
           )}
        </div>
      </div>
    </nav>
  );
}
