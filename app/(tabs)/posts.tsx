
// import {
//   Text,
//   View,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { FontAwesome } from "@expo/vector-icons";
// import { fetchPosts, postFavourite } from "@/api";
// import PostCard from "@/components/PostCards";

// interface Post {
//   post_id: number;
//   username: string;
//   post_img: string;
//   description: string;
//   created_at: string;
//   location: string;
// }

// const username = "nature_lover"; 

// export default function PostsScreen() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

//   useEffect(() => {
//     fetchPosts()
//       .then((data) => {
//         setPosts(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching posts:", error);
//         setError("Failed to load posts.");
//         setLoading(false);
//       });
//   }, []);

//   // Add or remove post from favorites
//   const toggleLike = async (postId: number) => {
//     setLikedPosts((prev) => {
//       const updated = new Set(prev);
//       if (updated.has(postId)) {
//         updated.delete(postId); 
//       } else {
//         updated.add(postId); 
//       }
//       return updated;
//     });

//     try {
//       // Make API call to either add or remove from favorites
//       const response = await postFavourite(username, postId);

//       if (response.success) {
//         console.log("Post added/removed from favorites successfully.");
//       } else {
//         console.error("Failed to update favorite status.");
//         setLikedPosts((prev) => {
//           const updated = new Set(prev);
//           if (updated.has(postId)) {
//             updated.delete(postId); 
//           } else {
//             updated.add(postId); 
//           }
//           return updated;
//         });
//       }
//     } catch (error) {
//       console.error("Error updating favorite status:", error);
//       setLikedPosts((prev) => {
//         const updated = new Set(prev);
//         updated.delete(postId); 
//         return updated;
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#00ff00" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={posts}
//         renderItem={({ item }) => (
//           <View style={styles.postContainer}>
//             <PostCard post={item} />
//             <TouchableOpacity
//               style={styles.likeButton}
//               onPress={() => toggleLike(item.post_id)}
//             >
//               <FontAwesome
//                 name="thumbs-up"
//                 size={24}
//                 color={likedPosts.has(item.post_id) ? "blue" : "red"}
//               />
//             </TouchableOpacity>
//           </View>
//         )}
//         keyExtractor={(item) => item.post_id.toString()}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#25292e",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 10,
//   },
//   text: {
//     color: "#333", 
//     fontFamily: 'Roboto',
//   },
//   postContainer: {
//     marginBottom: 20,
//     position: "relative",
//   },
//   likeButton: {
//     position: "absolute",
//     bottom: 30,
//     right: 10,
//   },
// });


import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { fetchPosts, postFavourite, deleteFavourite, fetchFavourites } from "@/api";
import PostCard from "@/components/PostCards";

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

  useEffect(() => {
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
}, [username]);
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
              style={styles.likeButton}
              onPress={() => toggleLike(item.post_id)}
            >
              <FontAwesome
                name="thumbs-up"
                size={24}
                color={likedPosts.has(item.post_id) ? "blue" : "red"}
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
  likeButton: {
    position: "absolute",
    bottom: 30,
    right: 10,
  },
});