import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, X, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ISellerEntity } from '@/types/AdminTypes';
import { SellerRequestTableProps } from '@/types/AdminTypes';

const SellerRequestTable: React.FC<SellerRequestTableProps> = ({ 
  sellerRequests, 
  onApprove, 
  onReject ,
  isPending
}) => {
  const [selectedRequest, setSelectedRequest] = useState<ISellerEntity | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
      console.log(selectedRequest);
  const handleApprove = (requestId: string) => {
    onApprove(requestId);
    setDetailsOpen(false);
  };

  const handleReject = (requestId: string) => {
    onReject(requestId);
    setDetailsOpen(false);
  };

  const viewDetails = (request: ISellerEntity) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-medium">No.</TableHead>
              <TableHead className="font-medium">ID</TableHead>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Email</TableHead>
              <TableHead className="font-medium">Phone</TableHead>
              <TableHead className="font-medium">Seller Type</TableHead>
              <TableHead className="font-medium">Request Date</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellerRequests.map((request, index) => (
              <TableRow key={request._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{request.userId?.clientId?.slice(0, 25)}</TableCell>
                <TableCell>{request.userId?.name}</TableCell>
                <TableCell>{request.userId?.email}</TableCell>
                <TableCell>{request.userId?.phone}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    request.isProfessionalDealer 
                      ? "bg-purple-100 text-purple-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {request.isProfessionalDealer ? 'Professional' : 'Regular'}
                  </span>
                </TableCell>
                <TableCell>{formatDate(request.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      onClick={() => viewDetails(request)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-green-500 text-green-500 hover:bg-green-50"
                      onClick={() => request._id && handleApprove(request._id)}
                      disabled={isPending}
                   >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => request._id && handleReject(request._id)}
                      disabled={isPending}
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Seller Request Details</DialogTitle>
            <DialogDescription>
              Review the details of this seller request before making a decision.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd>{selectedRequest.userId?.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd>{selectedRequest.userId?.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd>{selectedRequest.userId?.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd>{selectedRequest.address}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Identification Number</dt>
                        <dd>{selectedRequest.identificationNumber}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Seller Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Seller Type</dt>
                        <dd>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                            selectedRequest.isProfessionalDealer 
                              ? "bg-purple-100 text-purple-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {selectedRequest.isProfessionalDealer ? 'Professional' : 'Regular'}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Request Date</dt>
                        <dd>{formatDate(selectedRequest.createdAt)}</dd>
                      </div>
                      {selectedRequest.isProfessionalDealer && selectedRequest.businessDetails && (
                        <>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                            <dd>{selectedRequest.businessDetails.businessName || 'N/A'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">License Number</dt>
                            <dd>{selectedRequest.businessDetails.licenseNumber || 'N/A'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Tax ID</dt>
                            <dd>{selectedRequest.businessDetails.taxID || 'N/A'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Website</dt>
                            <dd>{selectedRequest.businessDetails.website || 'N/A'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Years In Business</dt>
                            <dd>{selectedRequest.businessDetails.yearsInBusiness || 'N/A'}</dd>
                          </div>
                        </>
                      )}
                    </dl>
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
                  onClick={() => selectedRequest._id && handleReject(selectedRequest._id)}
                  disabled={isPending}
                >
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => selectedRequest._id && handleApprove(selectedRequest._id)}
                  disabled={isPending}
                >
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SellerRequestTable;