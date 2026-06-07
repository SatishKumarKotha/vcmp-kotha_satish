  import axios from "axios";

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json"
    }
  });

  api.interceptors.request.use(
    (config) => {

      const token =
        localStorage.getItem(
          "accessToken"
        );

      if (token) {

        config.headers.Authorization =
          `Bearer ${token}`;

      }

      return config;

    }
  );

 api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    // Skip refresh for Login & Refresh APIs
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem(
            "refreshToken"
          );

        // No refresh token available
        if (!refreshToken) {

          localStorage.clear();

          window.location.href = "/";

          return Promise.reject(
            error
          );

        }

        const response =
          await axios.post(
            "http://localhost:5000/api/auth/refresh-token",
            {
              refreshToken
            }
          );

        const newAccessToken =
          response.data.result.accessToken;

        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(
          originalRequest
        );

      } catch (refreshError) {

        localStorage.clear();

        window.location.href = "/";

        return Promise.reject(
          refreshError
        );

      }

    }

    return Promise.reject(
      error
    );

  }

);

  export default api;