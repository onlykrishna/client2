import { useState, useEffect } from 'react';
import { getSettings } from '../../firebase/db';

export default function FloatingWhatsApp() {
  const [adminPhone, setAdminPhone] = useState('9748082266'); // fallback

  useEffect(() => {
    getSettings().then(s => {
      if (s?.adminPhone) setAdminPhone(s.adminPhone);
    });
  }, []);

  const handleClick = () => {
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent('Hello Admin, I have an inquiry about the Kerala Lottery.')}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[9000] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center animate-bounce"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.764.457 3.418 1.258 4.848L2 22l5.342-1.22A9.95 9.95 0 0012 22c5.522 0 10-4.477 10-10S17.522 2 12 2zM9.544 7.64c.264-.593.535-.605.77-.616.208-.008.448-.01.688-.01.24 0 .63.09.958.448.33.36 1.258 1.232 1.258 3.003 0 1.77-1.288 3.483-1.468 3.73-.18.24-2.528 4.024-6.22 5.51-.876.353-1.56.564-2.09.722-.88.262-1.68.225-2.316.136-.713-.1-2.18-.891-2.485-1.758-.304-.866-.304-1.606-.214-1.758.09-.153.33-.243.69-.423.36-.18 2.18-1.077 2.52-1.197.34-.12.58-.18.82.18s.95 1.197 1.16 1.437c.21.24.42.27.78.09.36-.18 1.554-.572 2.955-1.826 1.09-.974 1.826-2.178 2.036-2.538.21-.36.022-.555-.158-.735-.17-.17-.36-.42-.54-.66-.18-.24-.24-.42-.36-.66-.12-.24-.06-.45 0-.63.072-.195.82-1.954 1.16-2.674z" clipRule="evenodd" />
      </svg>
    </button>
  );
}
