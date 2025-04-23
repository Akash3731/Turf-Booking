import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./contexts/AuthContext";
import MainNavigator from "./navigation/MainNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar style="auto" />
        <MainNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
