import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import Loader from "../../common/Loader";
import { API_URL } from "../../utils/constants";

const BookingConfirmation = () => {
  const { id } = useParams();
  const { authAxios } = useContext(AuthContext);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
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

        const response = await authAxios.get(`/api/bookings/${id}`, config);
        setBooking(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError("Failed to load booking details");
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [authAxios, id]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Booking not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-600 text-white px-6 py-8 text-center">
          <div className="mb-4 flex justify-center">
            <svg
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-xl">Your turf is reserved successfully.</p>
        </div>

        {/* Booking Details */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Booking ID
                </h3>
                <p className="text-lg font-medium">{booking._id}</p>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Turf Name
                </h3>
                <p className="text-lg font-medium">
                  {booking.turf?.name || "N/A"}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Location
                </h3>
                <p className="text-lg">
                  {booking.turf?.address}, {booking.turf?.city}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Date & Time
                </h3>
                <p className="text-lg">
                  {new Date(booking.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-lg">
                  {booking.startTime} - {booking.endTime} ({booking.duration}{" "}
                  hours)
                </p>
              </div>
            </div>

            <div>
              {booking.turf?.images && booking.turf.images.length > 0 && (
                <div className="mb-4">
                  <img
                    src={`${API_URL}${booking.turf.images[0]}`}
                    alt={booking.turf.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </div>
              )}

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Booking Status
                </h3>
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

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Payment Details
                </h3>
                <p className="text-lg font-medium">
                  Total Amount: ₹
                  {booking.pricing.totalPrice?.toFixed(2) || "0.00"}
                </p>
                <p className="text-sm text-gray-600">
                  Payment Method:{" "}
                  {booking.paymentMethod === "cash"
                    ? "Cash on Arrival"
                    : "Online Payment"}
                </p>
                <p className="text-sm text-gray-600">
                  Payment Status:{" "}
                  {booking.paymentStatus.charAt(0).toUpperCase() +
                    booking.paymentStatus.slice(1)}
                </p>
              </div>

              {booking.numberOfPlayers && (
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Number of Players
                  </h3>
                  <p className="text-lg">{booking.numberOfPlayers}</p>
                </div>
              )}

              {booking.specialRequests && (
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Special Requests
                  </h3>
                  <p className="text-lg">{booking.specialRequests}</p>
                </div>
              )}
            </div>
          </div>

          {/* Information and Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-medium text-blue-800 mb-2">
              Important Information
            </h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Please arrive 15 minutes before your booking time.</li>
              <li>Bring your booking confirmation ID with you.</li>
              <li>
                In case of payment on arrival, please have the exact amount.
              </li>
              <li>
                Cancellations must be made at least 4 hours before the booking
                time.
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
            <Link
              to="/dashboard"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md text-center transition-colors"
            >
              Go to My Bookings
            </Link>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print
              </button>

              <Link
                to={`/turfs/${booking.turf?._id}`}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                View Turf
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
