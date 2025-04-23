import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import screens
import TurfList from "../screen/turfs/TurfList";
import TurfDetailScreen from "../screen/turfs/TurfDetails";
import BookingConfirm from "../screen/booking/BookingConfirm";
import MyBookingsScreen from "../screen/booking/MyBookings";
import MyProfile from "../screen/profile/MyProfile";

// Stack navigators for each tab
const TurfStack = createNativeStackNavigator();
const BookingStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Turf Stack Navigator
const TurfNavigator = () => {
  return (
    <TurfStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4CAF50",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <TurfStack.Screen
        name="TurfList"
        component={TurfList}
        options={{ title: "Find Turfs" }}
      />
      <TurfStack.Screen
        name="TurfDetail"
        component={TurfDetailScreen}
        options={({ route }) => ({
          title: route.params?.name || "Turf Details",
        })}
      />
      <TurfStack.Screen
        name="BookingConfirm"
        component={BookingConfirm}
        options={{ title: "Confirm Booking" }}
      />
    </TurfStack.Navigator>
  );
};

// Booking Stack Navigator
const BookingNavigator = () => {
  return (
    <BookingStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4CAF50",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <BookingStack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ title: "My Bookings" }}
      />
      <BookingStack.Screen
        name="BookingConfirm"
        component={BookingConfirm}
        options={{ title: "Booking Details" }}
      />
    </BookingStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4CAF50",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <ProfileStack.Screen
        name="UserProfile"
        component={MyProfile}
        options={{ title: "My Profile" }}
      />
    </ProfileStack.Navigator>
  );
};

// Main Tab Navigator
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Turfs") {
            iconName = focused ? "football" : "football-outline";
          } else if (route.name === "Bookings") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Turfs" component={TurfNavigator} />
      <Tab.Screen name="Bookings" component={BookingNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
