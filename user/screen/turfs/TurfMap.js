import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";

const TurfMap = ({ turf }) => {
  // Extract location coordinates
  const location =
    turf.location && turf.location.coordinates
      ? {
          latitude: turf.location.coordinates[1], // MongoDB stores as [lng, lat]
          longitude: turf.location.coordinates[0],
        }
      : null;

  // Default region if location isn't available
  const mapRegion = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 28.6139, // Default location (Delhi, India)
        longitude: 77.209,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  // Open directions in maps app
  const openDirections = () => {
    if (!location) {
      Alert.alert("Error", "Location coordinates not available for this turf");
      return;
    }

    const { latitude, longitude } = location;
    const label = turf.name;

    const scheme = Platform.select({ ios: "maps://", android: "geo:" });
    const url = Platform.select({
      ios: `${scheme}?q=${label}&ll=${latitude},${longitude}`,
      android: `${scheme}${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    });

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to Google Maps web URL
          const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
          return Linking.openURL(webUrl);
        }
      })
      .catch((err) => {
        Alert.alert("Error", "Unable to open maps application");
        console.error("Error opening maps:", err);
      });
  };

  if (!location) {
    return (
      <View style={[styles.container, styles.noLocationContainer]}>
        <Ionicons name="location-outline" size={30} color="#ccc" />
        <Text style={styles.noLocationText}>Location not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={mapRegion}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
      >
        <Marker
          coordinate={location}
          title={turf.name}
          description={turf.address}
          pinColor="#4CAF50"
        />
      </MapView>

      <TouchableOpacity
        style={styles.directionsButton}
        onPress={openDirections}
      >
        <Ionicons name="navigate-outline" size={18} color="#fff" />
        <Text style={styles.directionsText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 10,
    position: "relative",
  },
  map: {
    height: "100%",
    width: "100%",
  },
  noLocationContainer: {
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  noLocationText: {
    color: "#999",
    marginTop: 8,
    fontSize: 14,
  },
  directionsButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  directionsText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default TurfMap;
