// In AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Create axios instance with detailed logging
  const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add detailed request/response logging
  authAxios.interceptors.request.use(
    (config) => {
      console.log("REQUEST:", config.method.toUpperCase(), config.url);
      console.log("REQUEST HEADERS:", config.headers);
      return config;
    },
    (error) => {
      console.error("REQUEST ERROR:", error);
      return Promise.reject(error);
    }
  );

  authAxios.interceptors.response.use(
    (response) => {
      console.log("RESPONSE STATUS:", response.status);
      return response;
    },
    (error) => {
      console.error(
        "RESPONSE ERROR:",
        error.response?.status,
        error.response?.data
      );
      return Promise.reject(error);
    }
  );

  // Add token to requests if it exists
  useEffect(() => {
    if (token) {
      console.log("Setting auth token header:", token.substring(0, 15) + "...");
      authAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      console.log("No token found, removing Authorization header");
      delete authAxios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          console.log("Loading user profile...");
          const res = await authAxios.get("/api/auth/profile");
          console.log("User profile loaded:", res.data);
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error loading user:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login user
  const login = async (email, password) => {
    try {
      console.log("Attempting login for:", email);
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      console.log("Login successful, user data:", res.data);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);

      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      console.error("Login failed:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      console.log("Attempting registration for:", userData.email);
      const res = await axios.post(`${API_URL}/api/auth/register`, userData);

      console.log("Registration successful:", res.data);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);

      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      console.error("Registration failed:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout user
  const logout = () => {
    console.log("Logging out user");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
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
