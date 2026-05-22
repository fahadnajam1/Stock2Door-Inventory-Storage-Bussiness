import { useState } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import WhyChoose from './pages/WhyChoose';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Testimonials from './components/Testimonials';
import Auth from './pages/Auth';
import CreateOrder from './pages/CreateOrder/CreateOrder';
import Admin from './pages/Admin';

function App() {
  const initial = typeof window !== 'undefined' && window.location.pathname === '/admin' ? 'admin' : 'home';
  const [currentPage, setCurrentPage] = useState(initial);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Home onNavigate={setCurrentPage} />
            <Testimonials />
          </>
        );
      case 'auth':
        return <Auth onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'create-order':
        return <CreateOrder onNavigate={setCurrentPage} />;
      case 'about':
        return <About />;
      case 'services':
        return <Services onNavigate={setCurrentPage} />;
      case 'how-it-works':
        return <HowItWorks onNavigate={setCurrentPage} />;
      case 'pricing':
        return <Pricing onNavigate={setCurrentPage} />;
      case 'admin':
        return <Admin />;
      case 'why-choose':
        return <WhyChoose onNavigate={setCurrentPage} />;
      case 'faq':
        return <FAQ onNavigate={setCurrentPage} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>{renderPage()}</main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;
