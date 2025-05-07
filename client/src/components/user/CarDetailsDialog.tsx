import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Clock, DollarSign, Gauge, MapPin, Users, Car as CarIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

// Updated interface to match the backend structure
interface CarDetailProps {
  isOpen: boolean;
  onClose: () => void;
  car: {
    _id?: string;
    make?: string;
    model?: string;
    year?: number;
    images?: string[];
    mileage?: number;
    location?: string;
    highestBid?: number;
    auctionEndTime?: string;
    description?: string;
    exteriorColor?: string;
    interiorColor?: string;
    fuel?: string;
    transmission?: string;
    bodyType?: string;
    title?: string;
  };
}

const CarDetailDialog: React.FC<CarDetailProps> = ({ isOpen, onClose, car }) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !car) return null;

  // Format auction end time into readable format
  const formatAuctionEnd = () => {
    if (!car.auctionEndTime) return 'Unknown';
    
    const endDate = new Date(car.auctionEndTime);
    const now = new Date();
    
    // If auction has ended
    if (endDate < now) {
      return 'Auction ended';
    }
    
    const diffTime = Math.abs(endDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      return `${diffDays} days left`;
    } else if (diffDays === 1) {
      return '1 day left';
    } else {
      // Less than a day, show hours
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      if (diffHours === 1) {
        return '1 hour left';
      } else {
        return `${diffHours} hours left`;  
      }
    }
  };

  // Portal content
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-zinc-900 text-white w-11/12 md:w-4/5 lg:w-3/5 max-w-4xl h-[85vh] rounded-lg border border-zinc-700 overflow-hidden shadow-xl flex flex-col"
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-700 bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ rotate: -10 }} 
              animate={{ rotate: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-2 bg-zinc-800 rounded-full"
            >
              <CarIcon size={24} className="text-[#3BE188]" />
            </motion.div>
            <div>
              <motion.h2 
                initial={{ x: -20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-xl font-bold text-white"
              >
                {car.year} {car.make} {car.model}
              </motion.h2>
              <motion.p 
                initial={{ x: -20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-gray-400 text-sm mt-0.5"
              >
                ID: {car._id?.substring(0, 8)}...
              </motion.p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </motion.button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="mx-auto space-y-6">
            {/* Image gallery */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {car.images && car.images.length > 0 ? (
                <div className="relative aspect-[16/9] bg-zinc-800 rounded-lg overflow-hidden shadow-md border border-zinc-700/30">
                  <img 
                    src={car.images[0]} 
                    alt={`${car.make} ${car.model}`} 
                    className="w-full h-full object-cover"
                  />
                  {car.images.length > 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      +{car.images.length - 1} more
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="bg-zinc-800 rounded-lg aspect-[16/9] flex items-center justify-center shadow-md border border-zinc-700/30">
                  <CarIcon size={80} className="text-gray-600" />
                </div>
              )}
            </motion.div>

            {/* Current bid */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.01 }}
              className="bg-zinc-800/50 border border-[#3BE188]/40 p-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <motion.div>
                  <span className="text-gray-400 text-sm">Current Bid</span>
                  <div className="text-2xl font-bold text-[#3BE188] mt-1">
                    ${car.highestBid?.toLocaleString() || '0'}
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#3BE188]/10 p-3 rounded-full"
                >
                  <DollarSign size={24} className="text-[#3BE188]" />
                </motion.div>
              </div>
            </motion.div>

            {/* Quick details */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {car.mileage !== undefined && (
                <motion.div 
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-zinc-800 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm border border-zinc-700/30 h-24"
                >
                  <div className="bg-zinc-700/50 p-1.5 rounded-full mb-2">
                    <Gauge size={20} className="text-[#3BE188]" />
                  </div>
                  <div className="text-xs text-gray-400">Mileage</div>
                  <div className="font-semibold text-sm mt-0.5 truncate">{car.mileage?.toLocaleString()} mi</div>
                </motion.div>
              )}
              
              {car.location && (
                <motion.div 
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-zinc-800 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm border border-zinc-700/30 h-24"
                >
                  <div className="bg-zinc-700/50 p-1.5 rounded-full mb-2">
                    <MapPin size={20} className="text-[#3BE188]" />
                  </div>
                  <div className="text-xs text-gray-400">Location</div>
                  <div className="font-semibold text-sm mt-0.5 truncate max-w-full">{car.location}</div>
                </motion.div>
              )}
              
              {car.bodyType && (
                <motion.div 
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-zinc-800 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm border border-zinc-700/30 h-24"
                >
                  <div className="bg-zinc-700/50 p-1.5 rounded-full mb-2">
                    <CarIcon size={20} className="text-[#3BE188]" />
                  </div>
                  <div className="text-xs text-gray-400">Body Type</div>
                  <div className="font-semibold text-sm mt-0.5">{car.bodyType}</div>
                </motion.div>
              )}
              
              {car.auctionEndTime && (
                <motion.div 
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-zinc-800 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm border border-zinc-700/30 h-24"
                >
                  <div className="bg-zinc-700/50 p-1.5 rounded-full mb-2">
                    <Clock size={20} className="text-[#3BE188]" />
                  </div>
                  <div className="text-xs text-gray-400">Auction Ends</div>
                  <div className="font-semibold text-sm mt-0.5 truncate">{formatAuctionEnd()}</div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Description */}
            {car.description && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-700/30"
              >
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{car.description}</p>
              </motion.div>
            )}
            
            {/* Car Details */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-700/30"
            >
              <h3 className="text-lg font-semibold mb-2">Car Details</h3>
              <div className="grid grid-cols-2 gap-3">
                {car.exteriorColor && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Exterior Color:</span>
                    <span className="text-gray-300 text-sm">{car.exteriorColor}</span>
                  </div>
                )}
                {car.interiorColor && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Interior Color:</span>
                    <span className="text-gray-300 text-sm">{car.interiorColor}</span>
                  </div>
                )}
                {car.fuel && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Fuel Type:</span>
                    <span className="text-gray-300 text-sm">{car.fuel}</span>
                  </div>
                )}
                {car.transmission && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Transmission:</span>
                    <span className="text-gray-300 text-sm">{car.transmission}</span>
                  </div>
                )}
                {car.title && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Title:</span>
                    <span className="text-gray-300 text-sm">{car.title}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CarDetailDialog;