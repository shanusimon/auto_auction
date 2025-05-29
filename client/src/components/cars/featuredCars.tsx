import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Car as CarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCars } from '@/hooks/user/useGetCars';
import { Car } from '@/types/Types';

const FeaturedCarCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { data: cars, isLoading, error } = useCars({
    sort: 'newest',
    page: 1,
    limit: 5
  });

  useEffect(() => {
    if (cars && Array.isArray(cars) && cars.length > 0) {
      console.log('Featured cars data:', cars);
      setFeaturedCars(cars);
    }
  }, [cars]);

  const goToPrevious = () => {
    if (isTransitioning || featuredCars.length <= 1) return;
    
    setIsTransitioning(true);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? featuredCars.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning || featuredCars.length <= 1) return;
    
    setIsTransitioning(true);
    const isLastSlide = currentIndex === featuredCars.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    if (featuredCars.length > 1 && !isTransitioning) {
      const slideInterval = setInterval(goToNext, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [currentIndex, featuredCars.length, isTransitioning]);

  // Enhanced Loading Component
  const LoadingState = () => (
    <div className="w-full relative h-[500px] md:h-[600px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      
      <div className="container mx-auto px-6 relative h-full flex flex-col justify-center items-center">
        <div className="text-center">
          {/* Loading spinner */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-zinc-700 border-t-[#3BE188] rounded-full animate-spin" />
          </div>
          
          {/* Loading text */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Loading Featured Vehicles
          </h2>
          <p className="text-gray-400 text-lg">
            Discovering the finest automotive selections for you...
          </p>
          
          {/* Skeleton content */}
          <div className="mt-8 max-w-md">
            <div className="space-y-3">
              <div className="h-4 bg-zinc-700/50 rounded animate-pulse" />
              <div className="h-4 bg-zinc-700/50 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-zinc-700/50 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Error Component  
  const ErrorState = () => (
    <div className="w-full relative h-[500px] md:h-[600px] bg-gradient-to-br from-red-900/20 via-zinc-900 to-zinc-900 overflow-hidden">
      <div className="container mx-auto px-6 relative h-full flex flex-col justify-center items-center">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full">
              <CarIcon size={32} className="text-red-400" />
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Unable to Load Vehicles
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            We're having trouble loading the featured vehicles. Please try refreshing the page.
          </p>
          
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-red-500/50 hover:bg-red-500/10 text-red-400 hover:text-red-300"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );

  // Enhanced No Cars Fallback
  const NoCarsState = () => (
    <div className="w-full relative h-[500px] md:h-[600px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 overflow-hidden">
      <div className="container mx-auto px-6 relative h-full flex flex-col justify-center items-center">
        <div className="text-center max-w-lg">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#3BE188]/20 rounded-full">
              <CarIcon size={40} className="text-[#3BE188]" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            We're preparing an exciting collection of premium vehicles for auction. 
            Check back soon to discover extraordinary automotive treasures.
          </p>
          
          <Link to="/user/cars">
            <Button
              variant="default"
              className="bg-[#3BE188] hover:bg-[#2dd077] text-black font-semibold px-8 py-3 rounded-full flex items-center gap-2 mx-auto"
            >
              Explore All Listings <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  // Handle different states
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!featuredCars || featuredCars.length === 0) return <NoCarsState />;

  const currentCar = featuredCars[currentIndex];
  
  return (
    <div className="w-full relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Background images - smooth transitions */}
      <div className="absolute inset-0">
        {featuredCars.map((car, index) => (
          <div
            key={car.id}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out ${
              index === currentIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
            style={{
              backgroundImage: `url(${car.images?.[0]?.url || car.imageUrl || car.image || '/placeholder-car.jpg'})`,
              filter: 'brightness(0.6)'
            }}
          />
        ))}
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Content overlay with smooth transitions */}
      <div className="container mx-auto px-6 relative h-full flex flex-col justify-end pb-16">
        <div className={`max-w-3xl transition-all duration-500 ease-in-out ${
          isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {currentCar.year} {currentCar.make} {currentCar.model}
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-8 drop-shadow">
            {currentCar.description || `${currentCar.mileage || 'Low'} miles • ${currentCar.transmission || 'Automatic'} • ${currentCar.fuel || 'Premium'}`}
          </p>
          
          <div className="flex flex-wrap gap-8 mb-10">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-1">Current Bid</p>
              <p className="text-white text-2xl md:text-3xl font-bold">
                ${currentCar.currentBid?.toLocaleString() || 'No bids'}
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-1">Time Left</p>
              <p className="text-white text-2xl md:text-3xl font-bold">
                {currentCar.timeLeft || 'Ending Soon'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link to={`/user/cars/${currentCar.id}`}>
              <Button
                variant="default"
                className="bg-[#3BE188] hover:bg-[#2dd077] text-black font-semibold px-8 py-3 rounded-full flex items-center gap-2 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                View Details <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation arrows */}
      {featuredCars.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 disabled:bg-black/20 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm shadow-lg"
            aria-label="Previous car"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 disabled:bg-black/20 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm shadow-lg"
            aria-label="Next car"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Enhanced Dots indicator */}
      {featuredCars.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {featuredCars.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-[#3BE188] scale-125 shadow-lg' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedCarCarousel;