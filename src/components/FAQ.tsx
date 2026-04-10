import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Where do you source your goat meat?",
      answer: "We source our goat meat daily from local, organic farms in Uganda. We ensure that all our meat is fresh, never frozen, and ethically raised to provide the best quality and taste."
    },
    {
      question: "How does delivery work?",
      answer: "We offer delivery within a 15km radius of our restaurant. Once you place an order, you can track it in real-time. Delivery usually takes 30-45 minutes depending on traffic and your exact location."
    },
    {
      question: "Can I place a large order for an event?",
      answer: "Absolutely! For large events or catering, please contact us directly via phone or email at least 24 hours in advance so we can prepare the perfect feast for your guests."
    },
    {
      question: "How do I earn loyalty points?",
      answer: "If you create an account and sign in before placing an order, you automatically earn 100 points for every item in your cart! You can redeem these points for free drinks, sides, or even full platters."
    },
    {
      question: "Do you offer vegetarian options?",
      answer: "While our specialty is goat grill, we offer delicious vegetarian sides like Roasted Plantain (Gonja), Kachumbari Salad, and Crispy Cassava Wedges."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-cream relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-golden/20 text-golden rounded-full mb-4">
            <HelpCircle size={32} />
          </div>
          <h2 className="font-heading font-medium text-4xl md:text-5xl text-charcoal mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-charcoal/70 font-medium">
            Got questions? We've got answers. Here's everything you need to know about Alpha Goat Grill.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border-2 rounded-2xl overflow-hidden transition-colors ${
                openIndex === index ? 'border-golden bg-white' : 'border-charcoal/10 bg-white hover:border-charcoal/20'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className="font-bold text-lg text-charcoal pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`shrink-0 text-golden transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-charcoal/70 leading-relaxed border-t border-charcoal/5 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
