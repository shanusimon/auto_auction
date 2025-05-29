import { useState } from 'react';
import UserSidebar from '@/components/user/Sidebar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, ExternalLink, Clock, CreditCard, Calendar, CheckCircle, AlertCircle, Loader2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CarDetailDialog from '@/components/user/CarDetailsDialog';
import { useGetAllBids } from '@/hooks/user/useGetAllBids';
import { useWonAuction } from '@/hooks/user/useGetWonAcution';
import Header from '@/components/header/Header';
import { createCheckOut } from '@/services/payment/paymentServices';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const MyBids: React.FC = () => {
  // State management
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState<string | null>(null);


  const { data: bids, isLoading: bidsLoading, isError: bidsError } = useGetAllBids();
  const { data: wonAuction, isLoading: wonAuctionLoading, isError: wonAuctionError } = useWonAuction();


  const getBidStatus = (bid: any) => {
    if (!bid.carId || !bid.carId.highestBid) return 'unknown';

    if (bid.carId.auctionEndTime && new Date(bid.carId.auctionEndTime) < new Date()) {
      return bid.amount >= bid.carId.highestBid ? 'won' : 'outbid';
    }

    return bid.amount >= bid.carId.highestBid ? 'active' : 'outbid';
  };

  const formatTimeAgo = (timestamp: string) => {
    if (!timestamp) return 'Unknown';

    const now = new Date();
    const bidTime = new Date(timestamp);
    const diffMs = now.getTime() - bidTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const renderBidStatus = (status: string) => {
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

  const handleViewCar = (bid: any) => {
    setSelectedCar(bid.carId);
    setIsDetailOpen(true);
  };

 const handlePayment = async (auctionId: string) => {
  setIsPaymentLoading(auctionId);
  try {
    const response = await createCheckOut(auctionId);
    console.log(response);

    const sessionId = response.data.sessionId;

    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    toast.error(error.message || 'Failed to initiate payment');
  } finally {
    setIsPaymentLoading(null);
  }
};

  // Loading state
  if (bidsLoading || wonAuctionLoading) {
    return (
      <>
    <Header/>
      <div className="flex h-screen bg-zinc-900">
        <UserSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="flex items-center space-x-3 text-white">
            <Loader2 size={24} className="animate-spin text-[#3BE188]" />
            <span className="text-lg">Loading your bids...</span>
          </div>
        </div>
      </div>
            </>
    );
  }

  // Error state
  if (bidsError || wonAuctionError) {
    return (
      <div className="flex h-screen bg-zinc-900">
        <UserSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-white flex flex-col items-center space-y-4">
            <AlertCircle size={48} className="text-red-500" />
            <h2 className="text-2xl font-semibold">Error Loading Data</h2>
            <p className="text-gray-400 text-center max-w-md">
              There was a problem loading your bid data. Please try refreshing the page.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#3BE188] hover:bg-[#2da86f] text-black font-medium"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Process data
  const bidsList = bids?.data || [];
  const wonAuctionsList = wonAuction?.data || [];

  const activeBids = bidsList.filter(bid => getBidStatus(bid) === 'active');
  const outbidBids = bidsList.filter(bid => getBidStatus(bid) === 'outbid');
  const otherBids = bidsList.filter(bid => getBidStatus(bid) !== 'active' && getBidStatus(bid) !== 'won');

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-zinc-900">
        <UserSidebar />
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">My Bids</h1>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-zinc-800">
                <TabsTrigger value="all" className="text-white data-[state=active]:bg-[#3BE188] data-[state=active]:text-black">
                  All Bids ({bidsList.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="text-white data-[state=active]:bg-[#3BE188] data-[state=active]:text-black">
                  Active ({activeBids.length})
                </TabsTrigger>
                <TabsTrigger value="won" className="text-white data-[state=active]:bg-[#3BE188] data-[state=active]:text-black">
                  Won Auctions ({wonAuctionsList.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="text-white data-[state=active]:bg-[#3BE188] data-[state=active]:text-black">
                  History ({otherBids.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader className="border-b border-zinc-700">
                    <div className="flex items-center">
                      <div className="mr-2 p-2 bg-zinc-700 rounded">
                        <Car size={18} className="text-[#3BE188]" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">All Bidding Activity</h2>
                    </div>
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
                              <TableHead className="text-white">Car</TableHead>
                              <TableHead className="text-white">Your Bid</TableHead>
                              <TableHead className="text-white">When</TableHead>
                              <TableHead className="text-white">Status</TableHead>
                              <TableHead className="text-white text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bidsList.map((bid) => (
                              <TableRow key={bid._id} className="border-zinc-700">
                                <TableCell className="font-medium text-white">
                                  {bid.carId?.year} {bid.carId?.make} {bid.carId?.model}
                                </TableCell>
                                <TableCell className="text-[#3BE188]">
                                  ${(bid.amount / 100)?.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  <div className="flex items-center gap-1">
                                    <Clock size={14} className="text-gray-400" />
                                    {formatTimeAgo(bid.createdAt)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {renderBidStatus(getBidStatus(bid))}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="hover:bg-zinc-700 text-gray-200"
                                    onClick={() => handleViewCar(bid)}
                                    disabled={!bid.carId}
                                  >
                                    <ExternalLink size={16} className="mr-1" />
                                    View Car
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="active" className="mt-6">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader className="border-b border-zinc-700">
                    <div className="flex items-center">
                      <div className="mr-2 p-2 bg-zinc-700 rounded">
                        <Clock size={18} className="text-[#3BE188]" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Active Bids</h2>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {activeBids.length === 0 ? (
                      <div className="py-16 text-center text-gray-400">
                        <Clock size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No active bids found.</p>
                        <p className="mt-2">Your active bids will appear here.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-zinc-700">
                              <TableHead className="text-white">Car</TableHead>
                              <TableHead className="text-white">Your Bid</TableHead>
                              <TableHead className="text-white">When</TableHead>
                              <TableHead className="text-white">Status</TableHead>
                              <TableHead className="text-white text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activeBids.map((bid) => (
                              <TableRow key={bid._id} className="border-zinc-700">
                                <TableCell className="font-medium text-white">
                                  {bid.carId?.year} {bid.carId?.make} {bid.carId?.model}
                                </TableCell>
                                <TableCell className="text-[#3BE188]">
                                  ${(bid.amount / 100)?.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  <div className="flex items-center gap-1">
                                    <Clock size={14} className="text-gray-400" />
                                    {formatTimeAgo(bid.createdAt)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {renderBidStatus(getBidStatus(bid))}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="hover:bg-zinc-700 text-gray-200"
                                    onClick={() => handleViewCar(bid)}
                                    disabled={!bid.carId}
                                  >
                                    <ExternalLink size={16} className="mr-1" />
                                    View Car
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="won" className="mt-6">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader className="border-b border-zinc-700">
                    <div className="flex items-center">
                      <div className="mr-2 p-2 bg-zinc-700 rounded">
                        <CheckCircle size={18} className="text-[#3BE188]" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Won Auctions</h2>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {wonAuctionsList.length === 0 ? (
                      <div className="py-16 text-center text-gray-400">
                        <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No won auctions yet.</p>
                        <p className="mt-2">Your won auctions will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 p-6">
                        {wonAuctionsList.map((auction) => {
                          const winningAmount = auction.amount
                          const platformFee = auction.platformCharge;
                          const totalAmount = winningAmount + platformFee;

                          return (
                            <Card key={auction._id} className="bg-zinc-700 border-zinc-600">
                              <CardContent className="p-6">
                                <div className="grid md:grid-cols-3 gap-6">
                                  {/* Left Column - Car Details and Pricing */}
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white mb-3">
                                      {auction.carId?.year} {auction.carId?.make} {auction.carId?.model}
                                    </h3>
                                    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
                                      <h4 className="text-white font-medium mb-3 text-sm">Pricing Details</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-300">Winning Bid:</span>
                                          <span className="text-[#3BE188] font-medium">${winningAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-300">Platform Fee (5%):</span>
                                          <span className="text-white">${platformFee.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-zinc-600 pt-2 mt-2">
                                          <span className="text-gray-300 font-medium">Total Amount:</span>
                                          <span className="text-[#3BE188] font-bold">${totalAmount.toLocaleString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Middle Column - Auction Details */}
                                  <div className="space-y-4">
                                    <h4 className="text-white font-medium text-sm">Auction Information</h4>
                                    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <Calendar size={16} className="text-gray-400" />
                                          <div>
                                            <p className="text-xs text-gray-400">Auction Ended</p>
                                            <p className="text-white text-sm">
                                              {auction.carId?.auctionEndTime ? new Date(auction.carId.auctionEndTime).toLocaleDateString() : 'N/A'}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <CreditCard size={16} className="text-gray-400" />
                                          <div>
                                            <p className="text-xs text-gray-400">Payment Due</p>
                                            <p className="text-white text-sm">7 days from auction end</p>
                                          </div>
                                        </div>
                                        <div className="pt-2">
                                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            auction.paymentStatus === 'succeeded'
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-yellow-100 text-yellow-800'
                                          }`}>
                                            {auction.paymentStatus === 'succeeded' ? 'Paid' : 'Pending'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="hover:bg-zinc-600 text-gray-200 flex-1"
                                        onClick={() => {
                                          setSelectedCar(auction.carId);
                                          setIsDetailOpen(true);
                                        }}
                                        disabled={!auction.carId}
                                      >
                                        <ExternalLink size={16} className="mr-1" />
                                        View Car
                                      </Button>
                                      {auction.paymentStatus !== 'succeeded' && (
                                        <Button
                                          size="sm"
                                          className="bg-[#3BE188] hover:bg-[#2da86f] text-black flex-1"
                                          onClick={() => handlePayment(auction._id)}
                                          disabled={isPaymentLoading === auction._id}
                                        >
                                          {isPaymentLoading === auction._id ? (
                                            <Loader2 size={16} className="mr-1 animate-spin" />
                                          ) : (
                                            <CreditCard size={16} className="mr-1" />
                                          )}
                                          Pay Now
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  {/* Right Column - Seller Details */}
                                  <div className="space-y-4">
                                    <h4 className="text-white font-medium text-sm">Seller Information</h4>
                                    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className="relative">
                                          <img
                                            src={auction.sellerId?.profileImage || "/default-avatar.png"}
                                            alt="Seller Profile"
                                            className="w-12 h-12 rounded-full object-cover border-2 border-[#3BE188]"
                                          />
                                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-800"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h5 className="text-white font-medium text-sm truncate">
                                            {auction.sellerId?.name || "N/A"}
                                          </h5>
                                          <p className="text-[#3BE188] text-xs">Verified Seller</p>
                                        </div>
                                      </div>
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                          <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                                            <Mail size={12} className="text-blue-400" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-400">Email</p>
                                            <p className="text-white text-sm font-medium truncate">
                                              {auction.sellerId?.email || "N/A"}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center flex-shrink-0">
                                            <Phone size={12} className="text-green-400" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs text-gray-400">Phone</p>
                                            <p className="text-white text-sm font-medium">
                                              {auction.sellerId?.phone || "N/A"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader className="border-b border-zinc-700">
                    <div className="flex items-center">
                      <div className="mr-2 p-2 bg-zinc-700 rounded">
                        <Car size={18} className="text-[#3BE188]" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Bid History</h2>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {otherBids.length === 0 ? (
                      <div className="py-16 text-center text-gray-400">
                        <Car size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No bid history found.</p>
                        <p className="mt-2">Your completed bids will appear here.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-zinc-700">
                              <TableHead className="text-white">Car</TableHead>
                              <TableHead className="text-white">Your Bid</TableHead>
                              <TableHead className="text-white">When</TableHead>
                              <TableHead className="text-white">Status</TableHead>
                              <TableHead className="text-white text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {otherBids.map((bid) => (
                              <TableRow key={bid._id} className="border-zinc-700">
                                <TableCell className="font-medium text-white">
                                  {bid.carId?.year} {bid.carId?.make} {bid.carId?.model}
                                </TableCell>
                                <TableCell className="text-[#3BE188]">
                                  ${(bid.amount / 100)?.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  <div className="flex items-center gap-1">
                                    <Clock size={14} className="text-gray-400" />
                                    {formatTimeAgo(bid.createdAt)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {renderBidStatus(getBidStatus(bid))}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="hover:bg-zinc-700 text-gray-200"
                                    onClick={() => handleViewCar(bid)}
                                    disabled={!bid.carId}
                                  >
                                    <ExternalLink size={16} className="mr-1" />
                                    View Car
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-zinc-800 border-zinc-700 p-4">
                <div className="text-center">
                  <span className="text-2xl font-bold text-[#3BE188]">{bidsList.length}</span>
                  <p className="text-gray-300 mt-1">Total Bids</p>
                </div>
              </Card>
              <Card className="bg-zinc-800 border-zinc-700 p-4">
                <div className="text-center">
                  <span className="text-2xl font-bold text-[#3BE188]">{activeBids.length}</span>
                  <p className="text-gray-300 mt-1">Active Bids</p>
                </div>
              </Card>
              <Card className="bg-zinc-800 border-zinc-700 p-4">
                <div className="text-center">
                  <span className="text-2xl font-bold text-[#3BE188]">{wonAuctionsList.length}</span>
                  <p className="text-gray-300 mt-1">Auctions Won</p>
                </div>
              </Card>
            </div>
          </div>
        </div>

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