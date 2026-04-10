import { motion } from 'motion/react';
import { Flame, Heart, Users, Award } from 'lucide-react';

export default function About() {
  const usps = [
    {
      icon: <Flame className="text-spice" size={24} />,
      title: "Authentic Spices",
      desc: "Marinated in our secret blend of traditional African herbs and spices."
    },
    {
      icon: <Award className="text-golden" size={24} />,
      title: "Premium Quality",
      desc: "We source only the finest, freshest, and most tender goat meat."
    },
    {
      icon: <Heart className="text-primary" size={24} />,
      title: "Slow-Cooked Passion",
      desc: "Grilled slowly over open charcoal to lock in the juices and flavor."
    },
    {
      icon: <Users className="text-charcoal" size={24} />,
      title: "Community First",
      desc: "A warm, welcoming atmosphere perfect for family and friends."
    }
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-cream/50 rounded-l-[100px] -z-10 transform translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" 
                alt="Chef grilling meat" 
                className="w-full h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-cream">
                <p className="font-heading font-bold text-3xl">Since 2020</p>
                <p className="font-medium opacity-90">Serving happiness daily.</p>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-6 -right-6 bg-golden text-charcoal p-6 rounded-full shadow-xl animate-spin-slow">
              <div className="font-heading font-bold text-center leading-tight">
                <span className="block text-2xl">100%</span>
                <span className="block text-sm">ORGANIC</span>
              </div>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="mb-6">
              <span className="text-spice font-bold tracking-wider uppercase text-sm mb-2 block">Our Story</span>
              <h2 className="font-heading font-medium text-4xl md:text-5xl text-charcoal mb-6 leading-tight">
                MORE THAN JUST A MEAL, IT'S AN <span className="text-golden">EXPERIENCE.</span>
              </h2>
            </div>
            
            <p className="text-charcoal/70 mb-6 text-lg leading-relaxed">
              Born from a love of authentic African barbecue, Alpha Goat Grill started with a simple mission: to bring people together over the perfect cut of meat. We believe that great food takes time, patience, and a lot of love.
            </p>
            <p className="text-charcoal/70 mb-10 text-lg leading-relaxed">
              Every day, our chefs fire up the charcoal grills, marinate our locally-sourced goat meat in a secret blend of spices, and slow-roast it to tender, juicy perfection. Whether you're here for a quick bite or a family feast, you're part of the Alpha family.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {usps.map((usp, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="bg-cream p-3 rounded-xl shrink-0">
                    {usp.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal mb-1">{usp.title}</h4>
                    <p className="text-sm text-charcoal/60 leading-relaxed">{usp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
