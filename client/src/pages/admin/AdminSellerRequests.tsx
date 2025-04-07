import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import SellerRequestTable from '@/components/admin/Cutomers/SellerRequestTable';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter } from 'lucide-react';
import { Pagination1 } from './Pagination1';
import { useGetAllSellerRequestsQuery } from '@/hooks/admin/useSellerRequest';
import { getAllSellerRequest } from '@/services/admin/adminService';
import { debounce } from 'lodash';
import { ISellerEntity } from '@/types/AdminTypes';
import { useUpdateSellerStatus } from '@/hooks/admin/useUpdateSellerRequestStatus';

const AdminSellers: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setdebouncedSearch] = useState(searchQuery);
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();

    const limit = 10;

    useEffect(() => {
        const handler = debounce(() => setdebouncedSearch(searchQuery), 300);
        handler();
        return () => handler.cancel();
    }, [searchQuery]);


    const { data, isLoading, isError } = useGetAllSellerRequestsQuery(
        getAllSellerRequest,
        currentPage,
        limit,
        debouncedSearch
    )

    const { mutate: updateStatus, isPending } = useUpdateSellerStatus(currentPage, limit, debouncedSearch);

    const handleApproveRequest = (sellerId: string) => {
        console.log("This is seller id in seller request",sellerId);
        updateStatus(
            { sellerId, status: "approved" },
            {
                onSuccess: () => {
                    toast({
                        title: "Seller Request Approved",
                        description: "The seller request has been approved successfully.",
                        duration: 3000,
                    });
                },
            }
        );
    };

    const handleRejectRequest = (sellerId: string) => {
        updateStatus(
            { sellerId, status: "rejected" },
            {
                onSuccess: () => {
                    toast({
                        title: "Seller Request Rejected",
                        description: "The seller request has been rejected.",
                        duration: 3000,
                    });
                },
            }
        );
    };
    const filteredRequests = (data?.sellers ?? []) as ISellerEntity[];
    const totalPages = data?.totalPage || 1;

    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: '#f8f9fa'
            }}
        >
            <Sidebar />

            <div
                style={{
                    marginLeft: '250px',
                    width: 'calc(100% - 250px)',
                    transition: 'margin-left 0.3s ease, width 0.3s ease'
                }}
            >
                <Header title="Seller Requests" />

                <main
                    style={{
                        padding: '24px',
                        maxWidth: '1400px',
                        margin: '0 auto'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px',
                            flexWrap: 'wrap',
                            gap: '16px'
                        }}
                    >
                        <h2
                            style={{
                                fontSize: '24px',
                                fontWeight: 'bold'
                            }}
                        >
                            Seller Request Management
                        </h2>

                        <div
                            style={{
                                display: 'flex',
                                gap: '12px'
                            }}
                        >
                            <div
                                style={{
                                    position: 'relative'
                                }}
                            >
                                <Search
                                    size={18}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '12px',
                                        transform: 'translateY(-50%)',
                                        color: '#6B7280'
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        padding: '10px 12px 10px 40px',
                                        border: '1px solid rgba(0, 0, 0, 0.1)',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        width: '250px',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <Filter size={18} style={{ color: '#6B7280' }} />
                            </button>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Loading Seller Request...</p>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                Failed to load Seller Request...
                            </p>
                        </div>
                    ) : (
                        <div
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                                overflow: 'hidden',
                                padding: '16px'
                            }}
                        >
                            <SellerRequestTable
                                sellerRequests={filteredRequests}
                                onApprove={handleApproveRequest}
                                onReject={handleRejectRequest}
                                isPending={isPending}
                            />
                        </div>
                    )}

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px 0',
                            fontSize: '14px',
                            color: '#6B7280'
                        }}
                    >
                        <span>
                            Showing {filteredRequests.length} requests
                        </span>

                        <div
                            style={{
                                display: 'flex',
                                gap: '8px'
                            }}
                        >
                            <div className="mt-6 flex justify-center items-center">
                                <Pagination1
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageNext={() => setCurrentPage(currentPage + 1)}
                                    onPagePrev={() => setCurrentPage(currentPage - 1)}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminSellers;