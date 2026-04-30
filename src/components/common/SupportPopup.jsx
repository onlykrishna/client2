import { useState, useEffect } from 'react';
import { getSettings } from '../../firebase/db';

export default function SupportPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('9748082266'); // fallback
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user already saw the popup in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenSupportPopup');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 15000); // 15 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    getSettings().then(s => {
      if (s?.whatsappPhone) setWhatsappPhone(s.whatsappPhone);
    });
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('hasSeenSupportPopup', 'true');
    }, 300); // Match animation duration
  };

  const handleWhatsAppClick = () => {
    if (window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'Popup WhatsApp Inquiry'
      });
    }
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent('Hello Admin, I need help with the Kerala Lottery.')}`, '_blank');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div 
        className={`bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full transform transition-all duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}
      >
        <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] p-8 text-white text-center relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.201.298-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </div>
          
          <h3 className="text-2xl font-black mb-2">Need Assistance?</h3>
          <p className="text-white/90 text-sm font-medium">We are here to help you with your lottery queries!</p>
        </div>
        
        <div className="p-8 space-y-4">
          <p className="text-gray-600 text-center text-sm leading-relaxed">
            Our support team is available on WhatsApp to guide you through ticket purchases and results.
          </p>
          
          <button 
            onClick={handleWhatsAppClick}
            className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold uppercase text-sm shadow-lg shadow-green-200 hover:bg-[#128C7E] transition-all flex justify-center items-center gap-2 group"
          >
            <span>Chat on WhatsApp</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          
          <button 
            onClick={handleClose}
            className="w-full text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-gray-600 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
