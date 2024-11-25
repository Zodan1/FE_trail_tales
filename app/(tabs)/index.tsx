import {
  Text,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
// Define types for location state

interface LocationCoords {
  latitude: number;
  longitude: number;
}
interface Post {
  post_id: number;
  username: string;
  post_img: string;
  description: string;
  created_at: string;
  location_coord: {
    x: number; // latitude
    y: number; // longitude
  };
}

export default function Index() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Request user location when the app opens
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission denied",
            "Location access is required to use this app."
          );
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
        Alert.alert("Error", "Failed to fetch user location.");
      } finally {
        setIsLoading(false);
      }
    };
    getLocation();
  }, []);
  // Fetch nearby posts when location is set
  useEffect(() => {
    if (location) {
      fetchNearbyPosts();
    }
  }, [location]);
  const fetchNearbyPosts = async () => {
    try {
      const response = await fetch(
        `https://trail-tales-be.onrender.com/api/postsByMap?latitude=${location?.latitude}&longitude=${location?.longitude}&radius=20000000000000`
      );
      if (!response.ok) throw new Error("Failed to fetch nearby posts.");
      const data = await response.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch posts nearby.");
    }
  };
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00FF00" />
        <Text>Loading your location...</Text>
      </View>
    );
  }
  return (
    <View style={styles.containerIndex}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* User's Location Marker */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={"You are here"}
            pinColor="blue"
          />
          {/* Markers for Nearby Posts */}
          {posts.map((post) => (
            <Marker
              key={post.post_id}
              coordinate={{
                latitude: post.location_coord.x, // latitude
                longitude: post.location_coord.y, // longitude
              }}
              title={post.username}
              description={post.description}
            >
              <View style={styles.markerImageContainer}>
                <Image
                  source={{ uri: post.post_img }}
                  style={styles.markerImage}
                  resizeMode="cover"
                />
              </View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <Text>No location available.</Text>
      )}
      <Text style={styles.text}>Home screen</Text>

      <Link href="/test" style={styles.button}>
        Go to test screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  containerIndex: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "90%",
  },
  markerImageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});