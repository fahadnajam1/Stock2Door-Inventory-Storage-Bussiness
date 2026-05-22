import { AlertCircle } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface PricingProps {
  onNavigate: (page: string) => void;
}

export default function Pricing({ onNavigate }: PricingProps) {
  const { ref: warningRef, isVisible: warningVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: fbmRef, isVisible: fbmVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: fbaRef, isVisible: fbaVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: noteRef, isVisible: noteVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.1 });

  const fbmPricing = [
    { category: 'Prep Unit Small (Under 2LB)', price: '2.5 AUD' },
    { category: 'Prep Unit Large (Under 5LB)', price: '3 AUD' },
    { category: 'Bundle Small Units', price: '3 AUD' },
    { category: 'Bundle Large Units', price: '5 AUD' },
    { category: 'Small Box (22 × 16 × 7.7 cm)', price: '2.4 AUD' },
    { category: 'Large Box (40 × 20 × 18 cm)', price: '5 AUD' },
  ];

  const fbaPricing = [
    { category: 'Labeling Per Unit', price: '0.5 AUD' },
    { category: 'Box Label', price: '1 AUD' },
    { category: 'Delivery to Courier – Aramex', price: 'Contact for Quote' },
    { category: 'Delivery to Courier – Australia Post', price: '15 AUD' },
  ];

  return (
    <div className="pt-16 bg-white">
      {/* Important Notice Banner */}
      <section className="py-6 bg-yellow-50 border-b-4 border-yellow-400" ref={warningRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-start gap-4 transition-all duration-700 ${
            warningVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
          }`}>
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-bold text-yellow-900 mb-1">Important Notice</h3>
              <p className="text-yellow-800 text-base font-semibold">
                24 Hours Processing Time and Advance Payment Required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Page Header */}
      <section className="py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-6">Professional Fulfillment Pricing</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Transparent, competitive pricing for international eCommerce sellers. 
              No hidden fees—just clear, straightforward rates for our world-class fulfillment services.
            </p>
          </div>
        </div>
      </section>

      {/* FBM Pricing Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" ref={fbmRef}>
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-700 ${
            fbmVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2 text-center">
              Price For Customers (FBM)
            </h2>
            <p className="text-center text-gray-600 mb-10">Fulfillment by Merchant Pricing</p>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-100">
              <table className="w-full">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm md:text-base font-bold">Service Category</th>
                    <th className="px-6 py-4 text-right text-sm md:text-base font-bold">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fbmPricing.map((item, index) => (
                    <tr 
                      key={index} 
                      className={`hover:bg-emerald-50 transition-colors duration-300 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-800 font-medium text-sm md:text-base">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-emerald-600 font-bold text-right text-sm md:text-base">
                        {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FBA Pricing Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" ref={fbaRef}>
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-700 ${
            fbaVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2 text-center">
              Price For Customers (FBA)
            </h2>
            <p className="text-center text-gray-600 mb-10">Fulfillment by Amazon / Advanced Services Pricing</p>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-100">
              <table className="w-full">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm md:text-base font-bold">Service Category</th>
                    <th className="px-6 py-4 text-right text-sm md:text-base font-bold">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fbaPricing.map((item, index) => (
                    <tr 
                      key={index}
                      className={`hover:bg-emerald-50 transition-colors duration-300 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-800 font-medium text-sm md:text-base">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-emerald-600 font-bold text-right text-sm md:text-base">
                        {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Important Note */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white" ref={noteRef}>
        <div className="max-w-6xl mx-auto">
          <div className={`bg-emerald-50 rounded-lg p-6 md:p-8 border-l-4 border-emerald-600 transition-all duration-700 ${
            noteVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-gray-700 text-sm md:text-base font-semibold italic">
              💡 <strong>Note:</strong> Prices are subject to change based on volume and special handling requirements. 
              For large orders or custom arrangements, please contact us for a personalized quote.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white" ref={ctaRef}>
        <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
          ctaVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need a Custom Quote?</h2>
          <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto">
            Have special requirements or large volume orders? Our team is ready to provide you 
            with a tailored pricing solution that fits your business needs perfectly.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-white text-emerald-600  px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
          >
            Request Custom Quote
          </button>
        </div>
      </section>
    </div>
  );
}
