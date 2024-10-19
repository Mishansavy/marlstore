import axios from "axios";

// Create an Axios instance
export const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionally, you can add a response interceptor to handle token refresh or other errors
api.interceptors.response.use(
  (response) => response, // Handle normal responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token (401 Unauthorized)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(
          "http://localhost:8000/api/api/auth/refresh/",
          {
            refresh: refreshToken,
          }
        );

        // Save the new access token
        localStorage.setItem("access_token", response.data.access);

        // Update the original request with the new access token and retry
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.access}`;
        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error("Token refresh failed: ", refreshError);
        // Optionally: logout the user or redirect to login page
      }
    }

    return Promise.reject(error);
  }
);
