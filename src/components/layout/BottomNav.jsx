import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function BottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Hide on login and admin routes
  if (location.pathname === '/login' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Buy', path: '/buy-tickets', icon: '🎫' },
    { label: 'Results', path: '/results', icon: '📋' },
    { label: 'Check', path: '/check-winner', icon: '🔍' },
    { label: 'Profile', path: isAuthenticated ? '/profile' : '/login', icon: '👤' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      {items.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className="flex flex-col items-center gap-1"
          >
            <span className={`text-xl transition-transform ${isActive ? 'scale-125 -translate-y-1' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-kerala-green' : 'text-gray-400'}`}>
              {item.label}
            </span>
            {isActive && <div className="w-1 h-1 bg-kerala-green rounded-full -mt-0.5"></div>}
          </Link>
        );
      })}
    </div>
  );
}
