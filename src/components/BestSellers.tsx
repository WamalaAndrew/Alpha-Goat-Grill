import { useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export default function BestSellers() {
  const [addedItems, setAddedItems] = useState<{[key: number]: boolean}>({});

  const handleAddToCart = (index: number) => {
    setAddedItems(prev => ({ ...prev, [index]: true }));
    window.dispatchEvent(new CustomEvent('add-to-cart'));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [index]: false }));
    }, 2000);
  };

  const products = [
    {
      name: "Alpha Goat Roast",
      description: "Slow grilled goat ribs with authentic spices.",
      price: "65,000 UGX",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=600&auto=format&fit=crop",
      bgColor: "bg-golden",
      textColor: "text-charcoal"
    },
    {
      name: "Spicy Goat Bites",
      description: "Hot pepper goat chunks, perfectly seared.",
      price: "50,000 UGX",
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop",
      bgColor: "bg-spice",
      textColor: "text-cream"
    },
    {
      name: "Classic Goat Platter",
      description: "Goat meat served with traditional sides.",
      price: "80,000 UGX",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
      bgColor: "bg-primary",
      textColor: "text-cream"
    }
  ];

  return (
    <section className="py-24 bg-cream relative" id="menu">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-heading font-medium text-4xl md:text-5xl text-charcoal mb-4">
              BEST SELLERS
            </h2>
            <p className="text-charcoal/70 max-w-xl font-medium">
              The grill everyone raves about. Known for their rich taste, fresh ingredients, and crave-worthy spice combinations.
            </p>
          </div>
          <a href="#menu" className="hidden md:inline-block border-2 border-charcoal text-charcoal px-6 py-2 rounded-full font-bold hover:bg-charcoal hover:text-cream transition-colors">
            SHOP ALL
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`${product.bgColor} rounded-[2rem] p-6 flex flex-col items-center text-center relative group overflow-hidden`}
            >
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-b-[50%] -translate-y-1/2"></div>
              
              <div className="relative w-48 h-48 mb-6 mt-4 z-10">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded-full shadow-xl group-hover:scale-110 transition-transform duration-500 border-4 border-white/20"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex gap-1 mb-3 text-golden">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <h3 className={`font-heading font-medium text-2xl mb-2 ${product.textColor}`}>
                {product.name}
              </h3>
              
              <p className={`${product.textColor} opacity-90 text-sm mb-6 flex-grow`}>
                {product.description}
              </p>
              
              <div className={`font-heading font-medium text-xl mb-6 ${product.textColor}`}>
                {product.price}
              </div>

              <button 
                onClick={() => handleAddToCart(index)}
                className="w-full bg-white text-charcoal py-3 rounded-full font-bold hover:bg-cream hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                {addedItems[index] ? "ADDED ✓" : "ADD TO CART"}
              </button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <a href="#menu" className="inline-block border-2 border-charcoal text-charcoal px-8 py-3 rounded-full font-bold hover:bg-charcoal hover:text-cream transition-colors">
            SHOP ALL
          </a>
        </div>
      </div>
    </section>
  );
}
