/**
 * Authentication Service
 * Handles login API calls for partner authentication
 */

// ✅ Next.js environment variable access
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL + "/homent";

/**
 * Login with email and password
 */
export const loginWithEmail = async (email, password) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?eventType=USER_BROKER_LOGIN`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: email,
          password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Login failed. Please check your credentials.");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Login failed.");
  }
};

/**
 * Login with phone and OTP
 */
export const loginWithPhone = async (phone, otp) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?eventType=USER_BROKER_LOGIN`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: phone,
          password: "",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Login failed. Please check your credentials.");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Login failed.");
  }
};

/**
 * Store authentication data (CLIENT ONLY)
 */
export const storeAuthData = (data, userInfo, remember = true) => {
  if (typeof window === "undefined") return;

  const storage = remember ? window.localStorage : window.sessionStorage;

  storage.setItem(
    "authToken",
    data.token || data.accessToken || "api-token"
  );

  storage.setItem(
    "authUser",
    JSON.stringify({
      ...userInfo,
      ...data.user,
    })
  );

  storage.setItem("role", "broker");
};

/**
 * Clear authentication data (CLIENT ONLY)
 */
export const clearAuthData = () => {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem("authToken");
  window.localStorage.removeItem("authUser");
  window.localStorage.removeItem("role");

  window.sessionStorage.removeItem("authToken");
  window.sessionStorage.removeItem("authUser");
  window.sessionStorage.removeItem("role");
};
