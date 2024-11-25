

// import React, { useEffect, useState } from "react";
// import {
//   Text,
//   View,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import { fetchUserByUsername, fetchPosts, fetchFavourites } from "../../api";
// import { useRouter } from "expo-router";
// import { useIsFocused } from "@react-navigation/native";
// import PostCard from "@/components/PostCards";


// interface User {
//   username: string;
//   name: string;
//   profile_img: string;
//   points: number;
// }
// interface Post {
//   post_id: number;
//   username: string;
//   post_img: string;
//   description: string;
//   created_at: string;
//   location: string;
// }

// // Rank logic
// const getRank = (points: number) => {
//   const ranks = [
//     { min: 0, max: 10, name: "No Rank", symbol: "⚪️" },
//     { min: 10, max: 20, name: "Tortoise", symbol: "🐢" },
//     { min: 20, max: 30, name: "Cat", symbol: "🐈" },
//     { min: 30, max: 40, name: "Dog", symbol: "🐕" },
//     { min: 40, max: Infinity, name: "Lion", symbol: "🦁" },
//   ];
//   const rank = ranks.find((r) => points >= r.min && points < r.max);
//   const nextRank = ranks[ranks.indexOf(rank!) + 1];
//   return { current: rank!, next: nextRank || null };
// };

// export default function AboutScreen() {
//   const [user, setUser] = useState<User | null>(null); 
//   const [userPosts, setUserPosts] = useState<Post[]>([]);
//   const [favorites, setFavorites] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null); 
//   const [view, setView] = useState<string>("posts");
//   const { current, next } = getRank(user?.points || 0);
//   const router = useRouter();

//   const isFocused = useIsFocused();

//   useEffect(() => {
//     const username = "nature_lover"; 

//     if(isFocused){ 
//       Promise.all([fetchUserByUsername(username), fetchPosts(username), fetchFavourites(username)])
//       .then(([userData, allPosts, favoritePosts]) => {
//         console.log("fetchUserByUsername api call wih user data, allposts, favoritePosts");
//         setUser(userData);
//         const filteredPosts = allPosts.filter((post: Post) => post.username === username);
//         setUserPosts(filteredPosts);
//         setFavorites(favoritePosts); 
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching user:", error); 
//         setError("Failed to load user profile.");
//         setLoading(false);
//       });
//     }
//   }, [isFocused]);

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
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Profile Section */}
//       <View style={styles.header}>
//         <Image
//           source={{ uri: user?.profile_img }}
//           style={styles.profileImage}
//         />
//         <View>
//           <View style={styles.userInfo}>
//             <Text style={styles.text}>Username: {user?.username}</Text>
//             <Text style={styles.username}>{user?.name}</Text>
//             {/* Current Rank Button with Animal Symbol */}
//             <View style={styles.rankButtonsContainer}>
//               <TouchableOpacity style={styles.rankButton}>
//                 <Text style={styles.rankText}>
//                   Current Rank {current.symbol}
//                 </Text>
//               </TouchableOpacity>
//               {/* Next Rank Button with Animal Symbol */}
//               {next && (
//                 <TouchableOpacity style={styles.rankButton}>
//                   <Text style={styles.rankText}>Next Rank {next.symbol}</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//             <View>
//               {/* Total Points Button */}
//               <TouchableOpacity style={styles.pointsButton}>
//                 <Text style={styles.pointsText}>
//                   Total Points: {user?.points}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//       {/* Buttons for posts and favorites */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.button, view === "posts" && styles.activeButton]}
//           onPress={() => setView("posts")}
//         >
//           <Text style={styles.buttonText}>Posts</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.button, view === "favorites" && styles.activeButton]}
//           onPress={() => setView("favorites")}
//         >
//           <Text style={styles.buttonText}>Favorites</Text>
//         </TouchableOpacity>
//       </View>
//       {/* Display posts or favorites */}
//       <FlatList
//         data={view === "posts" ? userPosts : favorites}
//         keyExtractor={(item) => item.post_id.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.postCard}
//             onPress={() => router.push(`/PostPage?post_id=${item.post_id}`)}
//           >
//                         <PostCard post={item} />

//           </TouchableOpacity>
//         )}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No posts or favorites available.</Text>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 2,
//     backgroundColor: "#25292E",
//     padding: 16,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     //marginBottom: 0,
//     width: "66%",
//     height: "35%",
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   userInfo: {
//     marginLeft: 20,
//     flex: 1,
//   },
//   username: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   rankButtonsContainer: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     alignItems: "center",
//     marginTop: 20,
//     width: 100,
//     height: 100,
//   },
//   rankButton: {
//     backgroundColor: "#333",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginHorizontal: 5,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     minWidth: 120,
//   },
//   rankText: {
//     color: "#fff",
//     fontSize: 10,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   pointsButton: {
//     backgroundColor: "#FFA500",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginTop: 20,
//     borderRadius: 8,
//     alignItems: "center",
//     width: 170,
//     marginHorizontal: "auto",
//   },
//   pointsText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     marginVertical: 20,
//   },
//   button: {
//     backgroundColor: "#333",
//     padding: 10,
//     flex: 1,
//     alignItems: "center",
//     borderRadius: 5,
//   },
//   activeButton: {
//     backgroundColor: "#FFA500",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//   },
//   postCard: {
//     width: 500,
//     height: 500,
//     backgroundColor: "#333",
//     borderRadius: 10,
//     marginVertical: 10,
//     padding: 10,
    
//   },
//   postImage: {
//     width: "100%",
//     height: 150,
//     borderRadius: 10,
//   },
//   postDescription: {
//     color: "#fff",
//     fontSize: 16,
//     marginTop: 10,
//   },
//   emptyText: {
//     color: "#fff",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   errorText: {
//     color: "red",
//     fontSize: 16,
//   },
//   text: {
//     color: "#fff",
//   },
// }); 

import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { fetchUserByUsername, fetchPosts, fetchFavourites } from "../../api";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import PostCard from "@/components/PostCards";


interface User {
  username: string;
  name: string;
  profile_img: string;
  points: number;
}
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

// Rank logic
const getRank = (points: number) => {
  const ranks = [
    { min: 0, max: 10, name: "No Rank", symbol: "⚪️" },
    { min: 10, max: 20, name: "Tortoise", symbol: "🐢" },
    { min: 20, max: 30, name: "Cat", symbol: "🐈" },
    { min: 30, max: 40, name: "Dog", symbol: "🐕" },
    { min: 40, max: Infinity, name: "Lion", symbol: "🦁" },
  ];
  const rank = ranks.find((r) => points >= r.min && points < r.max);
  const nextRank = ranks[ranks.indexOf(rank!) + 1];
  return { current: rank!, next: nextRank || null };
};

export default function AboutScreen() {
  const [user, setUser] = useState<User | null>(null); 
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [view, setView] = useState<string>("posts");
  const { current, next } = getRank(user?.points || 0);
  const router = useRouter();

  const isFocused = useIsFocused();

  useEffect(() => {
    const username = "nature_lover"; 

    if(isFocused){ 
      Promise.all([fetchUserByUsername(username), fetchPosts(username), fetchFavourites(username)])
      .then(([userData, allPosts, favoritePosts]) => {
        console.log("fetchUserByUsername api call wih user data, allposts, favoritePosts");
        setUser(userData);
        const filteredPosts = allPosts.filter((post: Post) => post.username === username);
        setUserPosts(filteredPosts);
        setFavorites(favoritePosts); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error); 
        setError("Failed to load user profile.");
        setLoading(false);
      });
    }
  }, [isFocused]);

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
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: user?.profile_img }}
          style={styles.profileImage}
        />
        <View>
          <View style={styles.userInfo}>
            <Text style={styles.text}>Username: {user?.username}</Text>
            <Text style={styles.username}>{user?.name}</Text>
            {/* Current Rank Button with Animal Symbol */}
            <View style={styles.rankButtonsContainer}>
              <TouchableOpacity style={styles.rankButton}>
                <Text style={styles.rankText}>
                  Current Rank {current.symbol}
                </Text>
              </TouchableOpacity>
              {/* Next Rank Button with Animal Symbol */}
              {next && (
                <TouchableOpacity style={styles.rankButton}>
                  <Text style={styles.rankText}>Next Rank {next.symbol}</Text>
                </TouchableOpacity>
              )}
            </View>
            <View>
              {/* Total Points Button */}
              <TouchableOpacity style={styles.pointsButton}>
                <Text style={styles.pointsText}>
                  Total Points: {user?.points}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* Buttons for posts and favorites */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, view === "posts" && styles.activeButton]}
          onPress={() => setView("posts")}
        >
          <Text style={styles.buttonText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, view === "favorites" && styles.activeButton]}
          onPress={() => setView("favorites")}
        >
          <Text style={styles.buttonText}>Favorites</Text>
        </TouchableOpacity>
      </View>
      {/* Display posts or favorites */}
      <FlatList
        data={view === "posts" ? userPosts : favorites}
        keyExtractor={(item) => item.post_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.postCard}
            onPress={() => router.push(`/PostPage?post_id=${item.post_id}`)}
          >
                        <PostCard post={item} />

          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No posts or favorites available.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#25292E",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    //marginBottom: 0,
    width: "66%",
    height: "35%",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  username: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  rankButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
    width: 100,
    height: 100,
  },
  rankButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  rankText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  pointsButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
    width: 170,
    marginHorizontal: "auto",
  },
  pointsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#333",
    padding: 10,
    flex: 1,
    alignItems: "center",
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: "#FFA500",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  postCard: {
    width: 500,
    height: 500,
    backgroundColor: "#333",
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    
  },
  postImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  postDescription: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  text: {
    color: "#fff",
  },
}); 