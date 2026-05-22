import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation({ threshold: 0.1 });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company || null,
            message: formData.message,
          },
        ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or email us directly.');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Let's Move Your Stock Faster</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Ready to streamline your Australian fulfillment? Get in touch and we'll create a custom solution for your business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20" ref={formRef}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className={`transition-all duration-700 ${
              formVisible ? 'animate-fadeInLeft' : 'opacity-0 -translate-x-8'
            }`}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Fill out the form and our team will get back to you within 24 hours.
                We'll discuss your needs and provide a custom quote.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Mail, title: 'Email Us', content: <a href="mailto:stock2door.au@gmail.com" className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">stock2door.au@gmail.com</a> },
                  { icon: Phone, title: 'Phone', content: <a href="tel:+61485504901" className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">+61 485 504 901</a> },
                  { icon: MapPin, title: 'Warehouse Location', content: <p className="text-gray-600">Melbourne, Sydney, New Castle, Australia</p> }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className={`flex items-start space-x-4 group hover:translate-x-1 transition-transform duration-300 ${
                      formVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-4'
                    }`} style={{ animationDelay: formVisible ? `${idx * 0.1}s` : '0s' }}>
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                        <Icon className="text-emerald-600 group-hover:text-white transition-colors" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        {item.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`mt-12 bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100 hover:shadow-lg transition-all duration-300 ${
                formVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: formVisible ? '0.2s' : '0s' }}>
                <h3 className="font-semibold text-gray-900 mb-4">What Happens Next?</h3>
                <ul className="space-y-3">
                  {[
                    'We review your requirements and business needs',
                    'Our team prepares a custom quote based on your volume',
                    'We schedule a call to discuss the details',
                    'You start fulfilling orders in as little as 1-2 weeks'
                  ].map((step, idx) => (
                    <li key={idx} className="flex items-start group/step hover:translate-x-1 transition-transform duration-300">
                      <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5 flex-shrink-0 group-hover/step:scale-110 transition-transform duration-300">
                        {idx + 1}
                      </div>
                      <span className="text-gray-600 group-hover/step:text-gray-900 transition-colors">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transition-all duration-700 ${
              formVisible ? 'animate-fadeInRight' : 'opacity-0 translate-x-8'
            } hover:shadow-xl`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-emerald-300"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-emerald-300"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-900 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-emerald-300"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 resize-none hover:border-emerald-300"
                    placeholder="Tell us about your business and fulfillment needs..."
                  />
                </div>

                {status === 'success' && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-800 animate-fadeInUp">
                    Thank you! We've received your message and will get back to you within 24 hours.
                  </div>
                )}

                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 animate-fadeInUp">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-emerald-600 text-white px-6 py-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {status === 'submitting' ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="mr-2" size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
