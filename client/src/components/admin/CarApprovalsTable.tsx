import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Check, X, Eye, Car, MapPin, Fuel, ChevronLeft, ChevronRight, X as CloseIcon, Mail, Phone, Calendar } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ICarEntity } from '@/types/CarFormTypes';
import { useSellerDetails } from '@/hooks/admin/useSellerDetails';
import { Skeleton } from '@/components/ui/skeleton';

interface CarApprovalTableProps {
  cars: ICarEntity[];
  onApprove: (carId: string, sellerEmail: string) => void;
  onReject: (carId: string, sellerEmail: string, reason: string) => void;
}

const CarApprovalTable: React.FC<CarApprovalTableProps> = ({ 
  cars, 
  onApprove, 
  onReject 
}) => {
  const { toast } = useToast();
  const [selectedCar, setSelectedCar] = useState<ICarEntity | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproving, setIsApproving] = useState<string | null>(null);

  const { data: sellerDetails, isLoading: isLoadingSellerDetails } = useSellerDetails(
    selectedCar?.sellerId || ''
  );

  const handleApprove = (carId: string) => {
    if (isLoadingSellerDetails) {
      toast({
        title: "Please Wait",
        description: "Fetching seller details...",
        variant: "default",
      });
      return;
    }
    if (sellerDetails?.userDetails.email) {
      onApprove(carId, sellerDetails.userDetails.email);
      setDetailsOpen(false);
      setIsApproving(null);
    } else {
      toast({
        title: "Error",
        description: "Seller email not found",
        variant: "destructive",
      });
      setIsApproving(null);
    }
  };

  const initiateApprove = (car: ICarEntity) => {
    setSelectedCar(car);
    setIsApproving(car._id || null);
  };

  const handleReject = () => {
    if (selectedCar?._id && sellerDetails?.userDetails.email && rejectionReason.trim()) {
      onReject(selectedCar._id, sellerDetails.userDetails.email, rejectionReason);
      setRejectionModalOpen(false);
      setDetailsOpen(false);
      setRejectionReason('');
    } else {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection or seller email not found",
        variant: "destructive",
      });
    }
  };

  const viewDetails = (car: ICarEntity) => {
    setSelectedCar(car);
    setDetailsOpen(true);
  };

  const openImageViewer = (index: number) => {
    if (selectedCar && selectedCar.images.length > 0) {
      setCurrentImageIndex(index);
      setImageViewerOpen(true);
    }
  };

  const nextImage = () => {
    if (selectedCar) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === selectedCar.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedCar) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? selectedCar.images.length - 1 : prevIndex - 1
      );
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  useEffect(() => {
    if (isApproving && selectedCar?._id && !isLoadingSellerDetails) {
      handleApprove(isApproving);
    }
  }, [isApproving, selectedCar, isLoadingSellerDetails, sellerDetails]);

  const renderSellerSection = () => {
    if (!selectedCar?.sellerId) return null;
    
    const userDetails = sellerDetails?.userDetails;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seller Information</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingSellerDetails ? (
            <div className="flex items-start space-y-2">
              <Skeleton className="h-16 w-16 rounded-full mr-4" />
              <div className="flex-1">
                <Skeleton className="h-6 w-36 mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full md:col-span-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          ) : userDetails ? (
            <div className="flex items-start">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage src={userDetails.profileImage} alt={userDetails.name || 'Seller'} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userDetails.name ? userDetails.name.toUpperCase().slice(0, 2) : 'NA'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {userDetails.name || 'Unnamed Seller'}
                  {userDetails.isProfessionalDealer && (
                    <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                      Professional Dealer
                    </Badge>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{userDetails.email || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{userDetails.phone || 'Not provided'}</span>
                  </div>
                  {userDetails.address && (
                    <div className="flex items-center gap-1 md:col-span-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{userDetails.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Joined {userDetails.joinedDate ? new Date(userDetails.joinedDate).toLocaleDateString() : 'Unknown date'}
                    </span>
                  </div>
                  {userDetails.identificationNumber && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">ID:</span>
                      <span className="text-sm">{userDetails.identificationNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Seller information not available
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-medium">No.</TableHead>
              <TableHead className="font-medium">Car</TableHead>
              <TableHead className="font-medium">Year</TableHead>
              <TableHead className="font-medium">Mileage</TableHead>
              <TableHead className="font-medium">Body Type</TableHead>
              <TableHead className="font-medium">Location</TableHead>
              <TableHead className="font-medium">Reserved Price</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map((car, index) => (
              <TableRow key={car._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{car.make} {car.model}</span>
                    <span className="text-xs text-gray-500">{car.title}</span>
                  </div>
                </TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>{car.mileage.toLocaleString()} km</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {car.bodyType}
                  </Badge>
                </TableCell>
                <TableCell>{car.location}</TableCell>
                <TableCell>{formatPrice(car.reservedPrice)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-blue-500 text-blue-500 hover:bg-blue-50"
                      onClick={() => viewDetails(car)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-green-500 text-green-500 hover:bg-green-50"
                      onClick={() => initiateApprove(car)}
                      disabled={isApproving === car._id}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => {
                        setSelectedCar(car);
                        setRejectionModalOpen(true);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Car Approval Details</DialogTitle>
            <DialogDescription>
              Review the car details before approving for auction.
            </DialogDescription>
          </DialogHeader>

          {selectedCar && (
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6 mt-4">
                {selectedCar.sellerId && renderSellerSection()}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedCar.images && selectedCar.images.length > 0 ? (
                          selectedCar.images.slice(0, 4).map((image, index) => (
                            <div 
                              key={index} 
                              className="relative aspect-video rounded-md overflow-hidden bg-gray-100 cursor-pointer transition-all hover:opacity-90"
                              onClick={() => openImageViewer(index)}
                            >
                              <img 
                                src={image} 
                                alt={`${selectedCar.make} ${selectedCar.model} - view ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 aspect-video rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                            <Car className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {selectedCar.images && selectedCar.images.length > 4 && (
                        <p className="text-sm text-center mt-2 text-gray-500">
                          +{selectedCar.images.length - 4} more images
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Car Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Title</dt>
                          <dd className="font-medium">{selectedCar.title}</dd>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Make</dt>
                            <dd>{selectedCar.make}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Model</dt>
                            <dd>{selectedCar.model}</dd>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Year</dt>
                            <dd>{selectedCar.year}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Mileage</dt>
                            <dd>{selectedCar.mileage.toLocaleString()} km</dd>
                          </div>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Body Type</dt>
                          <dd className="capitalize">{selectedCar.bodyType}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Location</dt>
                          <dd className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            {selectedCar.location}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Reserved Price</dt>
                          <dd className="font-medium text-green-600">{formatPrice(selectedCar.reservedPrice)}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Fuel Type</dt>
                            <dd className="flex items-center gap-1">
                              <Fuel className="h-3.5 w-3.5 text-gray-400" />
                              <span className="capitalize">{selectedCar.fuel}</span>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Transmission</dt>
                            <dd className="capitalize">{selectedCar.transmission}</dd>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Exterior Color</dt>
                            <dd className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full inline-block" 
                                style={{ 
                                  backgroundColor: selectedCar.exteriorColor.toLowerCase() !== 'other' ? selectedCar.exteriorColor : '#ccc',
                                  border: '1px solid #ddd' 
                                }}></span>
                              {selectedCar.exteriorColor}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Interior Color</dt>
                            <dd className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full inline-block" 
                                style={{ 
                                  backgroundColor: selectedCar.interiorColor.toLowerCase() !== 'other' ? selectedCar.interiorColor : '#ccc',
                                  border: '1px solid #ddd' 
                                }}></span>
                              {selectedCar.interiorColor}
                            </dd>
                          </div>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Auction Duration</dt>
                          <dd>{selectedCar.auctionDuration}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {selectedCar.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => setRejectionModalOpen(true)}
                  >
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => selectedCar._id && handleApprove(selectedCar._id)}
                    disabled={isApproving === selectedCar._id || isLoadingSellerDetails}
                  >
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Car Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this car submission. This will be sent to the seller.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="rejection-reason" className="mb-2 block">Rejection Reason</Label>
            <Textarea 
              id="rejection-reason"
              placeholder="Enter detailed reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setRejectionModalOpen(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || isLoadingSellerDetails}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
          
      <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 bg-black border-none overflow-hidden">
          {selectedCar && selectedCar.images && selectedCar.images.length > 0 && (
            <div className="relative h-full">
              <div className="absolute top-4 right-4 z-10">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-black/30 border-none text-white hover:bg-black/50"
                  onClick={() => setImageViewerOpen(false)}
                >
                  <CloseIcon className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center h-full">
                <img 
                  src={selectedCar.images[currentImageIndex]} 
                  alt={`${selectedCar.make} ${selectedCar.model} - full view`}
                  className="max-h-[80vh] max-w-full object-contain"
                />
              </div>
              
              {selectedCar.images.length > 1 && (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-black/30 border-none text-white hover:bg-black/50"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-black/30 border-none text-white hover:bg-black/50"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              
              <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                <span className="px-3 py-1 bg-black/50 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedCar.images.length}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CarApprovalTable;