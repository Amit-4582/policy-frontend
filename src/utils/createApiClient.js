import axios from "axios";

// Get API base URLs
function getApiBaseUrls() {
  const envUrl = process.env.REACT_APP_NODE_API_URL;
  const urls = [];
  if (envUrl && /^https?:\/\//.test(envUrl)) {
    urls.push(envUrl);
  }
  // Add fallback URL from environment variable
  const fallbackUrl = process.env.REACT_APP_NODE_API_URL;
  if (fallbackUrl && /^https?:\/\//.test(fallbackUrl)) {
    urls.push(fallbackUrl);
  }
  if (urls.length === 0) {
    throw new Error("No valid API base URLs configured.");
  }
  return urls;
}

const NODE_API_URLS = getApiBaseUrls();

// Enhanced token management
function getToken() {
  return localStorage.getItem("accessToken");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function setTokens(accessToken, refreshToken) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
}

// Create axios instance
export const createApiClient = axios.create({
  baseURL: NODE_API_URLS[0],
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
createApiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with token refresh logic
createApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Attempt to refresh token
        const response = await axios.post(
          `${NODE_API_URLS[0]}/auth/refresh-token`,
          {
            refreshToken,
          }
        );

        const { accessToken, newRefreshToken } = response.data;
        setTokens(accessToken, newRefreshToken || refreshToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return createApiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    // Fallback to alternate URLs if available
    if (
      originalRequest &&
      !originalRequest._retried &&
      NODE_API_URLS.length > 1 &&
      typeof originalRequest.baseURL === "string"
    ) {
      originalRequest._retried = true;
      const currentUrlIndex = NODE_API_URLS.indexOf(originalRequest.baseURL);
      const nextUrlIndex = (currentUrlIndex + 1) % NODE_API_URLS.length;
      originalRequest.baseURL = NODE_API_URLS[nextUrlIndex];
      console.warn(`Retrying with alternate URL: ${originalRequest.baseURL}`);
      return createApiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);