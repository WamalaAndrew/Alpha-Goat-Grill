import React, { useState } from 'react';
import { motion } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Reservation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', guests: '', date: '', time: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic client-side validation
    if (formData.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number (at least 10 digits).');
      return;
    }

    // Log form data to console
    console.log('Reservation Data Submitted:', formData);

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reservations'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      // Simulate sending an email notification to the admin
      console.log('--- ADMIN EMAIL NOTIFICATION ---');
      console.log(`Subject: New Reservation: ${formData.name}`);
      console.log(`Body: A new table reservation has been made for ${formData.date} at ${formData.time} for ${formData.guests} guests. Contact: ${formData.email} / ${formData.phone}.`);
      console.log('--------------------------------');

      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', guests: '', date: '', time: '' });
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (err) {
      setIsSubmitting(false);
      setError('Failed to submit reservation. Please try again.');
      handleFirestoreError(err, OperationType.CREATE, 'reservations');
    }
  };

  return (
    <section className="py-24 bg-cream relative" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border-4 border-white/50">
          
          {/* Left: Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 bg-cream/50">
            <h2 className="font-heading font-medium text-3xl md:text-4xl text-charcoal mb-4">
              RESERVE YOUR TABLE
            </h2>
            <p className="text-charcoal/70 mb-8 font-medium">
              Book your spot and enjoy fresh, fun, and flavorful goat grill with your favorite people.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name" 
                  className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address" 
                  className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone Number" 
                  className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <select 
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-charcoal/70"
                >
                  <option value="">Guests</option>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5+">5+ People</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-charcoal/70"
                />
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-charcoal/70"
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-spice text-sm font-bold bg-spice/10 p-3 rounded-lg border border-spice/20"
                >
                  {error}
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="w-full bg-charcoal text-cream py-4 rounded-xl font-bold text-lg hover:bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg mt-4 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isSubmitting ? "PROCESSING..." : isSuccess ? "RESERVATION CONFIRMED ✓" : "MAKE A RESERVATION"}
              </button>
            </form>
          </div>

          {/* Right: Image */}
          <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-auto">
            <img 
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" 
              alt="People enjoying food" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent flex items-end p-8">
              <div className="text-cream">
                <div className="font-heading font-bold text-2xl mb-2">Alpha Goat Grill</div>
                <p className="opacity-90">Experience the true taste of African grill.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
