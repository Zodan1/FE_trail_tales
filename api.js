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
