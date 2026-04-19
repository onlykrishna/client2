import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Buy', path: '/buy-tickets', icon: '🎫' },
    { name: 'Results', path: '/results', icon: '🏆' },
    { name: 'Checker', path: '/check-winner', icon: '🔍' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-kerala-green' : 'text-gray-400'
              }`}
            >
              <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}>
                {item.icon}
              </span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-kerala-green' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
