import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AuthContext from "../../contexts/AuthContext";

const BookingConfirm = ({ route, navigation }) => {
  console.log("Route params:", route.params);

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { authAxios } = useContext(AuthContext);

  // Check if this is a new booking or viewing an existing one
  const isNewBooking = !route.params.id && route.params.turfId;

  // Extract parameters from the route
  const { turfId, turfName, date, slot, price } = route.params || {};

  // Fetch booking details if viewing an existing booking
  useEffect(() => {
    if (!isNewBooking && route.params.id) {
      fetchBookingDetails(route.params.id);
    }
  }, [route.params.id]);

  const fetchBookingDetails = async (bookingId) => {
    try {
      setLoading(true);
      const response = await authAxios.get(`/api/bookings/${bookingId}`);
      console.log("Fetched booking details:", response.data.data);
      setBookingDetails(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      Alert.alert("Error", "Failed to load booking details");
      setLoading(false);
    }
  };

  // Extract hours from time strings (supporting both formats)
  const getHours = (timeStr) => {
    if (!timeStr) return 0;

    // Check if format is 24-hour (no space) or 12-hour (has space)
    if (timeStr.includes(" ")) {
      // 12-hour format like "10:00 AM"
      const [time, meridian] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (meridian === "PM" && hours < 12) {
        hours += 12;
      } else if (meridian === "AM" && hours === 12) {
        hours = 0;
      }

      return hours + minutes / 60;
    } else {
      // 24-hour format like "13:30"
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours + minutes / 60;
    }
  };

  // Format date and calculate values only if we have the data
  let formattedDate, startTime, endTime, durationHours, totalPrice, displayName;

  if (isNewBooking && slot) {
    // New booking flow
    formattedDate = new Date(date).toDateString();
    startTime = slot.startTime;
    endTime = slot.endTime;
    displayName = turfName;

    // Calculate duration and price
    const startHour = getHours(startTime);
    const endHour = getHours(endTime);
    durationHours = endHour - startHour;
    totalPrice = durationHours * price;
  } else if (bookingDetails) {
    // Viewing existing booking
    formattedDate = new Date(bookingDetails.date).toDateString();
    startTime = bookingDetails.startTime;
    endTime = bookingDetails.endTime;
    displayName = bookingDetails.turf?.name || "Unknown Turf";

    // For existing bookings, use the stored duration/price if available
    if (bookingDetails.pricing) {
      durationHours = bookingDetails.pricing.duration;
      totalPrice = bookingDetails.pricing.totalPrice;
    } else {
      // Calculate if not stored
      const startHour = getHours(startTime);
      const endHour = getHours(endTime);
      durationHours = endHour - startHour;
      totalPrice =
        bookingDetails.totalPrice ||
        durationHours * (bookingDetails.turf?.price || 0);
    }
  }

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    try {
      setLoading(true);

      console.log("Submitting booking with data:", {
        turf: turfId,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        duration: durationHours,
      });

      const bookingData = {
        turf: turfId, // Use 'turf' instead of 'turfId' to match backend
        date: date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        duration: durationHours,
      };

      const response = await authAxios.post("/api/bookings", bookingData);

      if (response.data.success) {
        Alert.alert("Booking Successful", "Your booking has been confirmed!", [
          {
            text: "View My Bookings",
            onPress: () => navigation.navigate("Bookings"),
          },
        ]);
      } else {
        Alert.alert(
          "Booking Failed",
          response.data.message || "Failed to create booking"
        );
      }
    } catch (error) {
      console.error("Booking error:", error);
      Alert.alert(
        "Booking Failed",
        error.response?.data?.message ||
          "An error occurred while processing your booking"
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading indicator while fetching booking details
  if (!isNewBooking && loading && !bookingDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </View>
    );
  }

  // If we don't have the necessary data yet, show a message
  if (!isNewBooking && !bookingDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Booking details not available</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determine status display for existing bookings
  let statusColor = "#4CAF50";
  if (!isNewBooking && bookingDetails) {
    switch (bookingDetails.status) {
      case "cancelled":
        statusColor = "#F44336";
        break;
      case "pending":
        statusColor = "#FF9800";
        break;
      case "completed":
        statusColor = "#2196F3";
        break;
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            {isNewBooking ? "Booking Details" : "Booking Information"}
          </Text>

          {/* Show status for existing bookings */}
          {!isNewBooking && bookingDetails && (
            <View
              style={[styles.statusBadge, { backgroundColor: statusColor }]}
            >
              <Text style={styles.statusText}>
                {bookingDetails.status.charAt(0).toUpperCase() +
                  bookingDetails.status.slice(1)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="football-outline" size={22} color="#4CAF50" />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Turf</Text>
              <Text style={styles.detailValue}>{displayName}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={22} color="#4CAF50" />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formattedDate}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="time-outline" size={22} color="#4CAF50" />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Time Slot</Text>
              <Text style={styles.detailValue}>
                {startTime} - {endTime}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="hourglass-outline" size={22} color="#4CAF50" />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>
                {durationHours} {durationHours === 1 ? "hour" : "hours"}
              </Text>
            </View>
          </View>

          {/* Show booking ID for existing bookings */}
          {!isNewBooking && bookingDetails && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="barcode-outline" size={22} color="#4CAF50" />
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Booking ID</Text>
                <Text style={styles.detailValue}>{bookingDetails._id}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price per hour</Text>
            <Text style={styles.priceValue}>
              ₹{isNewBooking ? price : bookingDetails.turf?.price || "N/A"}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Duration</Text>
            <Text style={styles.priceValue}>
              {durationHours} {durationHours === 1 ? "hour" : "hours"}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {isNewBooking && (
          <View style={styles.paymentNote}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#666"
            />
            <Text style={styles.paymentNoteText}>
              Payment will be collected at the venue
            </Text>
          </View>
        )}
      </View>

      {isNewBooking ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Go Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmBooking}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.confirmButton,
            { marginHorizontal: 15, marginBottom: 20 },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.confirmButtonText}>Back to My Bookings</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  errorText: {
    color: "#F44336",
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    marginBottom: 15,
  },
  headerContainer: {
    padding: 15,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  detailsContainer: {
    padding: 15,
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 15,
  },
  priceContainer: {
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  paymentNote: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fffde7",
  },
  paymentNoteText: {
    color: "#666",
    marginLeft: 8,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 15,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 16,
  },
  confirmButton: {
    flex: 2,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default BookingConfirm;
