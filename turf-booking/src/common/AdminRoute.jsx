// In components/common/AdminRoute.jsx
import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import Loader from "./Loader";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  useEffect(() => {
    console.log("AdminRoute - Auth State:", {
      isAuthenticated,
      userRole: user?.role,
      isAdmin: user?.role === "admin",
      loading,
    });
  }, [user, isAuthenticated, loading]);

  if (loading) {
    return <Loader />;
  }

  // Temporarily bypass role check for troubleshooting
  return isAuthenticated ? children : <Navigate to="/login" />;

  // Original check (uncomment after fixing)
  // return isAuthenticated && user?.role === 'admin' ? (
  //   children
  // ) : (
  //   <Navigate to="/" />
  // );
};

export default AdminRoute;
