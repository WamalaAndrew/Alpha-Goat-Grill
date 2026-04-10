import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      text: "The best goat meat I have ever tasted. Perfect spices and juicy grill. Highly recommend the Alpha Goat Roast!",
      author: "David K.",
      rating: 5
    },
    {
      text: "I love how fresh everything tastes! The flavors are amazing, and the meat is always tender and satisfying.",
      author: "Sarah M.",
      rating: 5
    },
    {
      text: "Alpha Goat Grill is my go-to spot for weekend cravings. The spicy goat bites are absolutely addictive.",
      author: "Michael T.",
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-primary text-cream relative curve-top curve-bottom" id="reviews">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading font-medium text-4xl md:text-5xl mb-4">
            CUSTOMER REVIEWS
          </h2>
          <p className="text-cream/80 max-w-2xl mx-auto font-medium">
            See why customers keep rating us five stars for taste, freshness, and premium quality flavor in every bite.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden relative min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-cream text-charcoal p-8 md:p-12 rounded-3xl shadow-2xl text-center w-full max-w-2xl relative"
              >
                <Quote className="absolute top-6 left-6 text-golden/30 w-12 h-12" />
                
                <div className="flex justify-center gap-1 mb-6 text-golden">
                  {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={24} fill="currentColor" />
                  ))}
                </div>
                
                <p className="font-heading font-normal italic text-xl md:text-2xl mb-8 leading-relaxed">
                  "{reviews[currentIndex].text}"
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-cream font-bold text-xl">
                    {reviews[currentIndex].author.charAt(0)}
                  </div>
                  <span className="font-bold">{reviews[currentIndex].author}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={prev}
              className="w-12 h-12 rounded-full border-2 border-cream/30 flex items-center justify-center text-cream hover:bg-cream hover:text-primary transition-colors"
            >
              <ChevronLeft />
            </button>
            <button 
              onClick={next}
              className="w-12 h-12 rounded-full border-2 border-cream/30 flex items-center justify-center text-cream hover:bg-cream hover:text-primary transition-colors"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
