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
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.tableHeaderCell]}>Rank</Text>
          <Text style={[styles.tableCell, styles.tableHeaderCell]}>User</Text>
          <Text style={[styles.tableCell, styles.tableHeaderCell]}>Points</Text>
        </View>
        <FlatList
          data={users}
          renderItem={({ item, index }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <View style={styles.userCell}>
                <Image
                  source={{ uri: item.profile_img }}
                  style={styles.profile_img}
                />
                <Text style={styles.username}>{item.username}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.points}>{item.points} points</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.username}
        />
      </View>
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#00ff00",
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
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 4,
    color: "#ffffff",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    color: "#000000",
  },
  userCell: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
  },
});
