// Base API URL - Replace with your actual API URL
export const API_URL = "http://192.168.113.45:5000";

// Image base URL - Used for loading turf images
export const IMAGE_BASE_URL = `${API_URL}`;

// Turf sports types
export const SPORT_TYPES = [
  "Football",
  "Cricket",
  "Basketball",
  "Tennis",
  "Badminton",
  "Volleyball",
];

// Turf facilities
export const FACILITIES = [
  "Changing Rooms",
  "Parking",
  "Water",
  "Washrooms",
  "Coaching",
  "Equipment Rental",
  "Floodlights",
  "Seating Area",
];

// Booking statuses
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// User roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// Map default region (center of map)
export const DEFAULT_MAP_REGION = {
  latitude: 28.6139, // Example: Delhi, India
  longitude: 77.209,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
