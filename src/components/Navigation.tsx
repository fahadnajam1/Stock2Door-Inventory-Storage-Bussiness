import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export default function Navigation({ currentPage, onNavigate }: { currentPage: string; onNavigate: (p: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50 animate-slideInDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2 group"
          >
            <div className="w-9 h-9 mb-2 rounded-lg flex items-center justify-center group-hover: transition-colors transform hover:-translate-y-0.5 hover:scale-105 duration-300">
              <img src="/images/logo.jpeg" alt="" />
            </div>
            <span className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors">Stock2Door</span>
          </button>

          <div className="hidden md:flex md:items-center md:justify-center md:flex-1">
            <div className="flex items-center space-x-6">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-base font-semibold transition-colors relative group animate-fadeInUp px-3 py-2 rounded-lg hover:bg-gray-100 ${
                    currentPage === item.id
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.label}
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-emerald-600 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></span>
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleNavClick('contact')}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 hover:shadow-lg transition-all duration-300 font-semibold text-sm transform hover:scale-105"
            >
              Get a Quote
            </button>

            {!user ? (
              <button
                onClick={() => handleNavClick('auth')}
                className="text-emerald-600 px-3 py-2 font-semibold rounded-md hover:bg-emerald-50"
              >
                Log In
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="text-emerald-700 px-3 py-2 rounded-md font-medium hover:bg-emerald-50 border border-emerald-100"
              >
                Dashboard
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div> 

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t animate-slideInDown">
          <div className="px-4 pt-2 pb-4 space-y-3">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 animate-fadeInUp font-semibold text-base ${
                  currentPage === item.id
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 font-semibold text-base hover:shadow-lg animate-fadeInUp"
              style={{ animationDelay: '0.35s' }}
            >
              Get a Quote
            </button>
            {/* Mobile auth actions */}
            {!user ? (
              <button
                onClick={() => handleNavClick('auth')}
                className="w-full text-emerald-600 px-4 py-3 rounded-lg font-semibold hover:bg-emerald-50"
              >
                Login / Sign up
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-emerald-700 px-4 py-3 rounded-lg font-semibold hover:bg-emerald-50 border border-emerald-100"
                >
                  Dashboard
                </button>
                <button
                  onClick={async () => {
                    await signOut();
                    handleNavClick('home');
                  }}
                  className="w-full text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
