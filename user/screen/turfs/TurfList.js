import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AuthContext from "../../contexts/AuthContext";
import { API_URL } from "../../utils/constants";

const TurfList = ({ navigation }) => {
  const { authAxios } = useContext(AuthContext);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTurfs, setFilteredTurfs] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  // Fetch turfs from API
  useEffect(() => {
    fetchTurfs();
  }, []);

  const fetchTurfs = async () => {
    try {
      setLoading(true);
      console.log("Fetching turfs from API...");
      const response = await authAxios.get("/api/turfs");

      if (response.data && response.data.data) {
        console.log(`Received ${response.data.data.length} turfs`);
        setTurfs(response.data.data);
        setFilteredTurfs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching turfs:", error);
      Alert.alert("Error", "Failed to load turf listings");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text.trim() === "") {
      setFilteredTurfs(
        activeFilter === "All"
          ? turfs
          : turfs.filter((turf) => turf.sportTypes.includes(activeFilter))
      );
    } else {
      const searchResults = turfs.filter((turf) => {
        const matchesFilter =
          activeFilter === "All" || turf.sportTypes.includes(activeFilter);
        const matchesSearch =
          turf.name.toLowerCase().includes(text.toLowerCase()) ||
          turf.city.toLowerCase().includes(text.toLowerCase()) ||
          turf.address.toLowerCase().includes(text.toLowerCase());

        return matchesFilter && matchesSearch;
      });

      setFilteredTurfs(searchResults);
    }
  };

  // Filter turfs by sport type
  const filterTurfsBySport = (sportType) => {
    setActiveFilter(sportType);

    if (sportType === "All") {
      setFilteredTurfs(
        searchQuery.trim() === ""
          ? turfs
          : turfs.filter(
              (turf) =>
                turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                turf.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                turf.address.toLowerCase().includes(searchQuery.toLowerCase())
            )
      );
    } else {
      const filtered = turfs.filter((turf) => {
        const matchesSport = turf.sportTypes.includes(sportType);
        const matchesSearch =
          searchQuery.trim() === ""
            ? true
            : turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              turf.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
              turf.address.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSport && matchesSearch;
      });

      setFilteredTurfs(filtered);
    }
  };

  // Open directions to turf location
  const openDirections = (turf) => {
    // Check if turf has location data
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

  // Extract all unique sport types from turfs
  const sportTypes = [
    "All",
    ...new Set(turfs.flatMap((turf) => turf.sportTypes)),
  ];

  // Render turf card
  const renderTurf = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        console.log("Navigating to TurfDetail with ID:", item._id);
        navigation.navigate("TurfDetail", { id: item._id, name: item.name });
      }}
    >
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: `${API_URL}${item.images[0]}` }}
            style={styles.turfImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="football-outline" size={50} color="#ccc" />
          </View>
        )}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>₹{item.price}/hr</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.turfName}>{item.name}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.address}, {item.city}
          </Text>
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={(e) => {
              e.stopPropagation(); // Prevent triggering the card's onPress
              openDirections(item);
            }}
          >
            <Ionicons name="navigate" size={16} color="#fff" />
            <Text style={styles.directionsText}>Directions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sportTypesContainer}>
          {item.sportTypes.slice(0, 3).map((sport, index) => (
            <View key={index} style={styles.sportBadge}>
              <Text style={styles.sportText}>{sport}</Text>
            </View>
          ))}
          {item.sportTypes.length > 3 && (
            <View style={styles.sportBadge}>
              <Text style={styles.sportText}>
                +{item.sportTypes.length - 3}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.hoursText}>
            {item.openingTime} - {item.closingTime}
          </Text>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or location"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Sport Type Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {sportTypes.map((sport, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButton,
              activeFilter === sport && styles.activeFilterButton,
            ]}
            onPress={() => filterTurfsBySport(sport)}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === sport && styles.activeFilterButtonText,
              ]}
            >
              {sport}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Turf List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loaderText}>Loading turfs...</Text>
        </View>
      ) : filteredTurfs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No turfs found</Text>
          <Text style={styles.emptySubText}>
            Try a different search or filter
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTurfs}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderTurf}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeFilterButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
  },
  activeFilterButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 150,
  },
  turfImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  priceBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  cardBody: {
    padding: 15,
  },
  turfName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    color: "#666",
    flex: 1,
    marginLeft: 5,
    fontSize: 14,
  },
  directionsButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  directionsText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 3,
  },
  sportTypesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  sportBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  sportText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "500",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hoursText: {
    color: "#666",
    fontSize: 13,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 3,
    color: "#333",
    fontWeight: "500",
    fontSize: 14,
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
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },
});

export default TurfList;
