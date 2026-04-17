import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-kerala-dark text-white/70 py-8 mt-auto border-t-4 border-kerala-red">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-display text-kerala-gold font-bold mb-4">Kerala Jackpots</h3>
          <p className="text-sm border-l-2 border-kerala-gold pl-3">
            Your trusted daily lottery platform. Play responsibly.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/buy-tickets" className="hover:text-kerala-gold">Buy Tickets</Link></li>
            <li><Link to="/results" className="hover:text-kerala-gold">Results</Link></li>
            <li><Link to="/check-winner" className="hover:text-kerala-gold">Check Winner</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-kerala-gold">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-kerala-gold">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-kerala-gold">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs mt-8 opacity-50">
        &copy; {new Date().getFullYear()} Kerala Jackpots Daily. All rights reserved.
      </div>
    </footer>
  );
}
