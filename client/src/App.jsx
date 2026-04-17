import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Home from "./pages/Home";
import StationDetails from "./pages/StationDetails";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Stations from "./pages/Stations";
import Admin from "./pages/Admin";
import { Navigate } from "react-router-dom";
import AdminRoute from "./routes/AdminRoute";
import AdminBookings from "./pages/AdminBooking";
import Footer from "./components/layouts/Footer";

export default function App() {

  const role = localStorage.getItem("userRole");

  return (
    <>
      <Navbar />
      <main className="pt-2" >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/stations/:id"
            element={
              <ProtectedRoute>
                <StationDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            }
          />
          <Route path="/stations" element={<Stations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        <Footer />
      </main>
    </>
  )
}