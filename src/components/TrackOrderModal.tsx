import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
const icon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export default function TrackOrderModal({ isOpen, onClose, orderId }: TrackOrderModalProps) {
  // Kampala coordinates
  const restaurantPos: [number, number] = [0.3476, 32.5825];
  const [driverPos, setDriverPos] = useState<[number, number]>([0.3476, 32.5825]);

  // Simulate driver movement
  useEffect(() => {
    if (!isOpen) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.05;
      if (progress > 1) progress = 1;
      
      // Simulate moving slightly north-east
      const newLat = restaurantPos[0] + (0.01 * progress);
      const newLng = restaurantPos[1] + (0.01 * progress);
      
      setDriverPos([newLat, newLng]);

      if (progress === 1) clearInterval(interval);
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen]);

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-cream rounded-[2rem] shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-charcoal/10 flex justify-between items-center bg-white">
              <h2 className="font-heading font-medium text-2xl text-charcoal flex items-center gap-2">
                <Navigation size={24} className="text-golden" />
                Live Tracking
              </h2>
              <button onClick={onClose} className="text-charcoal/50 hover:text-spice transition-colors">
                <X size={28} />
              </button>
            </div>

            <div className="p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-charcoal/50 font-bold uppercase tracking-wider">Order Status</p>
                  <p className="font-bold text-golden text-xl">Out for Delivery</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-charcoal/50 font-bold uppercase tracking-wider">Est. Arrival</p>
                  <p className="font-bold text-charcoal text-xl">15 - 20 min</p>
                </div>
              </div>

              <div className="h-[400px] w-full rounded-2xl overflow-hidden border-2 border-charcoal/10 relative z-0">
                <MapContainer center={restaurantPos} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={restaurantPos}>
                    <Popup>
                      Alpha Goat Grill (Restaurant)
                    </Popup>
                  </Marker>
                  <Marker position={driverPos}>
                    <Popup>
                      Your Driver is here!
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              
              <div className="mt-4 flex items-center gap-4 bg-cream p-4 rounded-xl">
                <div className="w-12 h-12 bg-charcoal rounded-full flex items-center justify-center text-cream">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold text-charcoal">Driver: John Doe</p>
                  <p className="text-sm text-charcoal/70">Motorcycle - UAA 123A</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
