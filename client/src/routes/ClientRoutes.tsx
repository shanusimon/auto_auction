import {Route,Routes} from "react-router-dom";
import { ProtectedRoutes } from "@/pages/protected/AuthRoute";
import { Navigate } from "react-router-dom";
import UserHomePage from "@/pages/user/UserHomePage";
import UnauthorizedPage from "@/pages/common/UnauthorizedPage";
import Profile from "@/pages/user/Profile";

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
          {/* Default redirect for unmatched user routes */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />}
          />
        </Routes>
      );
}