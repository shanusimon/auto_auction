import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/user/Signup";
import { TooltipProvider } from "./components/ui/tooltip";

export default function App() {
  return (
    <TooltipProvider>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Signup/>}/>
    </Routes>
    </BrowserRouter>
    </TooltipProvider>
  )
}
