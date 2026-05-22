import { Warehouse, Package, Truck, RotateCcw, TrendingUp, Shield } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ServicesProps {
  onNavigate: (page: string) => void;
}

export default function Services({ onNavigate }: ServicesProps) {
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.1 });

  const handleContactClick = () => {
    // Navigate to contact page
    onNavigate('contact');
    // After navigation, scroll to the "Get in Touch" section if it exists.
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById('get-in-touch');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  const services = [
    {
      icon: Warehouse,
      title: 'Global Inventory Storage',
      description: 'Send your products from anywhere in the world to our Australian warehouses. We provide secure, climate-controlled storage with real-time inventory tracking.',
      features: [
        'Climate-controlled facilities',
        'Real-time inventory management',
        'Barcode scanning & tracking',
        'Flexible storage options',
      ],
    },
    {
      icon: Shield,
      title: 'Secure Australian Warehousing',
      description: 'State-of-the-art warehouse facilities across Australia with 24/7 security monitoring, ensuring your inventory is safe and accessible.',
      features: [
        '24/7 security monitoring',
        'Insurance coverage available',
        'Fire suppression systems',
        'Multiple location options',
      ],
    },
    {
      icon: Package,
      title: 'Pick & Pack Fulfillment',
      description: 'Professional order picking and packing services. Every order is carefully prepared with quality materials and attention to detail.',
      features: [
        'Same-day order processing',
        'Professional packaging materials',
        'Custom branding options',
        'Quality control checks',
      ],
    },
    {
      icon: Truck,
      title: 'Order Dispatch & Delivery',
      description: 'Fast, reliable delivery across Australia through our network of trusted courier partners. Track every shipment in real-time.',
      features: [
        'Australia-wide coverage',
        'Express delivery options',
        'Real-time tracking',
        'Proof of delivery',
      ],
    },
    {
      icon: RotateCcw,
      title: 'Returns Handling',
      description: 'Streamlined returns management. We receive, inspect, and process returns, updating your inventory automatically.',
      features: [
        'Automated returns processing',
        'Quality inspection',
        'Restocking services',
        'Returns portal integration',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Scalable Solutions',
      description: "Whether you're shipping 10 orders a month or 10,000 a day, our infrastructure scales with your business growth.",
      features: [
        'No minimum volume requirements',
        'Flexible pricing tiers',
        'Peak season support',
        'Dedicated account management',
      ],
    },
  ];

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Comprehensive fulfillment solutions designed for modern eCommerce businesses.
              From storage to delivery, we handle every step of the logistics chain.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20" ref={servicesRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-emerald-200 transform hover:scale-105 hover:-translate-y-1 ${
                  servicesVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: servicesVisible ? `${index * 0.1}s` : '0s' }}
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-all duration-300 transform group-hover:scale-110">
                  <service.icon className="text-emerald-600 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start group/item">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0 transform group-hover/item:scale-150 transition-transform duration-300" />
                      <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" ref={ctaRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-12 text-white text-center transition-all duration-700 transform ${
            ctaVisible ? 'animate-fadeInUp hover:scale-105' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              We understand that every business has unique requirements. Let's discuss how we can tailor our services to meet your specific needs.
            </p>
            <button
              onClick={handleContactClick}
              className="bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
            >
              Contact Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
