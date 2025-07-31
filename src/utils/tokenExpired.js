import { toast } from "react-hot-toast";

/**
 * Handles token expiration: shows a toast, removes token, and redirects.
 * @param {Object} [options] Optional settings for message, redirect path, and token key.
 * @param {string} [options.message] Custom error message for toast.
 * @param {string} [options.redirectPath] Path to redirect after token removal.
 * @param {string} [options.tokenKey] Key for the token in localStorage.
 */
export function tokenExpiration(options) {
  const {
    message = "Session expired. Please log in again.",
    redirectPath = "/login",
    tokenKey = "accessToken",
  } = options || {};

  try {
    toast.error(message);
    if (typeof window !== "undefined" && window.localStorage) {
      if (localStorage.getItem(tokenKey)) {
        localStorage.removeItem(tokenKey);
      }
      window.location.href = redirectPath;
    }
  } catch (error) {
    console.error("Error handling token expiration:", error);
  }
}
