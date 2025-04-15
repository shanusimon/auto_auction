import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import CustomerTable from "@/components/admin/Cutomers/CustomerTable";
import { Search } from "lucide-react";
import {debounce} from "lodash"
import { useGetAllCustomersQuery } from "@/hooks/admin/useAllUsers";
import { getAllCustomers } from "@/services/admin/adminService";
import { IClient } from "@/types/Types";
import { Pagination1 } from "./Pagination1";
import { useUpdateCustomerStatus } from "@/hooks/admin/useUpdateCustomerStatus";


const AdminCustomers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch,setdebouncedSearch] = useState(searchQuery);
  const [currentPage,setCurrentPage] = useState(1);

  const limit = 10;

  const {mutate:updateCustomerStatus}= useUpdateCustomerStatus(currentPage,limit,debouncedSearch)

  useEffect(()=>{
    const handler = debounce(()=>setdebouncedSearch(searchQuery),300);
    handler();
    return ()=>handler.cancel();
  },[searchQuery]);

  const {data,isLoading,isError} = useGetAllCustomersQuery(
    getAllCustomers,
    currentPage,
    limit,
    debouncedSearch
  )
  const filteredCustomers = (data?.users ?? []) as IClient[];
  const totalPages = data?.totalPages || 1


  const handleBlockStatus = (userId: string) => {
    updateCustomerStatus(userId)
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Sidebar />

      <div
        style={{
          marginLeft: "250px",
          width: "calc(100% - 250px)",
          transition: "margin-left 0.3s ease, width 0.3s ease",
        }}
      >
        <Header title="Customers" />

        <main
          style={{
            padding: "24px",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Customer Management
            </h2>

            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <div
                style={{
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
                  placeholder="Search customers..."
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
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading customers...</p>
            </div>
          ):isError?(
            <div className="text-center py-8">
              <p className="text-gray-500">
                Failed to load customers...
              </p>
            </div>
          ) :filteredCustomers.length === 0 ?(
            <div className="text-center py-8">
            <p className="text-gray-500">No customers found.</p>
            </div>
          ):(
            <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
            }}
          >
            <CustomerTable
              customers={filteredCustomers}
              onBlockStatusChange={handleBlockStatus}
            />
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
              Showing {filteredCustomers.length}
              customers
            </span>

            <div
              style={{
                display: "flex",
                gap: "8px",
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

export default AdminCustomers;