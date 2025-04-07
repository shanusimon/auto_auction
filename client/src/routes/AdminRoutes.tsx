import { Route,Routes } from "react-router-dom";
import { ProtectedRoutes } from "@/routes/protected/AuthRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import UnauthorizedPage from "@/pages/common/UnauthorizedPage";
import { Navigate } from "react-router-dom";
import AdminSellers from "@/pages/admin/AdminSellerRequests";

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