import { Link } from 'react-router-dom';
import { Trophy, Gavel } from 'lucide-react';

interface EndedCarCardProps {
  id: string;
  title: string;
  year: number;
  make: string;
  model: string;
  imageUrl: string;
  winningBid: number;
  totalBids?: number;
  location?: string;
  noReserve?: boolean;
  specs?: string[];
  approvalStatus: 'sold' | 'ended';
  soldDate?: string;
}

const EndedCarCard: React.FC<EndedCarCardProps> = ({
  id,
  year,
  make,
  model,
  imageUrl,
  winningBid,
  totalBids,
  location,
  noReserve,
  specs,
  approvalStatus,
  soldDate,
}) => {
  // Utility Functions
  const formatSoldDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusInfo = () => {
    if (approvalStatus === 'sold') {
      return {
        label: 'SOLD',
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        icon: Trophy
      };
    }
    return {
      label: 'ENDED',
      bgColor: 'bg-gray-500',
      textColor: 'text-white',
      icon: Gavel
    };
  };

  // Component Data
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const isSold = approvalStatus === 'sold';
  const carTitle = `${year} ${make} ${model}`;

  // Sub-components
  const StatusBanner = () => (
    <div className={`
      absolute top-0 left-0 right-0 z-10
      ${statusInfo.bgColor} ${statusInfo.textColor}
      text-center text-sm font-semibold py-2
      flex items-center justify-center gap-2
    `}>
      <StatusIcon className="h-4 w-4" />
      {statusInfo.label}
      {soldDate && isSold && (
        <span className="text-xs opacity-90">
          • {formatSoldDate(soldDate)}
        </span>
      )}
    </div>
  );

  const ImageSection = () => (
    <div className="relative h-48 overflow-hidden rounded-t-lg mt-10">
      <img
        src={imageUrl}
        alt={carTitle}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90"
      />
      
      {/* Winning Bid Badge */}
      <div className={`
        absolute top-3 right-3
        ${isSold ? 'bg-green-600/90' : 'bg-gray-600/90'}
        text-white text-sm px-3 py-2 rounded-md font-semibold shadow-lg
      `}>
        {isSold ? 'Won' : 'Final'} ${winningBid.toLocaleString()}
      </div>

      {/* Total Bids Badge */}
      {totalBids !== undefined && totalBids > 0 && (
        <div className="absolute top-3 left-3 bg-black/80 text-white text-sm px-2 py-1 rounded-md flex items-center">
          <Gavel className="mr-1 h-3.5 w-3.5 text-[#3BE188]" />
          {totalBids} bid{totalBids !== 1 ? 's' : ''}
        </div>
      )}

      {/* No Reserve Badge */}
      {noReserve && (
        <div className="absolute bottom-3 left-3 bg-[#3BE188]/80 text-black text-xs px-2 py-1 rounded-md uppercase font-semibold">
          No Reserve
        </div>
      )}
    </div>
  );

  const ContentSection = () => (
    <div className="p-4 flex flex-col h-32">
      {/* Car Title */}
      <div className="mb-2">
        <h3 className={`
          font-semibold text-base line-clamp-1
          transition-colors group-hover:text-green-400
          ${isSold ? 'text-green-100' : 'text-gray-300'}
        `}>
          {carTitle}
        </h3>
      </div>
      
      {/* Car Details */}
      <div className="flex-1 min-h-0">
        {/* Specs */}
        {specs && specs.length > 0 && (
          <p className="text-sm text-zinc-400 line-clamp-1 mb-1">
            {specs.join(' • ')}
          </p>
        )}
        
        {/* Location */}
        {location && (
          <p className="text-sm text-zinc-500 line-clamp-1 mb-2">
            {location}
          </p>
        )}
      </div>

      {/* Auction Result Summary */}
      <div className="border-t border-zinc-700 pt-2 mt-auto">
        <p className={`
          text-xs font-medium
          ${isSold ? 'text-green-400' : 'text-gray-400'}
        `}>
          {isSold 
            ? 'Auction completed successfully' 
            : 'Auction ended without sale'
          }
        </p>
      </div>
    </div>
  );

  return (
    <Link to={`/user/cars/${id}`} className="block group">
      <div className="
        overflow-hidden transition-all duration-300 rounded-lg
        bg-zinc-900 border border-zinc-800
        hover:shadow-lg hover:shadow-green-500/20
        h-80 w-full relative
      ">
        <StatusBanner />
        <ImageSection />
        <ContentSection />
      </div>
    </Link>
  );
};

export default EndedCarCard;