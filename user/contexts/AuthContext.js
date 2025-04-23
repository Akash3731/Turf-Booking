import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../utils/constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Create axios instance with authentication headers
  const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request/response interceptors for better error handling
  authAxios.interceptors.request.use(
    (config) => {
      // Add token to request if available
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error("REQUEST ERROR:", error);
      return Promise.reject(error);
    }
  );

  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error(
        "RESPONSE ERROR:",
        error.response?.status,
        error.response?.data
      );

      // If unauthorized, log out user
      if (error.response?.status === 401) {
        logout();
      }

      return Promise.reject(error);
    }
  );

  // Load token and user on app start
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          setToken(storedToken);

          try {
            // Add the token to the request explicitly
            const res = await axios.get(`${API_URL}/api/auth/profile`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            });

            setUser(res.data.user);
            setIsAuthenticated(true);
          } catch (error) {
            console.log("Token validation failed:", error.response?.data);
            // Clear the invalid token
            await AsyncStorage.removeItem("token");
            setToken(null);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      await AsyncStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);

      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, userData);

      await AsyncStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);

      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        authAxios,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
