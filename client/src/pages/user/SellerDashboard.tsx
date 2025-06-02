import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserSidebar from '@/components/user/Sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock, DollarSign, Car, Users } from 'lucide-react';
import CarStatusCard from '@/components/user/CarStatusCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CarDetailDialog from '@/components/user/CarDetailsDialog';
import Header from '@/components/header/Header';
import { useGetSellerStatistics } from '@/hooks/user/useGetSelletStatistics';
import BidHistoryModal from '@/components/user/BidHIstoryModal';


interface Comment {
  text: string;
  author: string;
  timestamp: string;
}


interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  images: string[];
  highestBid?: number;
  bidCount?: number;
  auctionEndTime: string;
  vehicleNumber: string;
  soldPrice?: number;
  updatedAt?: string;
  highestBidderId?: { name: string };
  comments?: Comment[]; // Changed from string[] to Comment[]
  rejectionReason?: string;
}

interface SellerStatistics {
  activeAuction: Car[];
  soldCar: Car[];
  pendingAuction: Car[];
  rejectedCar: Car[];
  totalListing: number;
  totalBids: number;
}


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const statCardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, delay: 0.2 },
  },
};

// Define the SellerDashboard component as a React Functional Component
const SellerDashboard: React.FC = () => {
  // State with types
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [selectedCarForBids, setSelectedCarForBids] = useState<Car | null>(null);

  // Hooks
  const { data: statisticsData } = useGetSellerStatistics() as { data?: SellerStatistics };
  const navigate = useNavigate();

  // Derived data with type safety
  const activeCars: Car[] = statisticsData?.activeAuction || [];
  const soldCars: Car[] = statisticsData?.soldCar || [];
  const pendingCars: Car[] = statisticsData?.pendingAuction || [];
  const rejectedCars: Car[] = statisticsData?.rejectedCar || [];
  const totalListings: number = statisticsData?.totalListing || 0;
  const totalBids: number = statisticsData?.totalBids || 0;
  const totalRevenue: number = soldCars.reduce((sum, car) => sum + (car.soldPrice || 0), 0);
console.log("this is the sold cars for the data",statisticsData)
  // Event handlers with typed parameters
  const handleViewCarDetails = (car: Car): void => {
    setSelectedCar(car);
    setIsDialogOpen(true);
  };

  const viewBidDetails = (car: Car): void => {
    setSelectedCarForBids(car);
    setIsHistoryOpen(true);
  };

  const handleListNewCar = (): void => {
    navigate('/car-listing');
  };

  const renderDashboardContent = () => (
    <motion.div
      className="max-w-5xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white">Seller Dashboard</h1>
        <Button
          className="bg-[#3BE188] hover:bg-[#2dd077] text-black flex items-center gap-2"
          onClick={handleListNewCar}
        >
          <PlusCircle size={18} />
          List New Car
        </Button>
      </motion.div>

      <motion.div className="bg-zinc-800 p-6 rounded-lg mb-8" variants={itemVariants}>
        <h2 className="text-xl font-semibold text-white mb-4">Seller Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <motion.div
            className="bg-zinc-700 p-4 rounded-lg"
            variants={statCardVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm mb-1">Total Listings</p>
              <Car size={20} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-white">{totalListings}</p>
          </motion.div>
          <motion.div
            className="bg-zinc-700 p-4 rounded-lg"
            variants={statCardVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm mb-1">Active Auctions</p>
              <Clock size={20} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-white">{activeCars.length}</p>
          </motion.div>
          <motion.div
            className="bg-zinc-700 p-4 rounded-lg"
            variants={statCardVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm mb-1">Total Bids</p>
              <Users size={20} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-white">{totalBids}</p>
          </motion.div>
          <motion.div
            className="bg-zinc-700 p-4 rounded-lg"
            variants={statCardVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm mb-1">Revenue</p>
              <DollarSign size={20} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-[#3BE188]">${totalRevenue.toLocaleString()}</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-zinc-500">
            <TabsTrigger value="active">Active Auctions</TabsTrigger>
            <TabsTrigger value="sold">Sold Cars</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {activeCars.length > 0 ? (
                activeCars.map((car: Car) => (
                  <motion.div
                    key={car._id}
                    className="bg-zinc-800 border mb-5 border-zinc-700 rounded-lg overflow-hidden"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 aspect-video bg-zinc-900">
                        <img
                          src={car.images?.[0] || '/placeholder.svg'}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-white">
                            {car.year} {car.make} {car.model}
                          </h3>
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-400">Current Bid</p>
                            <p className="text-lg font-semibold text-[#3BE188]">
                              ${(car.highestBid || 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Bids</p>
                            <p className="text-lg font-semibold text-white">{car.bidCount || 0}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Auction Ends</p>
                            <p className="text-lg font-semibold text-white">
                              {new Date(car.auctionEndTime).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Vehicle Number</p>
                            <p className="text-lg font-semibold text-white">{car.vehicleNumber || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Button
                            variant="outline"
                            className="mr-2 bg-transparent border-zinc-600 text-white hover:bg-zinc-700"
                            onClick={() => handleViewCarDetails(car)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="secondary"
                            className="mr-2"
                            onClick={() => viewBidDetails(car)}
                          >
                            Bid History
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="bg-zinc-800 p-6 text-center rounded-lg"
                  variants={itemVariants}
                >
                  <p className="text-gray-400">No active auctions found</p>
                  <Button
                    className="mt-4 bg-[#3BE188] hover:bg-[#2dd077] text-black"
                    onClick={handleListNewCar}
                  >
                    Create Your First Listing
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="sold" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {soldCars.length > 0 ? (
                soldCars.map((car: Car) => (
                  <motion.div
                    key={car._id}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden mb-3"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 aspect-video bg-zinc-900">
                        <img
                          src={car.images?.[0] || '/placeholder.svg'}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-white">
                            {car.year} {car.make} {car.model}
                          </h3>
                          <Badge className="bg-blue-500 text-white">Sold</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-400">Sold For</p>
                            <p className="text-lg font-semibold text-[#3BE188]">
                              ${(car.highestBid || 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Date Sold</p>
                            <p className="text-lg font-semibold text-white">
                              {car.updatedAt ? new Date(car.updatedAt).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Total Bids</p>
                            <p className="text-lg font-semibold text-white">{car.bidCount || 0}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Buyer</p>
                            <p className="text-lg font-semibold text-white">
                              {car.highestBidderId?.name || 'Anonymous'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Button
                            className="bg-transparent border border-zinc-600 text-white hover:bg-zinc-700"
                            onClick={() => handleViewCarDetails(car)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="secondary"
                            className="ml-2"
                            onClick={() => viewBidDetails(car)}
                          >
                            Bid History
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="bg-zinc-800 p-6 text-center rounded-lg"
                  variants={itemVariants}
                >
                  <p className="text-gray-400">No sold cars found</p>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {pendingCars.length > 0 ? (
                pendingCars.map((car: Car) => (
                  <motion.div
                    key={car._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <CarStatusCard
                      car={{
                        id: car._id,
                        make: car.make,
                        model: car.model,
                        year: car.year,
                        status: 'pending' as const,
                        bids: [], // Assuming no bids for pending cars
                        comments: car.comments || [], // Now typed as Comment[]
                        rejectionReason: car.rejectionReason,
                      }}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="bg-zinc-800 p-6 text-center rounded-lg"
                  variants={itemVariants}
                >
                  <p className="text-gray-400">No pending approval cars found</p>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {rejectedCars.length > 0 ? (
                rejectedCars.map((car: Car) => (
                  <motion.div
                    key={car._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <CarStatusCard
                      car={{
                        id: car._id,
                        make: car.make,
                        model: car.model,
                        year: car.year,
                        status: 'rejected' as const,
                        rejectionReason: car.rejectionReason,
                        bids: [], // Assuming no bids for rejected cars
                        comments: car.comments || [], // Now typed as Comment[]
                      }}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="bg-zinc-800 p-6 text-center rounded-lg"
                  variants={itemVariants}
                >
                  <p className="text-gray-400">No rejected cars found</p>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <Header />
      <div className="flex h-screen bg-zinc-900">
        <UserSidebar />
        <div className="flex-1 p-8 overflow-auto">{renderDashboardContent()}</div>

        {selectedCar && (
          <CarDetailDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            car={selectedCar}
          />
        )}

        {selectedCarForBids && (
          <BidHistoryModal
            isOpen={isHistoryOpen}
            onClose={() => {
              setIsHistoryOpen(false);
              setSelectedCarForBids(null);
            }}
            carId={selectedCarForBids._id}
            carName={`${selectedCarForBids.year} ${selectedCarForBids.make} ${selectedCarForBids.model}`}
          />
        )}
      </div>
    </>
  );
};

export default SellerDashboard;