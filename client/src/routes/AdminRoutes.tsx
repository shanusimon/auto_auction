import { Route,Routes } from "react-router-dom";
import { ProtectedRoutes } from "@/pages/protected/AuthRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import UnauthorizedPage from "@/pages/common/UnauthorizedPage";
import { Navigate } from "react-router-dom";

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