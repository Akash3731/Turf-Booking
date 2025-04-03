import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// Common Components
import Header from "./common/Header";
import Footer from "./common/Footer";
import PrivateRoute from "./common/PrivateRoute";
import AdminRoute from "./common/AdminRoute";

// Public Pages
import Home from "./components/Home";
import Login from "./components/Login";
import ContactPage from "./components/ContactPage";
import CareersPage from "./pages/CareersPage";
import CareerApplicationPage from "./pages/CareersApplicationPage";
import Register from "./components/Register";
import TurfList from "./components/users/TurfList";
import TurfDetails from "./components/users/TurfDetails";

// User Pages
import UserDashboard from "./components/users/userDashboard";
import BookingConfirmation from "./components/users/BookingConfirmation";

// Admin Pages
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageTurfs from "./components/admin/ManageTurfs";
import ManageUsers from "./components/admin/ManageUsers";
import ManageBookings from "./components/admin/ManageBookings";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/turfs" element={<TurfList />} />
              <Route path="/turfs/:id" element={<TurfDetails />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route
                path="/careers/apply/:roleId"
                element={<CareerApplicationPage />}
              />

              {/* Protected User Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <UserDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/booking/confirm/:id"
                element={
                  <PrivateRoute>
                    <BookingConfirmation />
                  </PrivateRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/turfs"
                element={
                  <AdminRoute>
                    <ManageTurfs />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <ManageUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <AdminRoute>
                    <ManageBookings />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
