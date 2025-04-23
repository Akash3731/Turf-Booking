import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AuthContext from "../../contexts/AuthContext";
import { API_URL } from "../../utils/constants";

const { width } = Dimensions.get("window");

const TurfDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { authAxios, isAuthenticated, user } = useContext(AuthContext);

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

  // Fetch turf details
  useEffect(() => {
    const fetchTurfDetails = async () => {
      try {
        setLoading(true);
        console.log("Attempting to fetch turf with ID:", id);
        const response = await authAxios.get(`/api/turfs/${id}`);
        setTurf(response.data.data);

        // Set map region if turf has location
        if (
          response.data.data.location &&
          response.data.data.location.coordinates
        ) {
          setMapRegion({
            latitude: response.data.data.location.coordinates[1],
            longitude: response.data.data.location.coordinates[0],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching turf details:", error);
        Alert.alert("Error", "Failed to load turf details");
        setLoading(false);
      }
    };

    fetchTurfDetails();
  }, [id, authAxios]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!turf) return;

    const fetchAvailableSlots = async () => {
      try {
        setSlotsLoading(true);
        const formattedDate = selectedDate.toISOString().split("T")[0];
        const response = await authAxios.get(
          `/api/turfs/${id}/availability?date=${formattedDate}`
        );

        if (response.data.success && response.data.data) {
          setAvailableSlots(response.data.data || []);
        } else {
          setAvailableSlots([]);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, turf, id, authAxios]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
      }
    })();
  }, []);

  // Handle date change
  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
      setSelectedSlot(null);
    }
  };

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    if (!slot.isAvailable) return;
    setSelectedSlot(slot);
  };

  // Open directions in maps app
  const openDirections = () => {
    if (!turf.location || !turf.location.coordinates) {
      Alert.alert("Error", "Location not available for this turf");
      return;
    }

    // Get latitude and longitude (MongoDB stores as [lng, lat])
    const latitude = turf.location.coordinates[1];
    const longitude = turf.location.coordinates[0];

    // Create URL based on platform
    let url;
    if (Platform.OS === "ios") {
      url = `maps:?q=${turf.name}&ll=${latitude},${longitude}`;
    } else {
      url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${turf.name})`;
    }

    // Open maps app
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to Google Maps website
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
        );
      }
    });
  };

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to book this turf", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Login",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
      return;
    }

    if (!selectedSlot) {
      Alert.alert("Error", "Please select a time slot");
      return;
    }

    console.log("Booking data:", {
      turfId: turf._id,
      turfName: turf.name,
      date: selectedDate.toISOString(),
      slot: selectedSlot,
    });

    // Navigate to booking confirmation screen with details
    navigation.navigate("BookingConfirm", {
      turfId: turf._id,
      turfName: turf.name,
      date: selectedDate.toISOString(),
      slot: selectedSlot,
      price: turf.price,
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loaderText}>Loading turf details...</Text>
      </View>
    );
  }

  if (!turf) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Turf not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        {turf.images && turf.images.length > 0 ? (
          <Image
            source={{ uri: `${API_URL}${turf.images[activeImage]}` }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="football-outline" size={80} color="#ccc" />
          </View>
        )}

        {/* Price Badge */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>₹{turf.price}/hr</Text>
        </View>
      </View>

      {/* Thumbnail Navigation */}
      {turf.images && turf.images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailContainer}
        >
          {turf.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveImage(index)}
              style={[
                styles.thumbnail,
                activeImage === index && styles.activeThumbnail,
              ]}
            >
              <Image
                source={{ uri: `${API_URL}${image}` }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Turf Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.turfName}>{turf.name}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={styles.locationText}>
            {turf.address}, {turf.city}
          </Text>
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={openDirections}
          >
            <Ionicons name="navigate" size={16} color="#fff" />
            <Text style={styles.directionsText}>Directions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Opening Hours</Text>
            <Text style={styles.detailValue}>
              {turf.openingTime} - {turf.closingTime}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Size</Text>
            <Text style={styles.detailValue}>{turf.size}</Text>
          </View>
        </View>

        <View style={styles.sportTypesContainer}>
          <Text style={styles.sectionTitle}>Sport Types</Text>
          <View style={styles.tagsContainer}>
            {turf.sportTypes.map((sport, index) => (
              <View key={index} style={styles.sportBadge}>
                <Text style={styles.sportText}>{sport}</Text>
              </View>
            ))}
          </View>
        </View>

        {turf.facilities && turf.facilities.length > 0 && (
          <View style={styles.facilitiesContainer}>
            <Text style={styles.sectionTitle}>Facilities</Text>
            <View style={styles.tagsContainer}>
              {turf.facilities.map((facility, index) => (
                <View key={index} style={styles.facilityBadge}>
                  <Text style={styles.facilityText}>{facility}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {turf.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>About this turf</Text>
            <Text style={styles.descriptionText}>{turf.description}</Text>
          </View>
        )}
      </View>

      {/* Location Map */}
      {mapRegion && (
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapWrapper}>
            <MapView
              style={styles.map}
              region={mapRegion}
              scrollEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: mapRegion.latitude,
                  longitude: mapRegion.longitude,
                }}
                title={turf.name}
                description={turf.address}
                pinColor="#4CAF50"
              />
            </MapView>
            <TouchableOpacity
              style={styles.mapDirectionsButton}
              onPress={openDirections}
            >
              <Ionicons name="navigate" size={16} color="#fff" />
              <Text style={styles.mapDirectionsText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Booking Section */}
      <View style={styles.bookingContainer}>
        <Text style={styles.sectionTitle}>Book this turf</Text>

        {!isAuthenticated ? (
          <View style={styles.authMessage}>
            <Text style={styles.authMessageText}>
              Please login to book this turf
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        ) : user?.role === "admin" ? (
          <View style={styles.adminMessage}>
            <Text style={styles.adminMessageText}>
              Admin accounts cannot book turfs. Please use a regular user
              account.
            </Text>
          </View>
        ) : (
          <>
            {/* Date Picker */}
            <View style={styles.datePickerContainer}>
              <Text style={styles.pickerLabel}>Select Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
                <Text style={styles.dateButtonText}>
                  {selectedDate.toDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Available Time Slots */}
            <View style={styles.slotsContainer}>
              <Text style={styles.pickerLabel}>Available Time Slots</Text>

              {slotsLoading ? (
                <View style={styles.slotsLoaderContainer}>
                  <ActivityIndicator size="small" color="#4CAF50" />
                  <Text style={styles.slotsLoaderText}>Loading slots...</Text>
                </View>
              ) : availableSlots.length === 0 ? (
                <View style={styles.noSlotsContainer}>
                  <Text style={styles.noSlotsText}>
                    No available slots for this date. Please try another date.
                  </Text>
                </View>
              ) : (
                <View style={styles.slotsList}>
                  {availableSlots.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.slotButton,
                        !slot.isAvailable && styles.disabledSlotButton,
                        selectedSlot === slot && styles.selectedSlotButton,
                      ]}
                      disabled={!slot.isAvailable}
                      onPress={() => handleSlotSelect(slot)}
                    >
                      <Text
                        style={[
                          styles.slotButtonText,
                          !slot.isAvailable && styles.disabledSlotButtonText,
                          selectedSlot === slot &&
                            styles.selectedSlotButtonText,
                        ]}
                      >
                        {slot.startTime} - {slot.endTime}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Book Now Button */}
            <TouchableOpacity
              style={[
                styles.bookButton,
                !selectedSlot && styles.disabledBookButton,
              ]}
              onPress={handleConfirmBooking}
              disabled={!selectedSlot}
            >
              <Text style={styles.bookButtonText}>Continue to Book</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  loaderText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
  },
  imageContainer: {
    position: "relative",
    height: 250,
    width: "100%",
  },
  mainImage: {
    height: "100%",
    width: "100%",
  },
  placeholderImage: {
    height: "100%",
    width: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  priceBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  thumbnailContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  activeThumbnail: {
    borderColor: "#4CAF50",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  turfName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  locationText: {
    color: "#666",
    fontSize: 16,
    marginLeft: 5,
    flex: 1,
  },
  directionsButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  directionsText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  sportTypesContainer: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sportBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  sportText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
  },
  facilitiesContainer: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  facilityBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityText: {
    color: "#666",
    fontSize: 14,
  },
  descriptionContainer: {
    marginBottom: 10,
  },
  descriptionText: {
    color: "#666",
    lineHeight: 22,
  },
  mapContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapWrapper: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapDirectionsButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mapDirectionsText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  bookingContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  authMessage: {
    backgroundColor: "#fff9e6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffe0b2",
  },
  authMessageText: {
    color: "#ff9800",
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#ff9800",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  adminMessage: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  adminMessageText: {
    color: "#1976d2",
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  slotsContainer: {
    marginBottom: 20,
  },
  slotsLoaderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  slotsLoaderText: {
    marginLeft: 10,
    color: "#666",
  },
  noSlotsContainer: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
  },
  noSlotsText: {
    color: "#666",
    textAlign: "center",
  },
  slotsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  slotButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 5,
    width: width / 2 - 25,
    alignItems: "center",
  },
  disabledSlotButton: {
    backgroundColor: "#f0f0f0",
    borderColor: "#e0e0e0",
  },
  selectedSlotButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  slotButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  disabledSlotButtonText: {
    color: "#999",
  },
  selectedSlotButtonText: {
    color: "#fff",
  },
  bookButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledBookButton: {
    backgroundColor: "#a5d6a7",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TurfDetailScreen;
