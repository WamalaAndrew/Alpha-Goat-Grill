import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Gift, Star } from 'lucide-react';
import { db, auth } from '../firebase';
import { doc, onSnapshot, setDoc, increment } from 'firebase/firestore';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RewardsModal({ isOpen, onClose }: RewardsModalProps) {
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setPoints(docSnap.data().points || 0);
        } else {
          setPoints(0);
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isOpen]);

  const redeemReward = async (cost: number, rewardName: string) => {
    if (points < cost) {
      alert("Not enough points!");
      return;
    }
    
    if (window.confirm(`Redeem ${cost} points for ${rewardName}?`)) {
      try {
        const userRef = doc(db, 'users', auth.currentUser!.uid);
        await setDoc(userRef, { points: increment(-cost) }, { merge: true });
        alert(`Successfully redeemed ${rewardName}! Show this to the cashier or apply it at checkout (simulated).`);
      } catch (error) {
        console.error("Error redeeming points", error);
        alert("Failed to redeem points.");
      }
    }
  };

  const rewards = [
    { name: 'Free Fresh Passion Juice', cost: 500, icon: '🥤' },
    { name: 'Free Kachumbari Salad', cost: 800, icon: '🥗' },
    { name: 'Free Spicy Goat Bites', cost: 2500, icon: '🍖' },
  ];

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-cream rounded-[2rem] shadow-2xl z-50 overflow-hidden"
          >
            <div className="bg-charcoal p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-golden via-transparent to-transparent"></div>
              <button onClick={onClose} className="absolute top-4 right-4 text-cream/50 hover:text-golden transition-colors z-10">
                <X size={28} />
              </button>
              
              <div className="inline-flex items-center justify-center p-4 bg-golden/20 rounded-full mb-4 relative z-10">
                <Award size={48} className="text-golden" />
              </div>
              <h2 className="font-heading font-medium text-3xl text-cream relative z-10">Alpha Rewards</h2>
              <p className="text-cream/70 mt-2 relative z-10">Earn 100 points for every item you order!</p>
            </div>

            <div className="p-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-charcoal/10 text-center mb-8 -mt-12 relative z-20">
                <p className="text-sm font-bold text-charcoal/50 uppercase tracking-wider mb-1">Your Balance</p>
                {isLoading ? (
                  <div className="h-10 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-golden"></div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-4xl font-heading font-bold text-charcoal">
                    <Star className="text-golden fill-golden" size={32} />
                    {points} <span className="text-xl text-charcoal/50">pts</span>
                  </div>
                )}
              </div>

              <h3 className="font-bold text-lg text-charcoal mb-4 flex items-center gap-2">
                <Gift size={20} className="text-spice" />
                Available Rewards
              </h3>

              <div className="space-y-3">
                {rewards.map((reward, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl border border-charcoal/10">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <p className="font-bold text-charcoal text-sm">{reward.name}</p>
                        <p className="text-xs text-golden font-bold">{reward.cost} pts</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => redeemReward(reward.cost, reward.name)}
                      disabled={points < reward.cost}
                      className="px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:bg-charcoal/5 disabled:text-charcoal/40 bg-golden text-charcoal hover:bg-golden/90"
                    >
                      Redeem
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
