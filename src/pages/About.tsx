import { Target, Users, Globe, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function About() {
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: whyRef, isVisible: whyVisible } = useScrollAnimation({ threshold: 0.1 });

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To simplify cross-border logistics and make Australian fulfillment accessible to businesses worldwide.',
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: "We treat every package like it's our own, ensuring your customers receive the best experience.",
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Supporting international eCommerce brands with local Australian expertise and infrastructure.',
    },
    {
      icon: TrendingUp,
      title: 'Growth Partners',
      description: 'We scale with your business, from your first order to thousands of daily shipments.',
    },
  ];

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Stock2Door</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're revolutionizing how international businesses fulfill orders in Australia.
              By combining secure warehousing, professional fulfillment services, and nationwide delivery,
              we make it easy for global brands to serve Australian customers with local speed and reliability.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="animate-fadeInLeft">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                Stock2Door provides end-to-end inventory storage and fulfillment services for eCommerce businesses.
                We store your products in our secure Australian warehouses, handle professional packing when orders come in,
                and ensure fast delivery to customers across Australia.
              </p>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                Whether you're an international seller looking to reduce shipping times, or an Australian business
                needing reliable fulfillment infrastructure, we've got you covered.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our technology integrates seamlessly with your existing systems, while our experienced team
                handles all the physical logistics. You focus on sales and marketing, we handle everything else.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl p-12 text-center animate-fadeInRight transform hover:scale-105 transition-all duration-300">
              <div className="space-y-8">
                <div className="group hover:scale-110 transition-all duration-300">
                  <div className="text-5xl font-bold text-emerald-600 mb-2 group-hover:text-emerald-700">500+</div>
                  <div className="text-gray-700 font-medium">Active Clients</div>
                </div>
                <div className="group hover:scale-110 transition-all duration-300">
                  <div className="text-5xl font-bold text-emerald-600 mb-2 group-hover:text-emerald-700">1M+</div>
                  <div className="text-gray-700 font-medium">Orders Fulfilled</div>
                </div>
                <div className="group hover:scale-110 transition-all duration-300">
                  <div className="text-5xl font-bold text-emerald-600 mb-2 group-hover:text-emerald-700">99.8%</div>
                  <div className="text-gray-700 font-medium">On-Time Delivery</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" ref={valuesRef}>
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:scale-105 hover:-translate-y-1 ${
                  valuesVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: valuesVisible ? `${index * 0.1}s` : '0s' }}
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group hover:bg-emerald-600 transition-all duration-300 transform hover:scale-125">
                  <value.icon className="text-emerald-600 group-hover:text-white transition-colors" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-emerald-600 transition-colors">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" ref={whyRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className={`text-3xl font-bold text-gray-900 mb-6 text-center transition-all duration-700 ${
              whyVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
            }`}>Why Australia-Based Fulfillment Matters</h2>
            <div className="space-y-6 text-lg text-gray-600">
              {[
                {
                  title: 'Faster Delivery Times',
                  desc: 'Australian customers receive their orders in days, not weeks. Local fulfillment means happier customers and fewer abandoned carts.'
                },
                {
                  title: 'Reduced Shipping Costs',
                  desc: 'Eliminate expensive international shipping fees. Domestic delivery is more affordable and predictable for both you and your customers.'
                },
                {
                  title: 'Better Customer Experience',
                  desc: 'No customs delays, no surprise fees, and easy returns. Deliver the seamless experience Australian shoppers expect.'
                },
                {
                  title: 'Competitive Advantage',
                  desc: 'Stand out from international competitors who ship from overseas. Australian fulfillment gives you a local edge.'
                }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-xl p-6 shadow-sm border-l-4 border-emerald-600 hover:shadow-lg transition-all duration-300 transform hover:translate-x-1 hover:-translate-y-1 ${
                    whyVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ animationDelay: whyVisible ? `${idx * 0.1 + 0.1}s` : '0s' }}
                >
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-emerald-600 transition-colors">{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
