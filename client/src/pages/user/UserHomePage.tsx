import { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import FeaturedCar from '@/components/cars/featuredCars';
import { Button } from '@/components/ui/button';
import CarCard from '@/components/cars/Car';
import CarFilters from '@/components/cars/CarFilter';
import { requestNotificationPresmission, listenForForegroundMessages } from '@/services/firebase/messaging';
import { useStoreFCMToken } from '@/hooks/user/userDashboard';
import { toast } from 'sonner';
import { useCars } from '@/hooks/user/useGetCars';
import CarCardSkeleton from '@/components/cars/CarCardSkeleton';
import { useNavigate } from 'react-router-dom';

export default function UserHomePage() {
  const navigate = useNavigate();
  const { mutate } = useStoreFCMToken();
  const [filters, setFilters] = useState({
    year: '',
    bodyType: '',
    fuel: '',
    transmission: '',
    sort: 'ending-soon',
  });
  
  const [page, setPage] = useState(1);
  const [allCars, setAllCars] = useState([]);

  const { data: cars, isLoading, error } = useCars({
    year: filters.year ? Number(filters.year) : undefined,
    bodyType: filters.bodyType || undefined,
    fuel: filters.fuel || undefined,
    transmission: filters.transmission || undefined,
    sort: filters.sort,
    page,
    limit: 20,
  });

  useEffect(() => {
    const setupFCM = async () => {
      const cachedToken = localStorage.getItem('fcmToken');
      const token = await requestNotificationPresmission();
      if (token && token !== cachedToken) {
        mutate(token, {
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
  }, [mutate]);

  useEffect(() => {
    if (cars && Array.isArray(cars)) {
      if (page === 1) {
        setAllCars(cars);
      } else {
        setAllCars((prev) => [...prev, ...cars]);
      }
    }
  }, [cars, page]);

  const handleFilterChange = (newFilters:any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); 
    setAllCars([]);
  };

  const handleClick = (carId:string)=>{
    navigate(`/user/cars/${carId}`)
  }

  const renderSkeletons = () => {
    return Array(4).fill(0).map((_, index) => (
      <CarCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <div className="bg-black min-h-screen w-full">
      <Header />
      <FeaturedCar />
      <CarFilters onFilterChange={handleFilterChange} filters={filters} />
      <div className="w-full bg-black px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Current Auctions</h2>
            {error && <p className="text-red-500">Error: {error.message}</p>}
            {!isLoading && allCars.length === 0 && !error && (
              <p className="text-white">No cars found.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading && page === 1 ? (
                renderSkeletons()
              ) : (
                Array.isArray(allCars) && allCars.map((car) => (
                  <div 
                  key={car.id} 
                  onClick={() => handleClick(car.id)}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <CarCard
                    {...car}
                  />
                </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
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
      <div className="w-full bg-gradient-to-r from-zinc-900 to-black">
        <section className="py-20 px-6 w-full">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Have a special car to sell?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
              List your vehicle on Auto Auction and reach thousands of passionate car enthusiasts.
            </p>
            <Button
              className="bg-[#3BE188] hover:bg-[#2dd077] text-black font-semibold px-8 py-6 text-lg rounded-full"
            >
              Start Selling Today
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}