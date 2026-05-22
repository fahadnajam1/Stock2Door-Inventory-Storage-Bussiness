import { MapPin, Clock, DollarSign, Shield, Award, Users, TrendingUp, Zap } from 'lucide-react';

interface WhyChooseProps {
  onNavigate: (page: string) => void;
}

export default function WhyChoose({ onNavigate }: WhyChooseProps) {
  const reasons = [
    {
      icon: MapPin,
      title: 'Australia-Wide Delivery Coverage',
      description: 'Complete coverage across all Australian states and territories. From Sydney to Perth, Brisbane to Hobart, we deliver everywhere.',
      stats: '99.8% on-time delivery rate',
    },
    {
      icon: Clock,
      title: 'Faster Shipping for Australian Customers',
      description: 'Local fulfillment means your customers receive orders in days, not weeks. Same-day dispatch for orders placed before 2 PM.',
      stats: '2-3 day delivery to major cities',
    },
    {
      icon: DollarSign,
      title: 'Reduced International Shipping Costs',
      description: 'Eliminate expensive international shipping fees. Domestic delivery is more affordable and predictable for you and your customers.',
      stats: 'Up to 70% cost savings vs international shipping',
    },
    {
      icon: Shield,
      title: 'Secure and Monitored Warehouses',
      description: 'State-of-the-art facilities with 24/7 security monitoring, climate control, and fire suppression systems. Your inventory is in safe hands.',
      stats: 'Zero security incidents since inception',
    },
    {
      icon: Award,
      title: 'Professional Handling and Packaging',
      description: 'Every order is picked, packed, and quality-checked by trained professionals. Custom packaging and branding options available.',
      stats: '99.9% order accuracy rate',
    },
    {
      icon: Users,
      title: 'Dedicated Support Team',
      description: 'Real people ready to help. No automated responses, no ticket systems that go nowhere. Get answers when you need them.',
      stats: 'Average response time: 2 hours',
    },
    {
      icon: TrendingUp,
      title: 'Scalable Infrastructure',
      description: 'From startup to enterprise, our systems grow with your business. Handle peak seasons without breaking a sweat.',
      stats: 'Supporting businesses from 10 to 10,000+ daily orders',
    },
    {
      icon: Zap,
      title: 'Quick Setup and Integration',
      description: 'Start fulfilling orders in as little as 1-2 weeks. Seamless integration with all major eCommerce platforms.',
      stats: 'Average onboarding time: 7 days',
    },
  ];

  const competitiveAdvantages = [
    {
      title: 'No Long-Term Contracts',
      description: 'Month-to-month flexibility. We earn your business every day through excellent service.',
    },
    {
      title: 'Transparent Pricing',
      description: "No hidden fees, no surprise charges. You know exactly what you're paying for.",
    },
    {
      title: 'Real-Time Visibility',
      description: '24/7 access to inventory levels, order status, and analytics dashboard.',
    },
    {
      title: 'Technology Integration',
      description: 'API access and plugins for all major platforms. Your systems, our infrastructure.',
    },
    {
      title: 'Returns Management',
      description: "Streamlined returns processing. We handle the hassle so you don't have to.",
    },
    {
      title: 'Custom Solutions',
      description: 'Every business is unique. We tailor our services to meet your specific needs.',
    },
  ];

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Stock2Door?
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're not just a warehouse. We're your Australian fulfillment partner,
              committed to helping your business succeed in the Australian market.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100 group"
              >
                <div className="flex items-start mb-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-emerald-600 transition-colors flex-shrink-0">
                    <reason.icon className="text-emerald-600 group-hover:text-white transition-colors" size={28} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{reason.description}</p>
                <div className="bg-emerald-50 rounded-lg px-4 py-2 inline-block">
                  <span className="text-emerald-700 font-semibold text-sm">{reason.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Competitive Advantages</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              What sets us apart from other fulfillment providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitiveAdvantages.map((advantage, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-12 md:p-16 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Stock2Door Difference
              </h2>
              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                We're obsessed with making fulfillment simple, reliable, and affordable.
                When you succeed, we succeed. That's why we go above and beyond to ensure
                every order is perfect, every time.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-emerald-200">Happy Clients</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">1M+</div>
                  <div className="text-emerald-200">Orders Fulfilled</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">99.8%</div>
                  <div className="text-emerald-200">Customer Satisfaction</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg"
              >
                Start Your Success Story
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Perfect for Your Business
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">International Sellers</h3>
              <p className="text-gray-600 mb-4">
                Expand into the Australian market without the complexity of local logistics.
                We handle everything from customs to customer doorsteps.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                  Eliminate international shipping delays
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                  Compete with local Australian retailers
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                  No need for local entity or office
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Australian Businesses</h3>
              <p className="text-gray-600 mb-4">
                Focus on your core business while we handle the logistics. Perfect for
                businesses that don't want to manage inventory and shipping.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                  No warehouse lease commitments
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                  Scale up or down as needed
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                  Professional fulfillment infrastructure
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
