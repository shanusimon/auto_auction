import { Route,Routes } from "react-router-dom";
import { ProtectedRoutes } from "@/routes/protected/AuthRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import UnauthorizedPage from "@/pages/common/UnauthorizedPage";
import { Navigate } from "react-router-dom";
import AdminSellers from "@/pages/admin/AdminSellerRequests";
import CarApprovals from "@/pages/admin/AdminCarApprovals";
import AdminActiveSellers from "@/pages/admin/AdminSeller";

export function AdminRoutes(){
    return (
        <Routes>
          <Route 
            path="/dashboard" 
            element={<ProtectedRoutes allowedRoles={["admin"]} element={<AdminDashboard/>}/>} 
          />
          <Route 
            path="/customers" 
            element={<ProtectedRoutes allowedRoles={["admin"]} element={<AdminCustomers/>}/>} 
          />
           <Route 
            path="/seller-request" 
            element={<ProtectedRoutes allowedRoles={["admin"]} element={<AdminSellers/>}/>} 
          />
          <Route
          path="/sellers"
          element={<ProtectedRoutes allowedRoles={["admin"]} element={<AdminActiveSellers/>}/>}
          />
            <Route 
            path="/car-approvals" 
            element={<ProtectedRoutes allowedRoles={["admin"]} element={<CarApprovals/>}/>} 
          />
          <Route 
            path="/unauthorized" 
            element={<UnauthorizedPage />} 
          />
          {/* Default redirect for unmatched admin routes */}
          <Route 
            path="*" 
            element={<Navigate to="/admin/dashboard" replace />} 
          />
        </Routes>
      );
}