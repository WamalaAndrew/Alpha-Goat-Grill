import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

export default function FloatingCart() {
  const [count, setCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const handleAddToCart = () => {
      setCount(c => c + 1);
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 300);
    };
    
    const handleClearCart = () => {
      setCount(0);
    };
    
    window.addEventListener('add-to-cart', handleAddToCart);
    window.addEventListener('clear-cart', handleClearCart);
    return () => {
      window.removeEventListener('add-to-cart', handleAddToCart);
      window.removeEventListener('clear-cart', handleClearCart);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button 
              className={`bg-charcoal text-golden p-4 rounded-full shadow-2xl flex items-center justify-center relative transition-transform ${isBouncing ? 'scale-110' : 'hover:scale-105 active:scale-95'}`}
              onClick={() => setIsCheckoutOpen(true)}
            >
              <ShoppingCart size={28} />
              <span className="absolute -top-2 -right-2 bg-spice text-cream text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full border-2 border-cream shadow-sm">
                {count}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        itemCount={count}
      />
    </>
  );
}
