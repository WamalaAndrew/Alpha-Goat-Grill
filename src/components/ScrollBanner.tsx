import { motion } from 'motion/react';

export default function ScrollBanner() {
  const text = "FRESH GOAT MEAT • AUTHENTIC SPICES • SLOW GRILLED • AFRICAN FLAVORS • HOT & JUICY • ";
  
  return (
    <div className="bg-golden py-4 overflow-hidden flex whitespace-nowrap relative z-20 mx-4 md:mx-8 rounded-b-2xl shadow-lg border-b-4 border-l-4 border-r-4 border-cream">
      <motion.div
        className="flex font-heading font-bold text-charcoal text-xl md:text-2xl tracking-wider"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          repeat: Infinity, 
          ease: "linear", 
          duration: 20 
        }}
      >
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </motion.div>
    </div>
  );
}
