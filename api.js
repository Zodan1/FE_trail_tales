import axios from "axios";

const api = axios.create({
  baseURL: "https://trail-tales-be.onrender.com/api",
});

export function fetchUserByUsername(username) {
  return api
    .get(`/users/${username}`)
    .then((response) => {
      return response.data.user;
    })
    .catch((error) => {
      console.error("Error fetching user", error);
      throw error;
    });
}

export function fetchPosts(username) {
  return api
    .get(`/posts/${username}`)
    .then((response) => {
      return response.data.posts;
    })
    .catch((error) => {
      console.error("Error fetching posts", error);
      throw error;
    });
}


export function fetchPostById(post_id,username) {
  return api
    .get(`/posts/${post_id}/${username}`)
    .then((response) => {
      return response.data.post;
    })
    .catch((error) => {
      console.error("Error fetching post by ID", error);
      throw error;
    });
}


export function postFavourite(username, post_id) {
  return api
    .post("/favourites", { username, post_id })
    .then((response) => {
      console.log("API response: ", response);  
      if (response && response.data && response.data.favouriteData) {
        return { success: true, favouriteData: response.data.favouriteData };
      } else {
        throw new Error("Unexpected response structure.");
      }
    })
    .catch((error) => {
      console.error("Error adding favourite", error);
      return { success: false, error: error.message || "Unknown error" };
    });
}


export function fetchFavourites(username) {
  return api
    .get(`/users/${username}/favourites`)
    .then((response) => response.data.favourites)
    .catch((error) => {
      console.error("Error fetching favourites", error);
      throw error;
    });
}

export async function deleteFavourite(username, post_id) {
  try {
    const response = await api.delete(`/users/${username}/favourites/${post_id}`);
    // Check for successful deletion (204 No Content)
    if (response.status === 204) {
      return { success: true };
    } else {
      throw new Error("Unexpected response status code");
    }
  } catch (error) {
    console.error("Error deleting favourite", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

export function fetchUsers() {
  return api
    .get("/users")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching users", error);
      throw error;
    });
}
