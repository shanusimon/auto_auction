import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCars } from '@/hooks/user/useGetCars';
import { Car } from '@/types/Types';

const FeaturedCarCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  
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
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? featuredCars.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === featuredCars.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    if (featuredCars.length > 1) {
      const slideInterval = setInterval(goToNext, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [currentIndex, featuredCars.length]);

  // Loading state
  if (isLoading || featuredCars.length === 0) {
    return (
      <div className="w-full relative h-[500px] md:h-[600px] bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading featured vehicles...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full relative h-[500px] md:h-[600px] bg-zinc-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">Failed to load featured vehicles</div>
      </div>
    );
  }

  const currentCar = featuredCars[currentIndex];
  
  return (
    <div className="w-full relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Background image with gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{
          backgroundImage: `url(${currentCar.images?.[0]?.url || currentCar.imageUrl || currentCar.image || '/placeholder-car.jpg'})`,
          filter: 'brightness(0.7)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

      {/* Content overlay */}
      <div className="container mx-auto px-6 relative h-full flex flex-col justify-end pb-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {currentCar.year} {currentCar.make} {currentCar.model}
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            {currentCar.details || `${currentCar.mileage} miles, ${currentCar.transmission}, ${currentCar.fuel}`}
          </p>
          <div className="flex flex-wrap gap-6 mb-8">
            <div>
              <p className="text-gray-400 text-sm">Current Bid</p>
              <p className="text-white text-2xl font-bold">${currentCar.currentBid?.toLocaleString() || 'No bids'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Time Left</p>
              <p className="text-white text-2xl font-bold">{currentCar.timeLeft || 'Auction ending soon'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Bids</p>
              <p className="text-white text-2xl font-bold">{currentCar.bids || '0'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to={`/user/cars/${currentCar.id}`}>
              <Button
                variant="default"
                className="bg-[#3BE188] hover:bg-[#2dd077] text-black font-semibold px-6 py-2 rounded-full flex items-center gap-2"
              >
                View Details <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {featuredCars.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            aria-label="Previous car"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            aria-label="Next car"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {featuredCars.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredCars.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-[#3BE188]' : 'bg-white/50'
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