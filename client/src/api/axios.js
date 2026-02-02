import axios from "axios";

const api = axios.create({
  baseURL: "https://ethixportal.onrender.com/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ethix_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest.url.includes("/users/refresh-token")
    ) {
      localStorage.removeItem("ethix_token");
      localStorage.removeItem("ethix_user");

      window.location.replace("/login");
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post("/users/refresh-token");

        const newToken = res.data.accessToken;

        localStorage.setItem("ethix_token", newToken);

        api.defaults.headers.common.Authorization =
          `Bearer ${newToken}`;

        processQueue(null, newToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        localStorage.removeItem("ethix_token");
        localStorage.removeItem("ethix_user");

        window.location.replace("/login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      localStorage.removeItem("ethix_token");
      localStorage.removeItem("ethix_user");

      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default api;
