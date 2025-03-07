import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AuthContext from "../../contexts/AuthContext";
import Loader from "../../common/Loader";
import BookingForm from "../users/BookingForm";
import { API_URL } from "../../utils/constants";

const TurfDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authAxios, isAuthenticated, user } = useContext(AuthContext);
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch turf details
  useEffect(() => {
    const fetchTurfDetails = async () => {
      try {
        setLoading(true);
        const response = await authAxios.get(`/api/turfs/${id}`);
        setTurf(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching turf details:", error);
        setError("Failed to load turf details");
        setLoading(false);
      }
    };

    fetchTurfDetails();
  }, [authAxios, id]);

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!turf) return;

      try {
        setSlotsLoading(true);

        const formattedDate = selectedDate.toISOString().split("T")[0];
        // Get token from localStorage to ensure it's fresh
        const token = localStorage.getItem("token");

        const response = await authAxios.get(
          `/api/turfs/${id}/availability?date=${formattedDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Available slots response:", response.data);

        if (response.data.success && response.data.data) {
          setAvailableSlots(response.data.data || []);
        } else {
          console.error("No slots data in response:", response.data);
          setAvailableSlots([]);
        }

        setSlotsLoading(false);
      } catch (error) {
        console.error(
          "Error fetching availability:",
          error.response?.data || error.message
        );
        setAvailableSlots([]);
        setSlotsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [authAxios, id, selectedDate, turf]);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    if (!slot.isAvailable) return;

    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  // Handle booking submission
  const handleBookingSubmit = (bookingData) => {
    navigate(`/booking/confirm/${bookingData._id}`);
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Turf not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3">
            <div className="relative h-80 md:h-96">
              {turf.images && turf.images.length > 0 ? (
                <img
                  src={`${API_URL}${turf.images[activeImage]}`}
                  alt={turf.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No images available</p>
                </div>
              )}

              {/* Price Badge */}
              <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 rounded-bl-lg text-lg font-semibold">
                ₹{turf.price}/hr
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {turf.images && turf.images.length > 1 && (
              <div className="flex overflow-x-auto p-2 space-x-2">
                {turf.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                      activeImage === index
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={`${API_URL}${image}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Turf Info */}
          <div className="md:w-1/3 p-6">
            <h1 className="text-2xl font-bold mb-2">{turf.name}</h1>

            <div className="flex items-center mb-4">
              <svg
                className="h-5 w-5 text-gray-500 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-gray-700">
                {turf.address}, {turf.city}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Opening Hours
                </h3>
                <p className="text-gray-800">
                  {turf.openingTime} - {turf.closingTime}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Size</h3>
                <p className="text-gray-800">{turf.size}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Sport Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {turf.sportTypes.map((sport, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {sport}
                  </span>
                ))}
              </div>
            </div>

            {turf.facilities && turf.facilities.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Facilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {turf.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-4">About this turf</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {turf.description}
          </p>
        </div>

        {/* Booking Section */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Book this turf</h2>

          {!isAuthenticated ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <p className="text-yellow-700">
                Please{" "}
                <a
                  href="/login"
                  className="text-yellow-800 font-semibold underline"
                >
                  login
                </a>{" "}
                or{" "}
                <a
                  href="/register"
                  className="text-yellow-800 font-semibold underline"
                >
                  register
                </a>{" "}
                to book this turf.
              </p>
            </div>
          ) : user?.role === "admin" ? (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <p className="text-blue-700">
                Admin accounts cannot book turfs. Please use a regular user
                account to make bookings.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Available Time Slots */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>

                {slotsLoading ? (
                  <div className="py-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-700"></div>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-gray-500 py-2 bg-gray-50 rounded-md p-4 text-center">
                    No available slots for this date. Please try another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlotSelect(slot)}
                        disabled={!slot.isAvailable}
                        className={`py-2 px-3 rounded-md text-center ${
                          selectedSlot === slot
                            ? "bg-green-600 text-white"
                            : slot.isAvailable
                            ? "bg-white border border-gray-300 hover:bg-gray-50"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {showBookingForm && selectedSlot && (
                <BookingForm
                  turf={turf}
                  date={selectedDate}
                  timeSlot={selectedSlot}
                  onSubmit={handleBookingSubmit}
                  onCancel={() => setShowBookingForm(false)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurfDetails;
