import { Package, Truck, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: howItWorksRef, isVisible: howItWorksVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.1 });

  const features = [
    {
      icon: Package,
      title: 'Secure Storage',
      description: 'State-of-the-art warehouse facilities across Australia',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Australia-wide coverage with rapid dispatch',
    },
    {
      icon: Shield,
      title: 'Reliable Service',
      description: 'Professional handling and 24/7 monitoring',
    },
    {
      icon: Zap,
      title: 'Quick Setup',
      description: 'Start fulfilling orders in days, not weeks',
    },
  ];

  const howItWorksSteps = [
    {
      number: '01',
      title: 'Ship to Us',
      description: 'Send your inventory to our Australian warehouse',
    },
    {
      number: '02',
      title: 'We Store',
      description: 'Your products are safely stored and tracked',
    },
    {
      number: '03',
      title: 'Orders Come In',
      description: 'We receive your customer orders automatically',
    },
    {
      number: '04',
      title: 'We Pack & Ship',
      description: 'Professional packing and fast dispatch across Australia',
    },
  ];

  return (
    <div className="pt-16">
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-6 animate-fadeInDown">
              <CheckCircle2 size={16} className="mr-2" />
              Your Trusted Partner in Australia
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fadeInUp">
              Store, Pack & Deliver Your Products Across{' '}
              <span className="text-emerald-600">Australia</span>
              <br />
              Without the Hassle
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              Global inventory storage meets Australian fulfillment excellence.
              We handle warehousing, professional packing, and fast delivery so you can focus on growing your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 duration-300"
              >
                Get a Quote
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className="bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all font-semibold text-lg border-2 border-emerald-600 hover:scale-105 duration-300"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-100/30 to-transparent -z-10 animate-float" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-gray-100/30 to-transparent -z-10 animate-float" style={{ animationDelay: '1s' }} />
      </section>

      <section className="py-16 bg-white" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`text-center group cursor-pointer transition-all duration-700 ${
                  featuresVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: featuresVisible ? `${index * 0.1}s` : '0s' }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4 group-hover:bg-emerald-600 transition-all transform group-hover:scale-110 duration-300">
                  <feature.icon className="text-emerald-600 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" ref={howItWorksRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-700 ${
            howItWorksVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, streamlined fulfillment in four easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div 
                key={index} 
                className={`relative transition-all duration-700 ${
                  howItWorksVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: howItWorksVisible ? `${index * 0.1}s` : '0s' }}
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                  <div className="text-5xl font-bold text-emerald-100 mb-4 group-hover:text-emerald-200 transition-colors">{step.number}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-emerald-600 transition-colors">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="text-emerald-300 animate-bounce2" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={`text-center mt-12 transition-all duration-700 ${
            howItWorksVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: howItWorksVisible ? '0.4s' : '0s' }}>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="text-emerald-600 font-semibold hover:text-emerald-700 inline-flex items-center group transition-all duration-300"
            >
              Learn More About Our Process
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet the Team Behind Stock2Door</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to delivering exceptional fulfillment services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                {/* Team Member 1 */}
                <div className="flex flex-col items-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-400">
                  <div className="w-56 h-56 rounded-full overflow-hidden ring-4 ring-emerald-50">
                    <img
                      src="/images/naveed.png"
                      alt="Business Partner"
                      className="w-full h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-gray-900">Muhammad Naveed</h3>
                  <p className="text-sm text-gray-600 mt-1">Leading vision and strategy for Stock2Door's success</p>
                  <div className="mt-4 flex space-x-3">
                    <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium">Founder</span>
                  </div>
                </div>

                {/* Team Member 2 */}
                <div className="flex flex-col items-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-400">
                  <div className="w-56 h-56 rounded-full overflow-hidden ring-4 ring-emerald-50">
                    <img
                      src="/images/naveedfrnd.png"
                      alt="Co-Founder & Operations"
                      className="w-full h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-gray-900">Sajawal Sajjad</h3>
                  <p className="text-sm text-gray-600 mt-1">Driving operational excellence and customer satisfaction</p>
                  <div className="mt-4 flex space-x-3">
                    <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium">Co-Founder</span>
                  </div>
                </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-emerald-600 text-white" ref={ctaRef}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${
          ctaVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Streamline Your Fulfillment?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses who trust Stock2Door with their Australian logistics
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 duration-300"
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
}
