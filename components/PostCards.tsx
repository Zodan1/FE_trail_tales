import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface PostCardProps {
  post: {
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
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/PostPage?post_id=${post.post_id}`)}
    >

      <View style={styles.card}>
        <Image source={{ uri: post.post_img }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.description}>{post.description}</Text>
          <Text style={styles.createdAt}>
            Posted on: {new Date(post.created_at).toLocaleString()}
          </Text>
          <Text style={styles.location}>Location: {post.location_coord.x} , {post.location_coord.y}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 20,

    },
    image: {
      width: "100%",
      height: 300,
    },
    textContainer: {
      padding: 20,
    },
    username: {
      fontSize: 18,
      fontWeight: "bold",
      fontFamily: 'Roboto'
    },
    description: {
      fontSize: 14,
      marginVertical: 5,
    },
    createdAt: {
      fontSize: 12,
      color: "#555",
    },
    location: {
      fontSize: 12,
      color: "#555",
    },
  });

  export default PostCard;
