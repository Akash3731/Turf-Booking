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
      return Promise.reject(error);
    }
  );

  // Add token to requests if it exists
  useEffect(() => {
    if (token) {
      authAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete authAxios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await authAxios.get("/api/auth/profile");

          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (error) {
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
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
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

      localStorage.setItem("token", res.data.token);
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
  const logout = () => {
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
