import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import Loader from "../../common/Loader";
import { API_URL } from "../../utils/constants";

const ManageBookings = () => {
  const { authAxios } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [turfFilter, setTurfFilter] = useState("");
  const [turfs, setTurfs] = useState([]);

  // Fetch turfs for filter dropdown
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await authAxios.get("/api/turfs?limit=100");
        setTurfs(response.data.data || []);
      } catch (error) {
        console.error("Error fetching turfs:", error);
      }
    };

    fetchTurfs();
  }, [authAxios]);

  // Fetch bookings based on current filters and pagination
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        let queryString = `?page=${currentPage}&limit=10`;

        if (searchQuery) {
          queryString += `&search=${searchQuery}`;
        }

        if (statusFilter) {
          queryString += `&status=${statusFilter}`;
        }

        if (dateFilter) {
          queryString += `&date=${dateFilter}`;
        }

        if (turfFilter) {
          queryString += `&turf=${turfFilter}`;
        }

        const response = await authAxios.get(`/api/bookings${queryString}`);

        setBookings(response.data.data);

        if (response.data.pagination) {
          setTotalPages(
            Math.ceil(
              response.data.pagination.total / response.data.pagination.limit
            )
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [
    authAxios,
    currentPage,
    searchQuery,
    statusFilter,
    dateFilter,
    turfFilter,
  ]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle filter changes
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleTurfFilterChange = (e) => {
    setTurfFilter(e.target.value);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setDateFilter("");
    setTurfFilter("");
    setCurrentPage(1);
  };

  // Handle update booking status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await authAxios.put(`/api/bookings/${id}`, { status: newStatus });

      // Update booking status in state
      setBookings(
        bookings.map((booking) =>
          booking._id === id ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    }
  };

  if (loading && bookings.length === 0) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Bookings</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by ID or user..."
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="dateFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="dateFilter"
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="turfFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Turf
            </label>
            <select
              id="turfFilter"
              value={turfFilter}
              onChange={handleTurfFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Turfs</option>
              {turfs.map((turf) => (
                <option key={turf._id} value={turf._id}>
                  {turf.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
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
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-sm font-medium">
                            {booking.user?.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user?.name || "Unknown User"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.user?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.turf?.name || "Unknown Turf"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.turf?.city || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${booking.totalPrice.toFixed(2)}
                      <div className="text-xs text-gray-500">
                        {booking.paymentStatus}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="relative group">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            Update Status
                          </button>
                          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking._id, "pending")
                              }
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              Pending
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking._id, "confirmed")
                              }
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking._id, "completed")
                              }
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking._id, "cancelled")
                              }
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>

                        <Link
                          to={`/admin/bookings/${booking._id}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Statistics */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Today's Bookings</h3>
          <p className="text-2xl font-bold">
            {
              bookings.filter(
                (b) =>
                  new Date(b.date).toDateString() === new Date().toDateString()
              ).length
            }
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Pending Confirmation</h3>
          <p className="text-2xl font-bold">
            {bookings.filter((b) => b.status === "pending").length}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm">Upcoming Bookings</h3>
          <p className="text-2xl font-bold">
            {
              bookings.filter(
                (b) => new Date(b.date) > new Date() && b.status !== "cancelled"
              ).length
            }
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold">
            $
            {bookings
              .filter((b) => b.status !== "cancelled")
              .reduce((sum, b) => sum + b.totalPrice, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
