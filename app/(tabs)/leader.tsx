import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { fetchUsers } from "@/api";
interface User {
  username: string;
  name: string;
  profile_img: string;
  points: number;
}
export default function LeaderScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchUsers()
      .then((data) => {
        const sortUsers = data.sort((a: User, b: User) => b.points - a.points);
        setUsers(sortUsers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to load users.");
        setLoading(false);
      });
  }, []);
  //loading wheel
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00FF00" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>...</Text>
      <FlatList
        data={users}
        renderItem={({ item, index }) => (
          <View style={styles.userRow}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Image
              source={{ uri: item.profile_img }}
              style={styles.profile_img}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.points}>{item.points} points</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.username}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292E",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  text: {
    color: "#fff",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#25292E",
    borderRadius: 10,
    width: "100%",
  },
  profile_img: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  points: {
    fontSize: 16,
    color: "#666",
  },
  rank: {
    fontSize: 18,
    textAlign: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
  },
});
