import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BottomNav from './components/layout/BottomNav';
import { AdminRoute } from './components/layout/ProtectedRoute';

import Home from './pages/Home';
import BuyTickets from './pages/BuyTickets';
import Results from './pages/Results';
import CheckWinner from './pages/CheckWinner';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';
import SupportPopup from './components/common/SupportPopup';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col min-h-screen bg-kerala-cream selection:bg-kerala-gold selection:text-kerala-dark">
        {/* Only show standard Navbar if not on admin route */}
        <ConditionalNavbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/buy-tickets" element={<BuyTickets />} />
            <Route path="/results" element={<Results />} />
            <Route path="/check-winner" element={<CheckWinner />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
          </Routes>
        </main>
        <ConditionalFooter />
        <BottomNav />
        <FloatingWhatsApp />
        <ConditionalSupportPopup />
      </div>
    </BrowserRouter>
  );
}

function ConditionalNavbar() {
  const isLoginPage = window.location.pathname === '/login';
  const isAdminPage = window.location.pathname.startsWith('/admin');
  if (isLoginPage || isAdminPage) return null;
  return <Navbar />;
}

function ConditionalFooter() {
  const isAdminPage = window.location.pathname.startsWith('/admin');
  if (isAdminPage) return null;
  return <Footer />;
}

function ConditionalSupportPopup() {
  const isAdminPage = window.location.pathname.startsWith('/admin');
  if (isAdminPage) return null;
  return <SupportPopup />;
}

export default App;
