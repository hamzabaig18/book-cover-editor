import axios from "axios";

let baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL,
  // headers: {
  //   "Content-Type": "application/json",
  //   Authorization: apiKey ? apiKey : "",
  // },
});

export default apiClient;
