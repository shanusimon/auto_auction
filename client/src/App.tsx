import { CarAuctionSignup } from "./pages/Signup"
import { BrowserRouter, Routes, Route } from "react-router-dom";




export default function App() {
  return (
    <BrowserRouter>
    <Routes>
            <Route path="/signup" element={<CarAuctionSignup/>}/>
    </Routes>
    </BrowserRouter>
  
  )
}
