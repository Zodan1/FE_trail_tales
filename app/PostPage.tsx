import { Text, View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { fetchPostById } from "@/api";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Post {
  post_id: number;
  username: string;
  post_img: string;
  description: string;
  created_at: string;
  location: string;
  location_coord: {
    x: number; // latitude
    y: number; // longitude
  };
}

export default function PostPageScreen() {
  const { post_id } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const username = "nature_lover";
    fetchPostById(post_id, username)
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        setError("Failed to load post.");
        setLoading(false);
      });
  }, [post_id]);

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
      {post ? (
        <View style={styles.container}>
          <Image source={{ uri: post.post_img }} style={styles.postImage} />
          <Text style={styles.text}>Username: {post.username}</Text>
          <Text style={styles.text}>Description: {post.description}</Text>
          <Text style={styles.text}>
            Posted on: {new Date(post.created_at).toLocaleString()}
          </Text>
          <Text style={styles.text}>
            Location: {post.location_coord.x} , {post.location_coord.y}
          </Text>
          <Text>
            location ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: post.location_coord.x,
                longitude: post.location_coord.y,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: post.location_coord.x,
                  longitude: post.location_coord.y,
                }}
                title={"Your Location"}
                description={`Lat: ${post.location_coord.x}, Long: ${post.location_coord.y}`}
              >
                <Ionicons name="location" size={24} color="red" />
              </Marker>
            </MapView>
            )
          </Text>
        </View>
      ) : (
        <Text style={styles.text}>Post not found.</Text>
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
  postImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  map: {
    flex: 1,
    width: 320,
    height: 200,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
  },
});
