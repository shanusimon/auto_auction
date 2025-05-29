import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';
import AuctionSocket from '@/services/webSocket/webSockeService';

interface CarCardProps {
  id: string;
  title: string;
  year: number;
  make: string;
  model: string;
  imageUrl: string;
  currentBid: number;
  auctionEndTime: string | null;
  bids?: number;
  location?: string;
  noReserve?: boolean;
  specs?: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'sold' | 'ended';
  endAuction: (carId: string) => void;
}

interface AuctionEndedPayload {
  success: boolean;
  carId: string;
  status: 'sold' | 'ended';
}

const CarCard: React.FC<CarCardProps> = ({
  id,
  year,
  make,
  model,
  imageUrl,
  currentBid,
  auctionEndTime,
  location,
  noReserve,
  specs,
  approvalStatus,
  endAuction,
}) => {
  const [remainingTime, setRemainingTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEnded, setIsEnded] = useState(
    approvalStatus === 'ended' || 
    approvalStatus === 'sold' || 
    (auctionEndTime && new Date(auctionEndTime).getTime() <= new Date().getTime())
  );

  useEffect(() => {
    if (!auctionEndTime || isEnded || approvalStatus !== 'approved') {
      setIsEnded(true);
      return;
    }

    const endTime = new Date(auctionEndTime).getTime();

    const calculateRemaining = async () => {
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setIsEnded(true);
        try {
          endAuction(id);
        } catch (error: any) {
          console.error(`Failed to end auction ${id}:`, error.message);
          toast.error('Failed to process auction end');
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemainingTime({ days, hours, minutes, seconds });
    };

    calculateRemaining();
    const timerId = setInterval(calculateRemaining, 1000);

    return () => clearInterval(timerId);
  }, [auctionEndTime, id, isEnded, approvalStatus, endAuction]);

  useEffect(() => {
    const handleAuctionEnded = (data: AuctionEndedPayload) => {
      if (data.success && data.carId === id) {
        setIsEnded(true);
      }
    };

    AuctionSocket.on('auction-ended', handleAuctionEnded);

    return () => {
      AuctionSocket.off('auction-ended', handleAuctionEnded);
    };
  }, [id]);

  const formatTimeRemaining = () => {
    if (isEnded) return 'Ended';

    const { days, hours, minutes, seconds } = remainingTime;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };

  return (
    <div className="relative">
      {isEnded && (
        <div className="absolute top-0 left-0 right-0 bg-[#3BE188] text-black text-center text-sm font-semibold py-1 z-10">
          Auction Ended
        </div>
      )}
      <Link to={`/user/cars/${id}`} className="block group">
        <div className={`overflow-hidden transition-all duration-300 rounded-lg bg-zinc-900 border border-zinc-800 hover:shadow-lg hover:shadow-[#3BE188]/20 h-80 w-full ${isEnded ? 'mt-6' : ''}`}>
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img
              src={imageUrl}
              alt={`${year} ${make} ${model}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-black/80 text-white text-sm px-2 py-1 rounded-md flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5 text-[#3BE188]" />
              {formatTimeRemaining()}
            </div>
            <div className="absolute bottom-3 right-3 bg-black/80 text-white text-sm px-2 py-1 rounded-md">
              Bid ${currentBid.toLocaleString()}
            </div>
            {noReserve && (
              <div className="absolute bottom-3 left-3 bg-[#3BE188] text-black text-xs px-2 py-1 rounded-md uppercase font-semibold">
                No Reserve
              </div>
            )}
          </div>
          <div className="p-4 h-32 flex flex-col">
            <h3 className="font-semibold text-base text-white group-hover:text-[#3BE188] transition-colors line-clamp-1">
              {year} {make} {model}
            </h3>
            <div className="h-6 mt-1">
              {specs && specs.length > 0 && (
                <p className="text-sm text-zinc-400 line-clamp-1">{specs.join(' • ')}</p>
              )}
            </div>
            <div className="h-5 mt-1">
              {location && <p className="text-sm text-zinc-500 line-clamp-1">{location}</p>}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CarCard;