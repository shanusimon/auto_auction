import {Route,Routes} from "react-router-dom";
import { ProtectedRoutes } from "@/routes/protected/AuthRoute";
import { Navigate } from "react-router-dom";
import UserHomePage from "@/pages/user/UserHomePage";
import UnauthorizedPage from "@/pages/common/UnauthorizedPage";
import Profile from "@/pages/user/UserDashboard";
import UserProfile from "@/pages/user/Profile";
import WalletPage from "@/pages/user/Wallet";

export function UserRoutes(){
    return (
        <Routes>
          <Route 
            path="/" 
            element={<ProtectedRoutes allowedRoles={["user"]} element={<UserHomePage/>}/>}
          />
          <Route 
          path="/profile"
           element={<ProtectedRoutes allowedRoles={["user"]} element={<Profile/>}/>}/>
          <Route 
            path="/unauthorized" 
            element={<UnauthorizedPage/>}
          />
          <Route
          path="/user/profile"
          element={<ProtectedRoutes allowedRoles={["user"]} element={<UserProfile/>}/>}/>
           <Route
          path="/user/wallet"
          element={<ProtectedRoutes allowedRoles={["user"]} element={<WalletPage/>}/>}/>
          {/* Default redirect for unmatched user routes */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />}
          />
        </Routes>
      );
}