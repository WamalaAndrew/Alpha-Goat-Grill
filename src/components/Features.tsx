import { motion } from 'motion/react';
import { Leaf, Flame, Utensils, Clock } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-primary" />,
      title: "Fresh Farm Goat",
      description: "Locally sourced healthy goat meat."
    },
    {
      icon: <Flame className="w-8 h-8 text-spice" />,
      title: "Traditional Spices",
      description: "Authentic African seasoning."
    },
    {
      icon: <Utensils className="w-8 h-8 text-charcoal" />,
      title: "Custom Grill",
      description: "Choose spicy, medium, or mild."
    },
    {
      icon: <Clock className="w-8 h-8 text-golden" />,
      title: "Fast Service",
      description: "Fresh grill served hot."
    }
  ];

  return (
    <section className="py-24 bg-cream relative" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-medium text-4xl md:text-5xl text-charcoal mb-4">
            WHAT MAKES<br />
            <span className="text-primary">OUR GOAT GRILL SPECIAL?</span>
          </h2>
          <p className="text-charcoal/70 max-w-2xl mx-auto font-medium">
            Where fresh ingredients meet authentic African flavors, and your perfect grill comes to life, one tasty bite at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left Features */}
          <div className="space-y-12">
            {features.slice(0, 2).map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center lg:items-end text-center lg:text-right"
              >
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-bold text-xl text-charcoal mb-2">{feature.title}</h3>
                <p className="text-charcoal/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Center Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-golden/20 rounded-full blur-3xl -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop" 
              alt="Juicy Grilled Goat Ribs" 
              className="w-full h-auto object-cover rounded-full aspect-square shadow-2xl border-8 border-white"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Right Features */}
          <div className="space-y-12">
            {features.slice(2, 4).map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-bold text-xl text-charcoal mb-2">{feature.title}</h3>
                <p className="text-charcoal/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
