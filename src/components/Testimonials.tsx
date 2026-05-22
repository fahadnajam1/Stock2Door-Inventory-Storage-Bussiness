import { Star, Quote } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Testimonials() {
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation({ threshold: 0.1 });

  const testimonials = [
    {
      name: 'Sana Ahmed',
      company: 'Pacific Home Goods',
      location: 'Pakistan',
      image: 'https://images.pexels.com/photos/774901/pexels-photo-774901.jpeg?auto=compress&cs=tinysrgb&w=200',
      text: 'Stock2Door transformed our Australian operations. We went from 2-week shipping times to 2-day delivery. Our customer satisfaction scores increased by 40% in just three months.',
      rating: 5,
    },
    {
      name: 'Kamal Hossain',
      company: 'TechGadgets AU',
      location: 'Bangladesh',
      image: 'https://images.pexels.com/photos/697508/pexels-photo-697508.jpeg?auto=compress&cs=tinysrgb&w=200',
      text: 'The integration was seamless and the team is incredibly responsive. Having local fulfillment has been a game-changer for competing with Australian retailers. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Saeed Al Hammadi',
      company: 'Beauty Essentials',
      location: 'UAE',
      image: 'https://images.pexels.com/photos/733871/pexels-photo-733871.jpeg?auto=compress&cs=tinysrgb&w=200',
      text: 'As an international seller, I was worried about the complexity of Australian fulfillment. Stock2Door made it incredibly simple. Their transparent pricing and excellent service have exceeded my expectations.',
      rating: 5,
    },
    {
      name: 'Fahad Al Harbi',
      company: 'FitLife Sports',
      location: 'Saudi Arabia',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
      text: 'We scaled from 50 orders to 100 orders per month without any hiccups. The Stock2Door team handled everything professionally. Their warehouse is top-notch and the reporting is excellent.',
      rating: 5,
    },
    {
      name: 'Bilal Ahmed',
      company: 'Organic Baby Co',
      location: 'Pakistan',
      image: 'https://images.pexels.com/photos/1681027/pexels-photo-1681027.jpeg?auto=compress&cs=tinysrgb&w=200',
      text: 'What impressed me most was the care they take with every package. Returns are handled efficiently, and the custom packaging options help our brand stand out. True partners in our success.',
      rating: 5,
    },
    {
      name: 'Kavita Joshi',
      company: 'Urban Fashion Hub',
      location: 'India',
      image: 'https://images.pexels.com/photos/1181693/pexels-photo-1181693.jpeg?auto=compress&cs=tinysrgb&w=200',
      text: "Stock2Door's pricing is transparent and competitive. No hidden fees, no surprises. The monthly reporting helps us optimize our inventory, and their advice has saved us thousands in storage costs.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gray-50" ref={testimonialsRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${
          testimonialsVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Growing Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our clients say about their experience with Stock2Door
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:scale-105 hover:-translate-y-1 ${
                testimonialsVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
              }`}
              style={{ animationDelay: testimonialsVisible ? `${(index % 3) * 0.1}s` : '0s' }}
            >
              <Quote className="text-emerald-200 mb-4 hover:text-emerald-300 transition-colors" size={32} />

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400 hover:scale-110 transition-transform duration-300" size={18} />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              <div className="flex items-center pt-4 border-t border-gray-100 group hover:translate-x-1 transition-transform duration-300">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 group-hover:scale-110 transition-transform duration-300"
                />
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.company}</div>
                  <div className="text-xs text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
