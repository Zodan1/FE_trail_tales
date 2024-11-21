import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { fetchUserByUsername } from "../../api";

// Define types for user state
interface User {
  username: string;
  name: string;
  profile_img: string;
  points: number;
}

export default function AboutScreen() {
  const [user, setUser] = useState<User | null>(null); // Define user state with User type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Define error state with string type

  useEffect(() => {
    const username = "nature_lover"; // Replace with dynamic username if needed
    fetchUserByUsername(username)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error); //error handling for if user is not found
        setError("Failed to load user profile."); //app error display
        setLoading(false);
      });
  }, []);

  //loading wheel
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Image
            source={{ uri: user.profile_img }}
            style={styles.profileImage}
          />
          <Text style={styles.text}>Username: {user.username}</Text>
          <Text style={styles.text}>Name: {user.name}</Text>
          <Text style={styles.text}>Points: {user.points}</Text>
        </>
      ) : (
        <Text style={styles.text}>User not found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffafa",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    color: "#000000",
    fontSize: 18,
    marginVertical: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
});
