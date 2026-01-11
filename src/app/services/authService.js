/**
 * Authentication Service
 * Handles login API calls for partner authentication
 */

const API_BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE_URL + '/homent';

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - API response data
 */
export const loginWithEmail = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}?eventType=USER_BROKER_LOGIN`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: email,
                password: password
            }),
        });

        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Login failed.');
    }
};

/**
 * Login with phone and OTP
 * @param {string} phone - User phone number
 * @param {string} otp - OTP for verification
 * @returns {Promise<Object>} - API response data
 */
export const loginWithPhone = async (phone, otp) => {
    try {
        const response = await fetch(`${API_BASE_URL}?eventType=USER_BROKER_LOGIN`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: phone,
                password: "" // Phone login uses OTP, password might be empty
            }),
        });

        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Login failed.');
    }
};

/**
 * Store authentication data in storage
 * @param {Object} data - API response data
 * @param {Object} userInfo - Additional user information
 * @param {boolean} remember - Whether to use localStorage (true) or sessionStorage (false)
 */
export const storeAuthData = (data, userInfo, remember = true) => {
    const storage = remember ? localStorage : sessionStorage;

    storage.setItem("authToken", data.token || data.accessToken || "api-token");
    storage.setItem("authUser", JSON.stringify({
        ...userInfo,
        ...data.user // Include any additional user data from API
    }));
    storage.setItem("user_role", "broker"); // Set user as broker
};

/**
 * Clear authentication data from storage
 */
export const clearAuthData = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("user_role");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("user_role");
};