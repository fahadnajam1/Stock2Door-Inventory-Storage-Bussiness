import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface FAQProps {
  onNavigate: (page: string) => void;
}

export default function FAQ({ onNavigate }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.1 });

  const faqs = [
    {
      question: 'Who can use Stock2Door?',
      answer: "Stock2Door is perfect for international eCommerce sellers, Australian businesses needing fulfillment infrastructure, Amazon FBA sellers, Shopify store owners, and any business shipping products to Australian customers. Whether you're selling 10 orders a month or 10,000, we can help.",
    },
    {
      question: 'Do you ship internationally?',
      answer: 'We specialize in Australian fulfillment and delivery. Our primary focus is fast, reliable shipping across Australia. If you need to ship internationally from Australia, we can arrange this on a case-by-case basis. Contact us to discuss your specific requirements.',
    },
    {
      question: 'Is there a minimum volume requirement?',
      answer: 'No! We work with businesses of all sizes. Our Starter plan accommodates up to 500 orders per month, perfect for small businesses. As your volume grows, you can upgrade to our Growth or Enterprise plans for better rates and additional features.',
    },
    {
      question: 'How fast is delivery within Australia?',
      answer: 'For orders processed before 2 PM, we dispatch the same day. Standard delivery across Australia typically takes 2-5 business days depending on the destination. Express delivery options are available for faster shipping. Metro areas like Sydney, Melbourne, and Brisbane usually receive orders within 2-3 days.',
    },
    {
      question: 'Are there long-term contracts?',
      answer: 'No long-term contracts required. We operate on a month-to-month basis. You can cancel anytime with 30 days notice. We believe in earning your business every month through excellent service, not locking you into lengthy contracts.',
    },
    {
      question: 'What eCommerce platforms do you integrate with?',
      answer: 'We integrate with all major platforms including Shopify, WooCommerce, Amazon, eBay, BigCommerce, Magento, and more. We also offer API access for custom integrations. Our team can help you set up the integration during onboarding.',
    },
    {
      question: 'How do I track my inventory?',
      answer: "You'll have 24/7 access to our online portal where you can view real-time inventory levels, order status, and fulfillment history. We also send automated notifications for low stock, completed shipments, and any issues that need attention.",
    },
    {
      question: 'What happens if a product is damaged?',
      answer: 'We handle all products with care and conduct quality checks. In the rare case of damage during our handling, we accept full responsibility. We recommend having insurance coverage for high-value items. We can help arrange this if needed.',
    },
    {
      question: 'Can you handle returns?',
      answer: 'Yes! Our returns management service includes receiving returned items, quality inspection, restocking (if suitable), and updating your inventory. Returns processing costs $2 per item. We can also dispose of damaged items or send them back to you.',
    },
    {
      question: 'What types of products can you handle?',
      answer: "We can handle most consumer products including clothing, electronics, cosmetics, books, home goods, and more. We cannot store hazardous materials, perishable items, or prohibited goods. If you're unsure about your products, contact us and we'll let you know.",
    },
    {
      question: 'How do I get started?',
      answer: "Simply contact us for a quote. We'll discuss your needs, set up your account, and provide shipping instructions for your first inventory shipment. Once your products arrive, we'll catalog them and you can start fulfilling orders immediately. The whole process typically takes 1-2 weeks.",
    },
    {
      question: 'What are the storage fees?',
      answer: 'Storage is charged per cubic meter per week, starting from $15. Your monthly plan includes a set amount of storage space. Additional storage is charged at our standard rates. We conduct monthly inventory reviews to help you optimize storage costs.',
    },
    {
      question: 'Can I visit the warehouse?',
      answer: 'Yes! We welcome clients to visit our facilities. Warehouse tours can be arranged by appointment. This gives you peace of mind to see where your products are stored and how we operate. Contact us to schedule a visit.',
    },
    {
      question: 'Do you offer custom packaging or branding?',
      answer: 'Absolutely! We can include branded inserts, custom packaging, thank you cards, promotional materials, and more. Custom packaging options are available on our Growth and Enterprise plans. This helps create a memorable unboxing experience for your customers.',
    },
  ];

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Everything you need to know about Stock2Door and our fulfillment services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20" ref={faqRef}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                  faqVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: faqVisible ? `${Math.min(index * 0.05, 0.3)}s` : '0s' }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-emerald-50 transition-colors duration-300 group"
                >
                  <span className="font-semibold text-gray-900 pr-4 group-hover:text-emerald-600 transition-colors">{faq.question}</span>
                  {openIndex === index ? (
                    <Minus className="text-emerald-600 flex-shrink-0 transform rotate-0 transition-transform" size={20} />
                  ) : (
                    <Plus className="text-gray-400 flex-shrink-0 group-hover:text-emerald-600 transition-colors" size={20} />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-fadeInDown border-t border-gray-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" ref={ctaRef}>
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${
          ctaVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our team is here to help. Get in touch and we'll answer any questions you have.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}
