import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/user/Signup";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "sonner";
import Login from "./pages/user/Login";


export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Toaster/>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>    
      </TooltipProvider>
    </BrowserRouter>
  );
}
