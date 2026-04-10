import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc, increment } from 'firebase/firestore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number;
}

export default function CheckoutModal({ isOpen, onClose, itemCount }: CheckoutModalProps) {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      if (!guestName.trim() || !guestPhone.trim()) {
        setError('Please provide your name and phone number for the order.');
        return;
      }
    }

    if (orderType === 'delivery' && !address) {
      setError('Please enter a delivery address.');
      return;
    }

    if (paymentMethod === 'card' && cardNumber.length < 16) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const orderData: any = {
        userId: auth.currentUser ? auth.currentUser.uid : 'guest',
        itemCount,
        orderType,
        address: orderType === 'delivery' ? address : 'Pickup at Restaurant',
        paymentMethod,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      if (auth.currentUser) {
        orderData.userEmail = auth.currentUser.email;
      } else {
        orderData.guestName = guestName;
        orderData.guestPhone = guestPhone;
        if (guestEmail) {
          orderData.guestEmail = guestEmail;
        }
      }

      await addDoc(collection(db, 'orders'), orderData);
      
      // Simulate sending an email notification to the admin
      console.log('--- ADMIN EMAIL NOTIFICATION ---');
      console.log(`Subject: New Order Received (${orderData.orderType})`);
      console.log(`Body: A new order has been placed by ${orderData.guestName || orderData.userEmail || 'Guest'}. Items: ${orderData.itemCount}. Payment: ${orderData.paymentMethod}.`);
      console.log('--------------------------------');

      // Add points if user is logged in
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, { points: increment(itemCount * 100) }, { merge: true });
      }
      
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        window.dispatchEvent(new CustomEvent('clear-cart'));
      }, 3000);
    } catch (err) {
      setIsSubmitting(false);
      setError('Failed to process order. Please try again.');
      handleFirestoreError(err, OperationType.CREATE, 'orders');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-cream rounded-[2rem] shadow-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading font-medium text-3xl text-charcoal">Checkout</h2>
                <button onClick={onClose} className="text-charcoal/50 hover:text-spice transition-colors">
                  <X size={28} />
                </button>
              </div>

              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-golden text-charcoal rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="font-heading font-bold text-2xl mb-2">Order Confirmed!</h3>
                  <p className="text-charcoal/70">Your delicious goat grill is being prepared.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-white p-4 rounded-xl border border-charcoal/10 flex justify-between items-center">
                    <span className="font-bold text-charcoal">Total Items:</span>
                    <span className="bg-spice text-cream px-3 py-1 rounded-full font-bold">{itemCount}</span>
                  </div>

                  {/* Guest Information */}
                  {!auth.currentUser && (
                    <div className="space-y-4 bg-primary/5 p-4 rounded-xl border border-primary/20">
                      <h3 className="font-bold text-charcoal">Contact Information</h3>
                      <p className="text-xs text-charcoal/60 mb-2">Sign in to save your order history, or continue as a guest.</p>
                      
                      <div>
                        <label className="block text-sm font-bold text-charcoal/70 mb-1">Full Name *</label>
                        <input 
                          type="text" 
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-charcoal/70 mb-1">Phone Number *</label>
                        <input 
                          type="tel" 
                          required
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="+256 700 000000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-charcoal/70 mb-1">Email Address (Optional)</label>
                        <input 
                          type="email" 
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  )}

                  {/* Order Type */}
                  <div>
                    <label className="block font-bold text-charcoal mb-3">Order Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setOrderType('delivery')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${orderType === 'delivery' ? 'border-primary bg-primary/5 text-primary' : 'border-charcoal/10 text-charcoal/50 hover:border-charcoal/30'}`}
                      >
                        <Truck size={24} className="mb-2" />
                        <span className="font-bold">Delivery</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('pickup')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${orderType === 'pickup' ? 'border-primary bg-primary/5 text-primary' : 'border-charcoal/10 text-charcoal/50 hover:border-charcoal/30'}`}
                      >
                        <MapPin size={24} className="mb-2" />
                        <span className="font-bold">Pickup</span>
                      </button>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {orderType === 'delivery' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block font-bold text-charcoal mb-2">Delivery Address</label>
                      <textarea 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your full address..."
                        className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none h-24"
                      />
                    </motion.div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <label className="block font-bold text-charcoal mb-3">Payment Method</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${paymentMethod === 'card' ? 'border-golden bg-golden/10 text-charcoal' : 'border-charcoal/10 text-charcoal/50 hover:border-charcoal/30'}`}
                      >
                        <CreditCard size={20} />
                        <span className="font-bold">Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${paymentMethod === 'cash' ? 'border-golden bg-golden/10 text-charcoal' : 'border-charcoal/10 text-charcoal/50 hover:border-charcoal/30'}`}
                      >
                        <span className="font-bold text-xl">💵</span>
                        <span className="font-bold">Cash</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Details */}
                  {paymentMethod === 'card' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block font-bold text-charcoal mb-2">Card Number</label>
                      <input 
                        type="text"
                        maxLength={16}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="1234 5678 9101 1121"
                        className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </motion.div>
                  )}

                  {error && (
                    <div className="text-spice text-sm font-bold bg-spice/10 p-3 rounded-lg border border-spice/20">
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting || itemCount === 0}
                    className="w-full bg-charcoal text-cream py-4 rounded-xl font-bold text-lg hover:bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSubmitting ? "PROCESSING..." : `PAY NOW`}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
