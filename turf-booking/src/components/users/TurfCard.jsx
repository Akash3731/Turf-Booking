import { Link } from "react-router-dom";
import { API_URL } from "../../utils/constants";

const TurfCard = ({ turf }) => {
  // Get the first image or use a placeholder
  const coverImage =
    turf.images && turf.images.length > 0
      ? `${API_URL}${turf.images[0]}`
      : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/turfs/${turf._id}`}>
        <div className="relative h-48">
          <img
            src={coverImage}
            alt={turf.name}
            className="h-full w-full object-cover"
          />

          {/* Price Badge */}
          <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 rounded-bl-lg font-semibold">
            ₹{turf.price}/hr
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 text-gray-800">
            {turf.name}
          </h3>

          <div className="flex items-center mb-2">
            <svg
              className="h-4 w-4 text-gray-500 mr-1"
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
            <span className="text-sm text-gray-600">{turf.city}</span>
          </div>

          <div className="flex items-center mb-3">
            <svg
              className="h-4 w-4 text-gray-500 mr-1"
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
            <span className="text-sm text-gray-600">
              {turf.openingTime} - {turf.closingTime}
            </span>
          </div>

          {/* Sport Types */}
          <div className="flex flex-wrap gap-1 mb-3">
            {turf.sportTypes.map((sport, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
              >
                {sport}
              </span>
            ))}
          </div>

          {/* Key Features (limit to 3) */}
          {turf.facilities && turf.facilities.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Facilities:
              </h4>
              <div className="flex flex-wrap gap-1">
                {turf.facilities.slice(0, 3).map((facility, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded"
                  >
                    {facility}
                  </span>
                ))}
                {turf.facilities.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded">
                    +{turf.facilities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Book Now Button */}
          <div className="mt-auto">
            <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TurfCard;
