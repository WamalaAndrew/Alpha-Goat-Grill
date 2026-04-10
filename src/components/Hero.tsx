import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Parallax effect: moves the image down slightly as the user scrolls down
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section ref={ref} id="home" className="relative bg-primary pt-32 pb-20 md:pt-40 md:pb-32 curve-bottom overflow-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-medium text-5xl md:text-7xl lg:text-8xl text-cream leading-tight tracking-normal mb-6"
          >
            DELICIOUS<br />
            <span className="text-golden">GOAT GRILL</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium"
          >
            Freshly grilled goat meat with authentic African spices. Slow-cooked to perfection for that hot, juicy, and irresistible flavor.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ y }}
            className="relative w-full max-w-3xl mx-auto"
          >
            {/* Decorative circle behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-cream/10 rounded-full blur-3xl -z-10"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" 
              alt="Delicious Grilled Goat Meat" 
              className="w-full h-auto object-cover rounded-3xl shadow-2xl border-4 border-cream/10"
              referrerPolicy="no-referrer"
            />
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-golden text-charcoal p-4 rounded-full shadow-xl rotate-12 animate-bounce">
              <div className="font-heading font-bold text-center leading-tight">
                <span className="block text-sm">100%</span>
                <span className="block text-xl">FRESH</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
