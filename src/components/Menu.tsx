import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export default function Menu() {
  const [openCategory, setOpenCategory] = useState<string | null>('Goat Grill');
  const [addedItems, setAddedItems] = useState<{[key: string]: boolean}>({});

  const handleAdd = (id: string) => {
    setAddedItems(prev => ({ ...prev, [id]: true }));
    window.dispatchEvent(new CustomEvent('add-to-cart'));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const categories = [
    {
      name: 'Goat Grill',
      items: [
        { name: 'Goat Rib Grill', price: '65,000 UGX', desc: 'Slow-cooked ribs with signature rub', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=200&auto=format&fit=crop' },
        { name: 'Spicy Goat Bites', price: '50,000 UGX', desc: 'Bite-sized chunks tossed in hot pepper sauce', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=200&auto=format&fit=crop' },
        { name: 'Charcoal Goat Steak', price: '75,000 UGX', desc: 'Premium cut, charcoal grilled to perfection', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=200&auto=format&fit=crop' },
      ]
    },
    {
      name: 'Special Platters',
      items: [
        { name: 'Goat BBQ Platter', price: '85,000 UGX', desc: 'Assorted cuts with plantain and kachumbari', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=200&auto=format&fit=crop' },
        { name: 'Family Feast', price: '150,000 UGX', desc: 'Large platter for 4-5 people with all sides', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=200&auto=format&fit=crop' },
      ]
    },
    {
      name: 'Sides',
      items: [
        { name: 'Roasted Plantain (Gonja)', price: '10,000 UGX', desc: 'Sweet and perfectly roasted', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=200&auto=format&fit=crop' },
        { name: 'Kachumbari Salad', price: '8,000 UGX', desc: 'Fresh tomato and onion salad', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop' },
        { name: 'Cassava Wedges', price: '12,000 UGX', desc: 'Crispy fried cassava', img: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=200&auto=format&fit=crop' },
      ]
    },
    {
      name: 'Drinks',
      items: [
        { name: 'Fresh Passion Juice', price: '10,000 UGX', desc: 'Freshly squeezed', img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=200&auto=format&fit=crop' },
        { name: 'Local Beers', price: '8,000 UGX', desc: 'Cold refreshing local beers', img: 'https://images.unsplash.com/photo-1614316311855-46b38c208c5d?q=80&w=200&auto=format&fit=crop' },
      ]
    }
  ];

  return (
    <section className="py-24 bg-cream relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-medium text-4xl md:text-5xl text-charcoal mb-4">
            DISCOVER OUR MENUS
          </h2>
          <p className="text-charcoal/70 font-medium">
            A complete menu of bold flavors, tender meat, tasty sides, and refreshing drinks for any time of day.
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name} className="border-2 border-charcoal/10 rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                className={`w-full flex justify-between items-center p-6 transition-colors ${
                  openCategory === category.name ? 'bg-golden text-charcoal' : 'hover:bg-cream'
                }`}
              >
                <span className="font-heading font-medium text-xl">{category.name}</span>
                <ChevronDown 
                  className={`transition-transform duration-300 ${openCategory === category.name ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openCategory === category.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 space-y-6 bg-white">
                      {category.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 rounded-xl hover:bg-cream/50 transition-colors border border-transparent hover:border-charcoal/5">
                          <img 
                            src={item.img} 
                            alt={item.name} 
                            className="w-20 h-20 object-cover rounded-lg shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-heading font-medium text-lg text-charcoal">{item.name}</h4>
                              <span className="font-bold text-primary whitespace-nowrap ml-4">{item.price}</span>
                            </div>
                            <p className="text-charcoal/60 text-sm">{item.desc}</p>
                          </div>
                          <button 
                            onClick={() => handleAdd(category.name + idx)}
                            className="sm:ml-4 w-full sm:w-auto bg-cream text-charcoal px-4 py-2 rounded-full font-bold text-sm hover:bg-golden hover:scale-105 active:scale-95 transition-all"
                          >
                            {addedItems[category.name + idx] ? "ADDED ✓" : "ADD"}
                          </button>
                        </div>
                      ))}
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
