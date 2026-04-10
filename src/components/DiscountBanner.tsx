import { motion } from 'motion/react';
import { Tag } from 'lucide-react';

export default function DiscountBanner() {
  return (
    <div className="bg-spice text-golden py-2.5 px-4 relative z-30 text-center mx-4 md:mx-8 rounded-t-2xl shadow-sm border-t-4 border-l-4 border-r-4 border-cream -mt-12 border-b border-cream/20">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-center justify-center gap-2 font-medium text-sm md:text-base"
      >
        <Tag size={18} className="shrink-0" />
        <span>
          <strong>Weekend Special:</strong> 20% off all platters!
        </span>
      </motion.div>
    </div>
  );
}
