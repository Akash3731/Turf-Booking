import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import Loader from "../../common/Loader";
import { API_URL } from "../../utils/constants";

const UserDashboard = () => {
  const { user, authAxios } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Get token directly from localStorage
        const token = localStorage.getItem("token");

        // Include token in request headers
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await authAxios.get("/api/bookings", config);
        setBookings(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authAxios]);

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === "upcoming") {
      return bookingDate >= today && booking.status !== "cancelled";
    } else if (activeTab === "past") {
      return bookingDate < today || booking.status === "completed";
    } else if (activeTab === "cancelled") {
      return booking.status === "cancelled";
    }
    return true;
  });

  // Handle booking cancellation
  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        // Get token directly from localStorage
        const token = localStorage.getItem("token");

        // Include token in request headers
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await authAxios.put(`/api/bookings/${id}/cancel`, {}, config);

        // Update booking status in state
        setBookings(
          bookings.map((booking) =>
            booking._id === id ? { ...booking, status: "cancelled" } : booking
          )
        );
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking");
      }
    }
  };

  if (loading && bookings.length === 0) return <Loader />;

  return (
    <div className="container mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* User Profile Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <Link
              to="/turfs"
              className="mt-4 md:mt-0 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Book New Turf
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "upcoming"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Bookings
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "past"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Bookings
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "cancelled"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-6 bg-red-100 border-b border-red-300 text-red-700">
            {error}
          </div>
        )}

        {/* Bookings List */}
        <div className="p-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No bookings found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === "upcoming"
                  ? "You don't have any upcoming bookings."
                  : activeTab === "past"
                  ? "You don't have any past bookings."
                  : "You don't have any cancelled bookings."}
              </p>
              <div className="mt-6">
                <Link
                  to="/turfs"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Book a Turf
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.turf?.name || "Unknown Turf"}
                        </h3>

                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {new Date(booking.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {booking.startTime} - {booking.endTime} (
                            {booking.duration} hours)
                          </span>
                        </div>

                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span>
                            Total: ₹
                            {booking.pricing.totalPrice?.toFixed(2) || "0.00"} (
                            {booking.paymentStatus})
                          </span>
                        </div>

                        <div className="mt-2 flex items-center">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : booking.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col sm:items-end">
                        {booking.turf?.images &&
                          booking.turf.images.length > 0 && (
                            <div className="mb-4">
                              <img
                                src={`${API_URL}${booking.turf.images[0]}`}
                                alt={booking.turf.name}
                                className="h-24 w-24 object-cover rounded-md"
                              />
                            </div>
                          )}

                        {activeTab === "upcoming" &&
                          booking.status !== "cancelled" && (
                            <div className="mt-4 flex space-x-2">
                              <Link
                                to={`/turfs/${booking.turf?._id}`}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
                              >
                                View Turf
                              </Link>
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:text-red-500"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
