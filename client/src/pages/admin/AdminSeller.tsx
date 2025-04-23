import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import SellerTable from "@/components/admin/SellerTable";
import { Search } from "lucide-react";
import { debounce } from "lodash";
import { useSellers } from "@/hooks/admin/useSellerRequest";
import { useUpdateSellerActiveStatus } from "@/hooks/admin/useUpdateSellerStatus";
import { ISellerEntity } from "@/types/Types";
import { Pagination1 } from "./Pagination1";
import { getAllSellerDetails } from "@/services/admin/adminService";

const AdminActiveSellers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10;

  const { mutate: updateSellerStatus } = useUpdateSellerActiveStatus(currentPage, limit, debouncedSearch);

  useEffect(() => {
    const handler = debounce(() => setDebouncedSearch(searchQuery), 300);
    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  const { data, isLoading, isError } = useSellers(
    getAllSellerDetails,
    currentPage,
    limit,
    debouncedSearch
  );

  const filteredSellers = (data?.sellers ?? []) as unknown as ISellerEntity[];
  const totalPages = data?.totalPage || 1;

  const handleBlockStatus = (userId: string) => {
    updateSellerStatus(userId);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-[250px] w-[calc(100%-250px)] transition-all">
        <Header title="Sellers" />

        <main className="p-6 max-w-[1400px] mx-auto">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
            <h2 className="text-2xl font-bold">Seller Management</h2>

            <div className="relative">
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 px-3 border rounded-md w-64 text-sm outline-none"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading sellers...</div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">Failed to load sellers.</div>
          ) : filteredSellers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No sellers found.</div>
          ) : (
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <SellerTable sellers={filteredSellers} onBlockStatusChange={handleBlockStatus} />
            </div>
          )}

          <div className="flex justify-between items-center py-4 text-sm text-gray-500">
            <span>Showing {filteredSellers.length} sellers</span>
            <div className="mt-6 flex justify-center items-center">
              <Pagination1
                currentPage={currentPage}
                totalPages={totalPages}
                onPageNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                onPagePrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminActiveSellers;
