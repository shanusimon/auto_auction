import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/user/Signup";

import Login from "./pages/user/Login";
import { UserRoutes } from "./routes/ClientRoutes";
import { GuestRoutes } from "./routes/protected/GuestRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import { AdminRoutes } from "./routes/AdminRoutes";
import ForgotPassword from "./pages/common/ForgetPassword";
import ResetPassword from "./pages/common/ResetPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest Routes */}
        <Route path="/signup" element={<GuestRoutes element={<Signup />} />} />
        <Route path="/login" element={<GuestRoutes element={<Login />} />} />
        <Route path="/forgot-password" element={<GuestRoutes element={<ForgotPassword />} />} />
        <Route path="/reset-password/:token" element={<GuestRoutes element={<ResetPassword />} />} />
        {/* User Routes */}
        <Route path="/*" element={<UserRoutes />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<GuestRoutes element={<AdminLogin />} />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};
