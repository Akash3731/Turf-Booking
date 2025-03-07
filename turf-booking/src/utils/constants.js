// API URL
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Sport types
export const SPORT_TYPES = [
  "Football",
  "Cricket",
  "Basketball",
  "Tennis",
  "Other",
];

// Facility options
export const FACILITY_OPTIONS = [
  "Changing Rooms",
  "Shower",
  "Parking",
  "Drinking Water",
  "Flood Lights",
  "Equipment Rental",
  "Cafeteria",
  "Washrooms",
];

// Booking statuses
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  REFUNDED: "refunded",
};

// Payment methods
export const PAYMENT_METHODS = {
  CASH: "cash",
  ONLINE: "online",
};

// User roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// Time slot generation
export const generateTimeSlots = (startTime, endTime, intervalMinutes = 60) => {
  const slots = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMinute = startMinute;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    // Current time slot start
    const startTimeStr = `${String(currentHour).padStart(2, "0")}:${String(
      currentMinute
    ).padStart(2, "0")}`;

    // Calculate end time
    let endHour = currentHour;
    let endMinute = currentMinute + intervalMinutes;

    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute %= 60;
    }

    // Check if end time exceeds closing time
    if (endHour > endHour || (endHour === endHour && endMinute > endMinute)) {
      break;
    }

    const endTimeStr = `${String(endHour).padStart(2, "0")}:${String(
      endMinute
    ).padStart(2, "0")}`;

    slots.push({
      startTime: startTimeStr,
      endTime: endTimeStr,
      isAvailable: true, // Default to available
    });

    // Move to next slot
    currentMinute += intervalMinutes;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute %= 60;
    }
  }

  return slots;
};

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

// Calculate duration between two time strings (in hours)
export const calculateDuration = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let hours = endHour - startHour;
  let minutes = endMinute - startMinute;

  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }

  return hours + minutes / 60;
};
