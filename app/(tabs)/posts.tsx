import { Text, View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity,} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { fetchPosts, postFavourite, deleteFavourite, fetchFavourites } from "@/api";
import PostCard from "@/components/PostCards";
import { useIsFocused } from "@react-navigation/native";

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

const username = "nature_lover"; 

export default function PostsScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

    const isFocused = useIsFocused();


  useEffect(() => {
    if (isFocused) { 
      const fetchPostsAndFavorites = async () => {
    try {
      const postsData = await fetchPosts(username);
      const favoritePosts = await fetchFavourites(username); 

      const likedPostsIds = favoritePosts.map((post: any) => post.post_id);
      setLikedPosts(new Set(likedPostsIds));
      setPosts(postsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts and favorites:", error);
      setError("Failed to load posts.");
      setLoading(false);
    }
  };

  fetchPostsAndFavorites();
    }
  
}, [isFocused,username]);
  // Add or remove post from favorites
  const toggleLike = async (postId: number) => {
  setLikedPosts((prev) => {
    const updated = new Set(prev);
    if (updated.has(postId)) {
      updated.delete(postId);
      deleteFavourite(username, postId) 
        .then(() => {
          console.log("Post removed from favorites successfully.");
        })
        .catch((error) => {
          console.error("Error removing post from favorites:", error);
          updated.add(postId);
        });
    } else {
      updated.add(postId);
      postFavourite(username, postId)
        .then(() => {
          console.log("Post added to favorites successfully.");
        })
        .catch((error) => {
          console.error("Error adding post to favorites:", error);
          updated.delete(postId);
        });
    }
    return updated;
  });
};

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
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <PostCard post={item} />
            <TouchableOpacity
              style={styles.star}
              onPress={() => toggleLike(item.post_id)}
            >
              <FontAwesome
                name="star"
                size={30}
                color={likedPosts.has(item.post_id) ? "gold" : "grey"}
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.post_id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  text: {
    color: "#333", 
    fontFamily: 'Roboto',
  },
  postContainer: {
    marginBottom: 20,
    position: "relative",
  },
  star: {
    position: "absolute",
    bottom: 30,
    right: 10,
  },
});