import { Tabs } from "expo-router";
import { View, Image, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const LogoTitle = () => {
  return (
    <Image
      source={require("@/assets/images/ttIcon.png")} // Adjust the path to your logo image
      style={styles.logo} // Adjust to your logo size
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logoContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { width: 60, height: 60 },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => <LogoTitle />,
          title: "Trail Tales",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          title: "Posts",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "newspaper" : "newspaper-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              color="#00ff00"
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="leader"
        options={{
          title: "LeaderBoard",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "leaderboard" : "leaderboard"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
