import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AuthContext from "../../contexts/AuthContext";

const MyBookingsScreen = ({ navigation }) => {
  const { authAxios } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await authAxios.get("/api/bookings");

      if (response.data && response.data.data) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Alert.alert("Error", "Failed to load your bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchBookings();
    }, [])
  );

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await authAxios.put(
                `/api/bookings/${bookingId}/cancel`
              );

              if (response.data.success) {
                // Update the booking status in the list
                setBookings((prevBookings) =>
                  prevBookings.map((booking) =>
                    booking._id === bookingId
                      ? { ...booking, status: "cancelled" }
                      : booking
                  )
                );

                Alert.alert(
                  "Success",
                  "Booking has been cancelled successfully"
                );
              } else {
                Alert.alert(
                  "Error",
                  response.data.message || "Failed to cancel booking"
                );
              }
            } catch (error) {
              console.error("Error cancelling booking:", error);
              Alert.alert("Error", "Failed to cancel booking");
            }
          },
        },
      ]
    );
  };

  // Get status color based on booking status
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "completed":
        return "#2196F3";
      case "cancelled":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  // Check if booking can be cancelled (only confirmed bookings and not past bookings)
  const canCancel = (booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return booking.status === "confirmed" && bookingDate >= today;
  };

  // Render booking item
  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.turfName}>{item.turf.name}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {item.startTime} - {item.endTime}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            ₹{item.totalAmount || item.turf.price + " per hour"}
          </Text>
        </View>
      </View>

      <View style={styles.bookingActions}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate("BookingConfirm", { id: item._id })
          }
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>

        {canCancel(item) && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelBooking(item._id)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Group bookings by status
  const groupedBookings = {
    upcoming: bookings.filter(
      (booking) =>
        (booking.status === "confirmed" || booking.status === "pending") &&
        new Date(booking.date) >= new Date().setHours(0, 0, 0, 0)
    ),
    past: bookings.filter(
      (booking) =>
        booking.status === "completed" ||
        new Date(booking.date) < new Date().setHours(0, 0, 0, 0)
    ),
    cancelled: bookings.filter((booking) => booking.status === "cancelled"),
  };

  // Create sections based on grouped bookings
  const sections = [
    {
      title: "Upcoming Bookings",
      data: groupedBookings.upcoming,
      key: "upcoming",
    },
    { title: "Past Bookings", data: groupedBookings.past, key: "past" },
    {
      title: "Cancelled Bookings",
      data: groupedBookings.cancelled,
      key: "cancelled",
    },
  ].filter((section) => section.data.length > 0);

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loaderText}>Loading your bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={60} color="#ccc" />
          <Text style={styles.emptyTitle}>No Bookings Found</Text>
          <Text style={styles.emptySubtitle}>
            You haven't made any bookings yet
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate("Turfs")}
          >
            <Text style={styles.browseButtonText}>Browse Turfs</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.key}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item: section }) => (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.data.map((booking) => (
                <View key={booking._id} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <Text style={styles.turfName}>{booking.turf.name}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(booking.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bookingDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.detailText}>
                        {formatDate(booking.date)}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        {booking.startTime} - {booking.endTime}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="cash-outline" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        ₹
                        {booking.totalAmount ||
                          booking.turf.price + " per hour"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bookingActions}>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() =>
                        navigation.navigate("BookingConfirm", {
                          id: booking._id,
                          fromHistory: true,
                        })
                      }
                    >
                      <Text style={styles.viewButtonText}>View Details</Text>
                    </TouchableOpacity>

                    {canCancel(booking) && (
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => handleCancelBooking(booking._id)}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  browseButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
    color: "#333",
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  turfName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  bookingDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    color: "#666",
    marginLeft: 10,
    fontSize: 14,
  },
  bookingActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  viewButton: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  viewButtonText: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  cancelButton: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "#f44336",
    fontWeight: "500",
  },
});

export default MyBookingsScreen;
