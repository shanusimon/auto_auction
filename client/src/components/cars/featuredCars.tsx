import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FeaturedCar = () => {
  return (
    <div className="w-full relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Background image with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1619405399537-b3e0e3a4b1fb?q=80&w=2070&auto=format&fit=crop)', 
          filter: 'brightness(0.7)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

      {/* Content overlay */}
      <div className="container mx-auto px-6 relative h-full flex flex-col justify-end pb-16">
        <div className="max-w-3xl">
          <div className="mb-3">
            <span className="inline-block bg-[#3BE188] text-black px-3 py-1 text-sm font-semibold rounded-full">
              Featured Auction
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            2023 Porsche 911 GT3 RS
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Weissach Package, Paint to Sample Turquoise Blue, 498 Miles
          </p>
          <div className="flex flex-wrap gap-6 mb-8">
            <div>
              <p className="text-gray-400 text-sm">Current Bid</p>
              <p className="text-white text-2xl font-bold">$385,000</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Time Left</p>
              <p className="text-white text-2xl font-bold">2 days, 4 hours</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Bids</p>
              <p className="text-white text-2xl font-bold">37</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-[#3BE188] hover:bg-[#2dd077] text-black font-semibold px-6 py-2 rounded-full"
            >
              Place Bid
            </Button>
            <Link to="/auctions/porsche-911-gt3-rs">
              <Button 
                variant="outline" 
                className="text-black border-white hover:bg-white/30 rounded-full px-6 py-2 flex items-center gap-2"
              >
                View Details <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCar;
