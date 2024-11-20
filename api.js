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

export function fetchPosts() {
  return api
    .get("/posts")
    .then((response) => {
      return response.data.posts;
    })
    .catch((error) => {
      console.error("Error fetching posts", error);
      throw error;
    });
}

export function fetchPostById(post_id) {
  return api
    .get(`/posts/${post_id}`)
    .then((response) => {
      return response.data.post;
    })
    .catch((error) => {
      console.error("Error fetching post by ID", error);
      throw error;
    });
}
