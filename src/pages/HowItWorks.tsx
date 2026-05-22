import { Ship, Warehouse, ShoppingCart, Package, Truck, CheckCircle2 } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface HowItWorksProps {
  onNavigate: (page: string) => void;
}

export default function HowItWorks({ onNavigate }: HowItWorksProps) {
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: techRef, isVisible: techVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.1 });

  const steps = [
    {
      icon: Ship,
      title: 'Ship Your Inventory to Us',
      description: 'Send your products from anywhere in the world to our Australian warehouse. We provide you with shipping instructions and receiving details.',
      details: [
        'Receive detailed shipping instructions',
        'Multiple international shipping options',
        'We handle customs clearance',
        'Products checked and cataloged on arrival',
      ],
    },
    {
      icon: Warehouse,
      title: 'We Store Your Products',
      description: 'Your inventory is securely stored in our climate-controlled facilities with 24/7 monitoring. Track everything in real-time through our portal.',
      details: [
        'Secure, climate-controlled storage',
        'Real-time inventory visibility',
        'Barcode tracking for every item',
        'Regular stock audits',
      ],
    },
    {
      icon: ShoppingCart,
      title: 'Orders Come In',
      description: "When your customers place orders, they're automatically sent to our system. We integrate with all major eCommerce platforms.",
      details: [
        'Seamless platform integration',
        'Automatic order import',
        'Real-time order status updates',
        'Support for all major marketplaces',
      ],
    },
    {
      icon: Package,
      title: 'Professional Packing',
      description: 'Our team picks and packs each order with care, using quality materials. Custom branding and special packaging options available.',
      details: [
        'Same-day order processing',
        'Quality packaging materials',
        'Custom branding available',
        'Double-checked for accuracy',
      ],
    },
    {
      icon: Truck,
      title: 'Fast Dispatch',
      description: 'Orders are dispatched the same day through our courier network. Tracking information is automatically sent to your customers.',
      details: [
        'Same-day dispatch for orders before 2 PM',
        'Multiple courier options',
        'Automatic tracking updates',
        'Express delivery available',
      ],
    },
    {
      icon: CheckCircle2,
      title: 'Customer Receives',
      description: 'Your customer receives their order quickly with full tracking. We handle any delivery issues and provide proof of delivery.',
      details: [
        'Fast Australia-wide delivery',
        'Real-time tracking',
        'Proof of delivery',
        'Responsive customer support',
      ],
    },
  ];

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How It Works</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              From inventory arrival to customer delivery, we've streamlined every step
              of the fulfillment process so you can focus on growing your business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20" ref={stepsRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className={`relative transition-all duration-700 ${
                stepsVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: stepsVisible ? `${index * 0.08}s` : '0s' }}>
                <div className="flex flex-col md:flex-row gap-8 items-start transform hover:translate-x-1 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center transform hover:scale-110 hover:bg-emerald-600 transition-all duration-300 group">
                      <step.icon className="text-emerald-600 group-hover:text-white transition-colors" size={36} />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center mb-4">
                      <span className="text-emerald-600 font-bold text-lg mr-3 bg-emerald-100 px-3 py-1 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-all inline-flex items-center whitespace-nowrap">
                        Step&nbsp;{index + 1}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 text-lg mb-4 leading-relaxed">{step.description}</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start group/detail hover:translate-x-1 transition-transform duration-300">
                          <CheckCircle2 className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0 transform group-hover/detail:scale-125 transition-transform duration-300" size={18} />
                          <span className="text-gray-700 group-hover/detail:text-gray-900 transition-colors">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-10 top-20 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 to-transparent animate-pulse2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" ref={techRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold text-gray-900 mb-12 text-center transition-all duration-700 ${
              techVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
            }`}>Integration & Technology</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { emoji: '🔗', title: 'Easy Integration', desc: 'Connect your store in minutes with our API or platform plugins' },
                { emoji: '📊', title: 'Real-Time Dashboard', desc: 'Monitor inventory levels and order status 24/7' },
                { emoji: '📱', title: 'Automated Updates', desc: 'Customers receive automatic tracking and delivery notifications' }
              ].map((item, idx) => (
                <div key={idx} className={`bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                  techVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
                }`} style={{ animationDelay: techVisible ? `${idx * 0.1}s` : '0s' }}>
                  <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform duration-300">{item.emoji}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-emerald-600 transition-colors">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" ref={ctaRef}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${
          ctaVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses who trust Stock2Door with their Australian fulfillment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
            >
              Get a Quote
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold text-lg border-2 border-emerald-600 transform hover:scale-105 hover:-translate-y-0.5"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
