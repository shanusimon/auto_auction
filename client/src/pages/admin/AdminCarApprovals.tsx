import { useEffect, useState } from 'react';
import Header from '@/components/admin/Header';
import Sidebar from '@/components/admin/Sidebar';
import CarApprovalTable from '@/components/admin/CarApprovalsTable';
import { Car } from 'lucide-react';
import { ICarEntity } from '@/types/CarFormTypes';
import { useGetAllCarRequests } from '@/hooks/admin/useGetAllCarRequest';
import { getAllCarRequests } from '@/services/admin/adminService';
import { Search } from 'lucide-react';
import { Pagination1 } from './Pagination1';
import { debounce } from 'lodash';
import { useToast } from '@/hooks/use-toast';
import { useUpdateCarStatus} from '@/hooks/admin/useUpdateCarStatus';

const CarApprovals: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const {mutate: updateCarStatus,isPending} = useUpdateCarStatus();
  
  useEffect(() => {
    const handler = debounce(() => setDebouncedSearch(searchQuery), 300);
    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  const { data, isLoading, isError, refetch } = useGetAllCarRequests(
    getAllCarRequests,
    currentPage,
    limit,
    debouncedSearch
  );

  const filteredCars = (data?.cars ?? []) as ICarEntity[];
  const totalPages = data?.total || 1;

  const handleApprove = (carId: string, sellerEmail: string) => {
    updateCarStatus(
      { carId, status: "approved", sellerEmail },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Car has been approved and the seller has been notified.",
          });
          refetch();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to approve car request. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleReject = (
    carId: string,
    sellerEmail: string,
    reason: string
  ) => {
    updateCarStatus(
      { carId, status: "rejected", sellerEmail, rejectionReason: reason },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Car has been rejected and the seller has been notified with the reason.",
          });
          refetch();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to reject car request. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-[250px]">
        <Header title="Car Approvals" />
        <div
          style={{
            marginTop: "20px",
            marginLeft: "25px",
            position: "relative",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              top: "50%",
              left: "12px",
              transform: "translateY(-50%)",
              color: "#6B7280",
            }}
          />
          <input
            type="text"
            placeholder="Search cars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "10px 12px 10px 40px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              fontSize: "14px",
              width: "250px",
              outline: "none",
            }}
          />
        </div>
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Pending Car Approval Requests</h2>
            </div>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading car requests...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Failed to load car requests. Please try again.
                </p>
              </div>
            ) :
              filteredCars.length > 0 ? (
                <CarApprovalTable
                  cars={filteredCars}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ) : (
                <div className="text-center py-10">
                  <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No pending car approvals</h3>
                  <p className="mt-1 text-sm text-gray-500">All car submissions have been processed.</p>
                </div>
              )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 0",
                fontSize: "14px",
                color: "#6B7280",
              }}
            >
              <span>
                Showing {filteredCars.length} cars
              </span>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <div className="flex justify-center items-center">
                  <Pagination1
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    onPagePrev={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CarApprovals;