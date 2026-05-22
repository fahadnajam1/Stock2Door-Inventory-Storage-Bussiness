import { Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleNavClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2 group mb-4"
            >
              <div className="w-10 h-10 mb-2 rounded-lg flex items-center justify-center group-hover: transition-colors transform hover:-translate-y-0.5 hover:scale-105 duration-300">
                <img src="/images/favicon.png" alt="" className="w-8 h-8 object-cover rounded-sm" />
              </div>
              <span className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors">Stock2Door</span>
            </button>
            <p className="text-gray-400 mb-4 max-w-md">
              Your trusted partner for global inventory storage and Australian fulfillment.
              We handle the logistics so you can focus on growing your business.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['home', 'about', 'services', 'how-it-works', 'pricing', 'faq', 'contact'].map((page) => (
                <li key={page}>
                  <button
                    onClick={() => handleNavClick(page)}
                    className="text-gray-400 hover:text-emerald-500 transition-colors capitalize"
                  >
                    {page.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-emerald-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">Melbourne, Sydney, New Castle</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={20} className="text-emerald-500 mt-1 flex-shrink-0" />
                <a href="mailto:stock2door.au@gmail.com" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  stock2door.au@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={20} className="text-emerald-500 mt-1 flex-shrink-0" />
                <a href="tel:+61485504901" className="text-gray-400 hover:text-emerald-500 transition-colors">
                  +61 485 504 901
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Stock2Door. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
