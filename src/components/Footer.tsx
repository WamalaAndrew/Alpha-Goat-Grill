import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        await addDoc(collection(db, 'newsletter_subscriptions'), {
          email,
          status: 'pending',
          createdAt: serverTimestamp()
        });
        
        // Simulate sending a confirmation email
        console.log(`Simulated: Confirmation email sent to ${email}`);
        
        setSubscribed(true);
        setIsPending(true);
        setTimeout(() => {
          setSubscribed(false);
          setIsPending(false);
          setEmail('');
        }, 5000);
      } catch (error) {
        console.error("Failed to subscribe");
        handleFirestoreError(error, OperationType.CREATE, 'newsletter_subscriptions');
      }
    }
  };

  return (
    <footer className="bg-primary pt-24 pb-12 text-cream relative curve-top mt-12">
      
      {/* Opening Hours Section - Overlapping */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl bg-golden text-charcoal rounded-[2rem] p-8 md:p-12 shadow-2xl border-4 border-cream text-center">
        <h3 className="font-heading font-medium text-2xl md:text-3xl mb-6">OPENING HOURS</h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          <div>
            <div className="font-bold text-lg opacity-80 mb-1">MON TO FRI:</div>
            <div className="font-heading font-medium text-3xl md:text-4xl">8<span className="text-xl">AM</span> - 10<span className="text-xl">PM</span></div>
          </div>
          <div className="hidden md:block w-px h-16 bg-charcoal/20"></div>
          <div>
            <div className="font-bold text-lg opacity-80 mb-1">SAT TO SUN:</div>
            <div className="font-heading font-medium text-3xl md:text-4xl">8<span className="text-xl">AM</span> - 12<span className="text-xl">AM</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Location */}
          <div>
            <h4 className="font-heading font-bold text-xl mb-6 text-golden">LOCATION</h4>
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="text-golden shrink-0 mt-1" size={20} />
              <p className="opacity-80">
                123 Alpha Street, Downtown<br />
                Food District, Kampala
              </p>
            </div>
            <a href="https://maps.google.com/?q=Alpha+Goat+Grill+Kampala" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-bold border-b border-golden text-golden hover:text-cream hover:border-cream transition-colors">
              GET DIRECTIONS
            </a>
          </div>

          {/* About */}
          <div>
            <h4 className="font-heading font-bold text-xl mb-6 text-golden">ABOUT US</h4>
            <p className="opacity-80 mb-6 leading-relaxed">
              Alpha Goat Grill serves fresh, juicy goat meat with authentic African flavors and premium ingredients. Every bite is crafted to bring you happiness and unforgettable taste.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-golden hover:text-charcoal transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-golden hover:text-charcoal transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-golden hover:text-charcoal transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-xl mb-6 text-golden">CONTACT US</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="text-golden shrink-0" size={20} />
                <a href="tel:0758230915" className="opacity-80 hover:text-golden transition-colors">0758230915</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-golden shrink-0" size={20} />
                <a href="mailto:hello@alphagoat.com" className="opacity-80 hover:text-golden transition-colors">hello@alphagoat.com</a>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-sm opacity-80 mb-3">Join our newsletter for promotions!</p>
              {isPending ? (
                <div className="bg-golden/20 border border-golden text-golden rounded-xl p-4 text-sm font-medium">
                  <p className="font-bold mb-1">Check your inbox!</p>
                  <p className="opacity-90">We've sent a confirmation link to {email}. Please click it to verify your subscription.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="bg-cream/10 border border-cream/20 rounded-l-full px-4 py-2 w-full focus:outline-none focus:border-golden text-cream placeholder-cream/50"
                  />
                  <button 
                    type="submit"
                    className="bg-golden text-charcoal px-4 py-2 rounded-r-full font-bold hover:bg-golden/90 transition-colors"
                  >
                    {subscribed ? "DONE ✓" : "SUBMIT"}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        <div className="border-t border-cream/20 pt-8 text-center text-sm opacity-60">
          <p>&copy; {new Date().getFullYear()} Alpha Goat Grill. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
