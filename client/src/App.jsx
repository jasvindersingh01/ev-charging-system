import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Home from "./pages/Home";
import StationDetails from "./pages/StationDetails";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="pt-2" >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stations/:id" element={<StationDetails />} />
        </Routes>
      </main>
    </>
  )
}