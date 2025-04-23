import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AuthContext from "../../contexts/AuthContext";

const MyProfile = () => {
  const { user, logout, authAxios } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Update form field
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim())) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);

      const response = await authAxios.put(`/api/users/${user._id}`, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });

      if (response.data.success) {
        Alert.alert("Success", "Profile updated successfully");
        setIsEditing(false);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to update profile"
        );
      }
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Confirm logout
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: logout,
        style: "destructive",
      },
    ]);
  };

  // Reset password
  const handleResetPassword = () => {
    Alert.alert("Reset Password", "Would you like to reset your password?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Continue",
        onPress: () => {
          // In a real app, you would implement password reset logic here
          Alert.alert(
            "Not Implemented",
            "Password reset functionality would be implemented here"
          );
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Profile" : "My Profile"}
        </Text>

        {!isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={18} color="#4CAF50" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Form */}
      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.value}>{user.name}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
          {isEditing && (
            <Text style={styles.helperText}>Email cannot be changed</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleChange("phone", value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{user.phone || "Not provided"}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Account Type</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.value}>
              {user.role === "admin" ? "Administrator" : "User"}
            </Text>
            <View
              style={[
                styles.roleBadge,
                user.role === "admin" && styles.adminRoleBadge,
              ]}
            >
              <Text style={styles.roleBadgeText}>
                {user.role === "admin" ? "ADMIN" : "USER"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Edit Mode Buttons */}
      {isEditing && (
        <View style={styles.editButtonsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsEditing(false)}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Additional Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleResetPassword}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <Text style={styles.actionButtonText}>Reset Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#F44336" />
          <Text style={[styles.actionButtonText, styles.logoutText]}>
            Logout
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfoContainer}>
        <Text style={styles.appVersion}>Turf Booking App v1.0.0</Text>
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
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 20,
    top: 20,
  },
  editButtonText: {
    marginLeft: 5,
    color: "#4CAF50",
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleBadge: {
    backgroundColor: "#e0f2f1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  adminRoleBadge: {
    backgroundColor: "#e8f5e9",
  },
  roleBadgeText: {
    color: "#009688",
    fontSize: 12,
    fontWeight: "bold",
  },
  editButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginHorizontal: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  saveButton: {
    flex: 2,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  actionsContainer: {
    backgroundColor: "#fff",
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  actionButtonText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  logoutText: {
    color: "#F44336",
  },
  appInfoContainer: {
    padding: 20,
    alignItems: "center",
  },
  appVersion: {
    color: "#999",
    fontSize: 12,
  },
});

export default MyProfile;
