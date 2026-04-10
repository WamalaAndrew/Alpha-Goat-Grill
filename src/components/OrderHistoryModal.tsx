import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Package, MapPin, CreditCard, Navigation, AlertCircle } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import TrackOrderModal from './TrackOrderModal';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderHistoryModal({ isOpen, onClose }: OrderHistoryModalProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (isOpen && auth.currentUser) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Fetching without orderBy to avoid requiring a composite index immediately.
      // We will sort them client-side instead.
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', auth.currentUser?.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort descending by createdAt
      fetchedOrders.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });

      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    setIsCancelling(true);
    try {
      await updateDoc(doc(db, 'orders', orderToCancel), { status: 'cancelled' });
      setOrders(orders.map(o => o.id === orderToCancel ? { ...o, status: 'cancelled' } : o));
      setOrderToCancel(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. It may have already been dispatched.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
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
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-cream shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-charcoal/10 flex justify-between items-center bg-white">
                <h2 className="font-heading font-medium text-2xl text-charcoal flex items-center gap-2">
                  <Clock size={24} className="text-golden" />
                  Order History
                </h2>
                <button onClick={onClose} className="text-charcoal/50 hover:text-spice transition-colors">
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-golden"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 opacity-60">
                    <Package size={48} className="mx-auto mb-4" />
                    <p className="font-medium text-lg">No orders found.</p>
                    <p className="text-sm">Looks like you haven't ordered yet!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-charcoal/5">
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.status === 'completed' ? 'bg-primary/10 text-primary' : 
                            order.status === 'out_for_delivery' ? 'bg-golden/20 text-golden' :
                            'bg-spice/10 text-spice'
                          }`}>
                            {order.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-charcoal/50 font-medium">
                            {order.createdAt?.toDate().toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-charcoal/80 text-sm">
                            <Package size={16} className="text-golden" />
                            <span className="font-bold">{order.itemCount} Items</span>
                          </div>
                          <div className="flex items-center gap-2 text-charcoal/80 text-sm">
                            <MapPin size={16} className="text-golden" />
                            <span className="capitalize">{order.orderType}</span>
                          </div>
                          <div className="flex items-center gap-2 text-charcoal/80 text-sm">
                            <CreditCard size={16} className="text-golden" />
                            <span className="capitalize">{order.paymentMethod}</span>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t border-charcoal/10 flex justify-between items-center">
                          <span className="text-xs text-charcoal/50 truncate">ID: {order.id}</span>
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <button 
                                onClick={() => setOrderToCancel(order.id)}
                                className="flex items-center gap-1 text-xs font-bold bg-spice/10 text-spice px-3 py-1.5 rounded-lg hover:bg-spice/20 transition-colors"
                              >
                                <X size={14} /> Cancel
                              </button>
                            )}
                            {order.status === 'out_for_delivery' && (
                              <button 
                                onClick={() => setTrackingOrderId(order.id)}
                                className="flex items-center gap-1 text-xs font-bold bg-charcoal text-golden px-3 py-1.5 rounded-lg hover:bg-primary transition-colors"
                              >
                                <Navigation size={14} /> Track
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <TrackOrderModal 
        isOpen={!!trackingOrderId} 
        onClose={() => setTrackingOrderId(null)} 
        orderId={trackingOrderId || ''} 
      />

      {/* Cancellation Confirmation Modal */}
      <AnimatePresence>
        {orderToCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="inline-flex items-center justify-center p-3 bg-spice/10 text-spice rounded-full mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="font-heading font-bold text-2xl text-charcoal mb-2">Cancel Order?</h3>
              <p className="text-charcoal/70 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setOrderToCancel(null)}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-charcoal bg-charcoal/5 hover:bg-charcoal/10 transition-colors disabled:opacity-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-spice hover:bg-spice/90 transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {isCancelling ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    "Yes, Cancel"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
