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
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.tableHeaderCell]}>
            Position
          </Text>
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
    padding: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
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
  header: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#32363B",
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4A4E56",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#44484E",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: "#FFFFFF",
    paddingHorizontal: 8,
  },
  userCell: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  userInfo: {
    flex: 1,
    alignItems: "flex-end",
    paddingHorizontal: 8,
  },
  profile_img: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFA500",
  },
  points: {
    fontSize: 14,
    color: "#CFCFCF",
  },
  rank: {
    fontSize: 18,
    textAlign: "center",
    color: "#FFFFFF",
  },
});
