import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import FeaturedCarCarousel from '@/components/cars/featuredCars';
import { Button } from '@/components/ui/button';
import CarCard from '@/components/cars/Car';
import EndedCarCard from '@/components/cars/EndCarCard';
import CarFilters from '@/components/cars/CarFilter';
import { requestNotificationPresmission, listenForForegroundMessages } from '@/services/firebase/messaging';
import { useStoreFCMToken } from '@/hooks/user/userDashboard';
import { useCars } from '@/hooks/user/useGetCars';
import { useAuctionEnd } from '@/hooks/user/useAuctionEnd';
import CarCardSkeleton from '@/components/cars/CarCardSkeleton';
import AuctionSocket from '@/services/webSocket/webSockeService';
import { Car } from '@/types/Types';
import { useGetSoldCars } from '@/hooks/user/useGetSoldCars';

interface SoldCar {
  _id?: string;
  id?: string;
  title?: string;
  year?: number;
  make?: string;
  model?: string;
  imageUrl?: string;
  images?: string[];
  image?: string;
  photos?: string[];
  highestBid?: number;
  currentBid?: number;
  finalBid?: number;
  bids?: number;
  bidCount?: number;
  totalBids?: number;
  location?: string;
  noReserve?: boolean;
  specs?: string[];
  approvalStatus?: 'sold' | 'ended';
  soldDate?: string;
  auctionEndDate?: string;
  updatedAt?: string;
}


interface SoldCarsResponse {
  data?: SoldCar[];
}


interface Filters {
  year: string;
  bodyType: string;
  fuel: string;
  transmission: string;
  sort: string;
}


interface BidPayload {
  success: boolean;
  bid: {
    carId: string;
    amount: number;
    auctionEndTime?: string;
    userId?: string;
  };
}


interface AuctionEndedPayload {
  success: boolean;
  carId: string;
  status: 'sold' | 'ended';
}

export default function UserHomePage() {
  const { mutate: storeFCMToken } = useStoreFCMToken();
  const { mutate: endAuction } = useAuctionEnd();
  const [filters, setFilters] = useState<Filters>({
    year: '',
    bodyType: '',
    fuel: '',
    transmission: '',
    sort: 'ending-soon',
  });
  const [page, setPage] = useState<number>(1);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { data: cars, isLoading, error } = useCars({
    year: filters.year ? Number(filters.year) : undefined,
    bodyType: filters.bodyType || undefined,
    fuel: filters.fuel || undefined,
    transmission: filters.transmission || undefined,
    sort: filters.sort,
    page,
    limit: 20,
  });

  const { 
    data: soldCars, 
    isLoading: soldCarsLoading, 
    error: soldCarsError 
  } = useGetSoldCars() as { data?: SoldCarsResponse; isLoading: boolean; error: any };

  useEffect(() => {
    const setupFCM = async () => {
      const cachedToken = localStorage.getItem('fcmToken');
      const token = await requestNotificationPresmission();
      if (token && token !== cachedToken) {
        storeFCMToken(token, {
          onSuccess: () => {
            localStorage.setItem('fcmToken', token);
            toast.success('Notifications enabled');
          },
          onError: (err) => {
            console.error('Failed to save token:', err);
            toast.error('Failed to enable notifications');
          },
        });
      }
      listenForForegroundMessages();
    };
    setupFCM();
  }, [storeFCMToken]);

  useEffect(() => {
    if (cars && Array.isArray(cars)) {
      if (page === 1) {
        setAllCars(cars);
      } else {
        setAllCars((prev) => [...prev, ...cars]);
      }
      setHasMore(cars.length === 20);
    }
  }, [cars, page]);

  useEffect(() => {
    const handleNewBid = (data: BidPayload) => {
      if (data.success && data.bid.carId) {
        setAllCars((prevCars) =>
          prevCars.map((car) =>
            car.id.toString() === data.bid.carId.toString()
              ? {
                  ...car,
                  currentBid: data.bid.amount,
                  auctionEndTime: data.bid.auctionEndTime || car.auctionEndTime,
                }
              : car
          )
        );
      }
    };

    const handleAuctionEnded = (data: AuctionEndedPayload) => {
      if (data.success && data.carId) {
        setAllCars((prevCars) =>
          prevCars.map((car) =>
            car.id.toString() === data.carId.toString()
              ? {
                  ...car,
                  approvalStatus: data.status,
                  auctionEndTime: null,
                }
              : car
          )
        );
        toast.info(`Auction for car ${data.carId} has ended`);
      }
    };

    AuctionSocket.on('new-bid', handleNewBid);
    AuctionSocket.on('auction-ended', handleAuctionEnded);

    return () => {
      AuctionSocket.off('new-bid', handleNewBid);
      AuctionSocket.off('auction-ended', handleAuctionEnded);
    };
  }, []);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
    setAllCars([]);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  const renderSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => <CarCardSkeleton key={`skeleton-${index}`} />);
  };

  const renderSoldCarSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => <CarCardSkeleton key={`sold-skeleton-${index}`} />);
  };

  // Transform sold cars data for EndedCarCard component
  const recentSoldCars = soldCars?.data
    ? soldCars.data.slice(0, 4).map((car: SoldCar) => ({
        id: car._id || car.id || '',
        title: car.title || `${car.year || 0} ${car.make || 'Unknown'} ${car.model || 'Unknown'}`,
        year: car.year || 0,
        make: car.make || 'Unknown',
        model: car.model || 'Unknown',
        imageUrl: car.imageUrl || car.images?.[0] || car.image || car.photos?.[0] || '/placeholder-car.jpg',
        winningBid: car.highestBid || car.currentBid || car.finalBid || 0,
        totalBids: car.bids || car.bidCount || car.totalBids || 0,
        location: car.location || '',
        noReserve: car.noReserve || false,
        specs: car.specs || [],
        approvalStatus: (car.approvalStatus || 'sold') as 'sold' | 'ended',
        soldDate: car.soldDate || car.auctionEndDate || car.updatedAt,
      }))
    : [];

  return (
    <div className="bg-black min-h-screen w-full">
      <Header />
      <FeaturedCarCarousel />
      <CarFilters onFilterChange={handleFilterChange} filters={filters} />
      <div className="w-full bg-black px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Current Auctions Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Current Auctions</h2>
            {error && <p className="text-red-500">Error: {error.message}</p>}
            {!isLoading && allCars.length === 0 && !error && (
              <p className="text-white">No cars found.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading && page === 1 ? (
                renderSkeletons()
              ) : (
                allCars
                  .filter((car) => car.approvalStatus === 'approved')
                  .map((car) => (
                    <CarCard key={car.id} {...car} endAuction={endAuction} />
                  ))
              )}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="bg-[#3BE188] hover:bg-[#2dd077] text-black font-semibold px-8 py-3 rounded-full"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </section>

          {/* Recent Sold Cars Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Recently Sold</h2>
            {soldCarsError && (
              <p className="text-red-500">Error loading sold cars: {soldCarsError.message}</p>
            )}
            {soldCarsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {renderSoldCarSkeletons()}
              </div>
            ) : recentSoldCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentSoldCars.map((car) => (
                  <EndedCarCard key={car.id} {...car} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-400 text-lg">No recently sold cars available.</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Why Choose Auto Auction Section */}
      <div className="w-full bg-black">
        <section className="py-16 px-6 w-full">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12 text-white">Why Choose Auto Auction</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-zinc-800 p-8 rounded-lg">
                <div className="bg-[#3BE188]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#3BE188] text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Enthusiast Focus</h3>
                <p className="text-gray-200">
                  We specialize in enthusiast vehicles that are engaging to drive and own.
                </p>
              </div>
              <div className="bg-zinc-800 p-8 rounded-lg">
                <div className="bg-[#3BE188]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#3BE188] text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Curated Selection</h3>
                <p className="text-gray-200">
                  Every vehicle is carefully reviewed and selected by our team of experts.
                </p>
              </div>
              <div className="bg-zinc-800 p-8 rounded-lg">
                <div className="bg-[#3BE188]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#3BE188] text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Community Driven</h3>
                <p className="text-gray-200">
                  Join a passionate community of car enthusiasts who share your passion.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Call to Action Section */}
      <div className="w-full bg-gradient-to-r from-zinc-900 to-black">
        <section className="py-20 px-6 w-full">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Have a special car to sell?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
              List your vehicle on Auto Auction and reach thousands of passionate car enthusiasts.
            </p>
            <div className="flex justify-center">
              <Button
                className="bg-[#3BE188] hover:bg-[#2dd077] text-black font-semibold px-8 py-6 text-lg rounded-full"
              >
                Start Selling Today
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}