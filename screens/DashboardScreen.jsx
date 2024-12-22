import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../services/firebaseAuth";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [theni, setImages] = useState([
    require("../assets/Images/theni.jpeg"),
    require("../assets/Images/theni1.jpeg"),
    require("../assets/Images/theni2.jpeg"),
  ]);

  const fadeAnim = new Animated.Value(0); // Animation for smooth fade-in

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchNotifications(userData);
    }
  }, [userData]);

  useEffect(() => {
    // Fade-in effect on screen load
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );

        const snapshot = await getDocs(q);
        const fetchedData = snapshot.docs.map((doc) => doc.data());

        if (fetchedData.length > 0) {
          setUserData(fetchedData[0]);
        } else {
          console.log("No user found");
        }
      } else {
        console.log("User is not logged in");
      }
    } catch (error) {
      console.log("Error getting user data:", error);
    }
  };

  const fetchNotifications = async (userData) => {
    try {
      const q = query(collection(db, "notifications"));
      const snapshot = await getDocs(q);
      const allNotifications = snapshot.docs.map((doc) => doc.data());

      const userLocation = userData.location.trim().toLowerCase();
      const filteredNotifications = allNotifications.filter((notification) => {
        const notificationLocation = notification.location.trim().toLowerCase();
        return notificationLocation === userLocation;
      });

      setNotifications(filteredNotifications);
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error during sign out:", error);
    }
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <Ionicons name="notifications" size={24} color="red" />

      <View style={styles.notificationDetails}>
        <Text style={styles.notificationText}>
          Location: {item.location}
        </Text>
        <Text style={styles.notificationText}>
          Message: {item.message}
        </Text>
        <Text style={styles.notificationText}>
          Sent At:{" "}
          {new Date(item.timestamp.seconds * 1000).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  const renderImageSlider = ({ item }) => (
    <Image source={item} style={styles.sliderImage} />
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Dashboard</Text>

      {/* User Profile Section */}
      <View style={styles.profileCard}>
        <Text style={styles.profileTitle}>User Profile</Text>
        {userData ? (
          <View style={styles.profileDetails}>
            <Text style={styles.profileText}>
              Location: {userData.location}
            </Text>
            <Text style={styles.profileText}>Email: {userData.email}</Text>
            <Text style={styles.profileText}>Role: {userData.role}</Text>
          </View>
        ) : (
          <Text style={styles.profileText}>Loading user data...</Text>
        )}
      </View>

      {/* Notifications Slider */}
      <Text style={styles.subTitle}>Notifications Alerts</Text>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.alertText}>No notifications for your location</Text>
      )}

      {/* Images Slider */}
      <Text style={styles.subTitle}>Location Images</Text>
      <FlatList
        data={theni}
        renderItem={renderImageSlider}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
    textShadowColor: "#888",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  profileCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  profileDetails: {
    marginTop: 10,
  },
  profileText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  notificationDetails: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  sliderImage: {
    width: 320,
    height: 220,
    borderRadius: 15,
    marginRight: 12,
    borderWidth: 3,
    borderColor: "#ccc",
  },
  logoutButton: {
    backgroundColor: "#ff3366",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
    elevation: 5,
    shadowColor: "#ff3366",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  logoutText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  alertText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});
