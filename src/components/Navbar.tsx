import { useState, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, User, Clock, Award } from 'lucide-react';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import AuthModal from './AuthModal';
import OrderHistoryModal from './OrderHistoryModal';
import RewardsModal from './RewardsModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    if (user) {
      await signOut(auth);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="font-heading font-normal text-2xl tracking-widest text-cream uppercase">
              ALPHA GOAT<span className="text-golden">.</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-cream/90 hover:text-golden font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center gap-4 pl-4 border-l border-cream/20">
              {user && (
                <>
                  <button 
                    onClick={() => setIsRewardsOpen(true)}
                    className="flex items-center gap-2 text-golden hover:text-golden/80 font-medium transition-colors"
                    title="Rewards"
                  >
                    <Award size={20} />
                    <span className="hidden lg:inline">Rewards</span>
                  </button>
                  <button 
                    onClick={() => setIsOrderHistoryOpen(true)}
                    className="flex items-center gap-2 text-cream hover:text-golden font-medium transition-colors mr-2"
                    title="Order History"
                  >
                    <Clock size={20} />
                    <span className="hidden lg:inline">Orders</span>
                  </button>
                </>
              )}
              <button 
                onClick={handleAuth}
                className="flex items-center gap-2 text-cream hover:text-golden font-medium transition-colors"
              >
                {user ? (
                  <>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-golden" />
                    ) : (
                      <div className="w-8 h-8 rounded-full border border-golden bg-golden/20 flex items-center justify-center">
                        <User size={16} className="text-golden" />
                      </div>
                    )}
                    <span className="hidden lg:inline">{user.displayName?.split(' ')[0] || user.email?.split('@')[0]}</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
              <a href="#menu" className="bg-golden text-charcoal px-6 py-2.5 rounded-full font-bold hover:bg-golden/90 hover:scale-105 transition-all shadow-md inline-block">
                Order Now
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-cream hover:text-golden focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary absolute top-full left-0 w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-3 text-cream hover:text-golden hover:bg-primary/80 font-medium rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 space-y-3 border-t border-cream/20 mt-2">
              {user && (
                <>
                  <button 
                    onClick={() => { setIsRewardsOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 text-golden border border-golden/30 px-6 py-3 rounded-full font-bold hover:bg-golden/10 transition-colors"
                  >
                    <Award size={20} />
                    <span>Rewards</span>
                  </button>
                  <button 
                    onClick={() => { setIsOrderHistoryOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 text-cream border border-cream/30 px-6 py-3 rounded-full font-bold hover:bg-cream/10 transition-colors"
                  >
                    <Clock size={20} />
                    <span>Order History</span>
                  </button>
                </>
              )}
              <button 
                onClick={() => { handleAuth(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 text-cream border border-cream/30 px-6 py-3 rounded-full font-bold hover:bg-cream/10 transition-colors"
              >
                {user ? (
                  <>
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Sign In / Sign Up</span>
                  </>
                )}
              </button>
              <a href="#menu" onClick={() => setIsMobileMenuOpen(false)} className="w-full block text-center bg-golden text-charcoal px-6 py-3 rounded-full font-bold hover:bg-golden/90 transition-colors">
                Order Now
              </a>
            </div>
          </div>
        </div>
      )}
      {/* Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <OrderHistoryModal isOpen={isOrderHistoryOpen} onClose={() => setIsOrderHistoryOpen(false)} />
      <RewardsModal isOpen={isRewardsOpen} onClose={() => setIsRewardsOpen(false)} />
    </nav>
  );
}
