import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import Loader from "../../common/Loader";
import { API_URL } from "../../utils/constants";

const AdminDashboard = () => {
  const { authAxios, token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTurfs: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalApplications: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Make sure the Authorization header is set explicitly for these requests
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch turfs count
        const turfsRes = await authAxios.get("/api/turfs?limit=1", config);

        // Fetch users count
        const usersRes = await authAxios.get("/api/users?limit=1", config);

        // Fetch bookings data
        const bookingsRes = await authAxios.get(
          "/api/bookings?limit=5",
          config
        );

        // Fetch applications count
        const applicationsRes = await authAxios.get(
          "/api/applications?limit=1",
          config
        );

        setStats({
          totalTurfs: turfsRes.data.pagination
            ? turfsRes.data.pagination.total
            : 0,
          totalUsers: usersRes.data.pagination
            ? usersRes.data.pagination.total
            : 0,
          totalBookings: bookingsRes.data.pagination
            ? bookingsRes.data.pagination.total
            : 0,
          totalApplications: applicationsRes.data.pagination
            ? applicationsRes.data.pagination.total
            : 0,
          recentBookings: bookingsRes.data.data || [],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(
          "Failed to load dashboard data. Please ensure you have admin privileges."
        );
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      setError("Authentication required. Please log in again.");
      setLoading(false);
    }
  }, [authAxios, token]);

  // Display a more helpful error message
  const renderError = () => {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md">
        <div className="flex items-center">
          <svg
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="font-semibold">{error}</span>
        </div>
        <p className="mt-2">
          This might be because:
          <ul className="list-disc ml-6 mt-1">
            <li>Your session has expired</li>
            <li>Your account doesn't have admin permissions</li>
            <li>The server is experiencing issues</li>
          </ul>
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Return to Login
        </button>
      </div>
    );
  };

  if (loading) return <Loader />;
  if (error) return renderError();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500">
          <h2 className="text-gray-500 text-lg">Total Turfs</h2>
          <p className="text-3xl font-bold">{stats.totalTurfs}</p>
          <Link to="/admin/turfs" className="text-green-500 mt-2 inline-block">
            Manage Turfs →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-lg">Total Users</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
          <Link to="/admin/users" className="text-blue-500 mt-2 inline-block">
            Manage Users →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-red-500">
          <h2 className="text-gray-500 text-lg">Total Applications</h2>
          <p className="text-3xl font-bold">{stats.totalApplications || 0}</p>
          <Link
            to="/admin/applications"
            className="text-red-500 mt-2 inline-block"
          >
            Manage Applications →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-purple-500">
          <h2 className="text-gray-500 text-lg">Total Bookings</h2>
          <p className="text-3xl font-bold">{stats.totalBookings}</p>
          <Link
            to="/admin/bookings"
            className="text-purple-500 mt-2 inline-block"
          >
            Manage Bookings →
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turf
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.user?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.user?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.turf?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString()}{" "}
                      {booking.startTime} - {booking.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : booking.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        to={`/admin/bookings/${booking._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No recent bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
