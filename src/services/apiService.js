import axios from "axios";

// Get the base URL from environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Check if the base URL is defined
if (!baseURL) {
    throw new Error("VITE_API_BASE_URL environment variable is not defined.");
}

// Create an Axios instance with the base URL
const instance = axios.create({
    baseURL
});

export default instance;