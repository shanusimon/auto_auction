import  { useState } from 'react';
import UserSidebar from '@/components/user/Sidebar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Car, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CarDetailDialog from '@/components/user/CarDetailsDialog';
import Header from '@/components/header/Header';
import { motion } from 'framer-motion';
import { useGetAllBids } from '@/hooks/user/useGetAllBids';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

const MyBids = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { data: bids, isLoading, isError } = useGetAllBids();

  const getBidStatus = (bid) => {
    if (!bid.carId || !bid.carId.highestBid) return 'unknown';
    
    if (bid.carId.auctionEndTime && new Date(bid.carId.auctionEndTime) < new Date()) {
      return bid.amount >= bid.carId.highestBid ? 'won' : 'outbid';
    }
    
    return bid.amount >= bid.carId.highestBid ? 'active' : 'outbid';
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const bidTime = new Date(timestamp);
    const diffMs = now - bidTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const renderBidStatus = (status) => {
    switch (status) {
      case 'active':
        return <span className="text-[#3BE188] font-medium">Active</span>;
      case 'outbid':
        return <span className="text-yellow-500 font-medium">Outbid</span>;
      case 'won':
        return <span className="text-purple-500 font-medium">Won</span>;
      default:
        return <span className="text-gray-400">Unknown</span>;
    }
  };

  const handleViewCar = (bid) => {
    setSelectedCar(bid.carId);
    setIsDetailOpen(true);
  };

  const getActiveBidsCount = () => {
    if (!bids || !bids.data) return 0;
    return bids.data.filter(bid => getBidStatus(bid) === 'active').length;
  };

  const getWonAuctionsCount = () => {
    if (!bids || !bids.data) return 0;
    return bids.data.filter(bid => getBidStatus(bid) === 'won').length;
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex h-screen bg-zinc-900">
          <UserSidebar />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-white">Loading your bids...</div>
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header />
        <div className="flex h-screen bg-zinc-900">
          <UserSidebar />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-white flex flex-col items-center">
              <AlertCircle size={40} className="text-red-500 mb-4" />
              <h2 className="text-xl mb-2">Error Loading Bids</h2>
              <p className="text-gray-400">There was a problem loading your bid data.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const bidsList = bids?.data || [];

  return (
    <>
      <Header />
      <div className="flex h-screen bg-zinc-900">
        <UserSidebar />
        <div className="flex-1 p-8 overflow-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-7xl mx-auto w-full"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-4xl font-bold text-white mb-8"
            >
              My Bids
            </motion.h1>
            
            <motion.div variants={fadeIn}>
              <Card className="bg-zinc-800 border-zinc-700 mb-10 overflow-hidden">
                <CardHeader className="border-b border-zinc-700 py-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center"
                  >
                    <motion.div 
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="mr-3 p-3 bg-zinc-700 rounded"
                    >
                      <Car size={24} className="text-[#3BE188]" />
                    </motion.div>
                    <h2 className="text-2xl font-semibold text-white">Your Bidding Activity</h2>
                  </motion.div>
                </CardHeader>
                <CardContent className="p-0">
                  {bidsList.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                      <Car size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg">You haven't placed any bids yet.</p>
                      <p className="mt-2">Start bidding on your dream cars to see your activity here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-zinc-700">
                            <TableHead className="text-white text-base py-5 pl-6">Car</TableHead>
                            <TableHead className="text-white text-base py-5">Your Bid</TableHead>
                            <TableHead className="text-white text-base py-5">When</TableHead>
                            <TableHead className="text-white text-base py-5">Status</TableHead>
                            <TableHead className="text-white text-base py-5 text-right pr-6">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bidsList.map((bid, index) => (
                            <motion.tr
                              key={bid._id}
                              variants={tableRowVariants}
                              custom={index}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className="border-zinc-700"
                            >
                              <TableCell className="font-medium text-white text-base py-5 pl-6">
                                {bid.carId?.year} {bid.carId?.make} {bid.carId?.model}
                              </TableCell>
                              <TableCell className="text-[#3BE188] text-base py-5">
                                ${bid.amount?.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-gray-300 text-base py-5">
                                <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-gray-400" />
                                  {formatTimeAgo(bid.createdAt)}
                                </div>
                              </TableCell>
                              <TableCell className="text-base py-5">
                                {renderBidStatus(getBidStatus(bid))}
                              </TableCell>
                              <TableCell className="text-right pr-6 py-5">
                                <motion.div whileHover={{ scale: 1.05 }}>
                                  <Button 
                                    size="sm"
                                    variant="ghost" 
                                    className="hover:bg-zinc-700 text-gray-200 px-4 py-2"
                                    onClick={() => handleViewCar(bid)}
                                    disabled={!bid.carId}
                                  >
                                    <ExternalLink size={18} className="mr-2" />
                                    View Car
                                  </Button>
                                </motion.div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { label: "Total Bids", value: bidsList.length },
                { label: "Active Bids", value: getActiveBidsCount() },
                { label: "Auctions Won", value: getWonAuctionsCount() }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 225, 136, 0.1)" }}
                >
                  <Card className="bg-zinc-800 border-zinc-700 p-6">
                    <div className="text-center">
                      <motion.span 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.3, type: "spring" }}
                        className="text-3xl font-bold text-[#3BE188]"
                      >
                        {stat.value}
                      </motion.span>
                      <p className="text-gray-300 mt-2 text-lg">{stat.label}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Car detail dialog */}
        {selectedCar && (
          <CarDetailDialog 
            isOpen={isDetailOpen} 
            onClose={() => setIsDetailOpen(false)} 
            car={selectedCar} 
          />
        )}
      </div>
    </>
  );
};

export default MyBids;