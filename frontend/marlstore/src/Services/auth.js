import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Function to refresh the access token
export const refreshAccessToken = async (navigate) => {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    console.error("No refresh token available");

    if (navigate) {
      navigate("/login"); // Redirect if no token
    }
    throw new Error("No refresh token available");
  }

  try {
    const response = await api.post("/api/auth/refresh/", {
      refresh: refreshToken,
    });
    localStorage.setItem("access_token", response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Failed to refresh access token", error);

    // Clear tokens on failure
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    if (navigate) {
      navigate("/login");
    }
    throw error;
  }
};

// Interceptor to add access token to requests
api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Ensure correct syntax
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken(); // Refresh token
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`; // Update default token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`; // Update request header

        return api(originalRequest); // Retry request
      } catch (err) {
        console.error("Token refresh failed, redirecting to login.");
      }
    }

    return Promise.reject(error);
  }
);
