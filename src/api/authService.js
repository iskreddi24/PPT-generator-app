// src/api/authService.js
import axios from 'axios';

// The base URL should point to your backend's root, not just /api
const API_BASE_URL = 'http://192.168.0.204:8080';

// We use a separate Axios instance for the public login endpoint
// to avoid any potential interceptor issues before the user is logged in.
const authApiClient = axios.create({
  baseURL: API_BASE_URL,
});

const TOKEN_KEY = 'jwt-auth-token'; // A consistent key for localStorage

/**
 * Sends a login request to the backend.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<string>} A promise that resolves to the JWT if login is successful.
 */
export const login = async (username, password) => {
  try {
    const response = await authApiClient.post('/api/auth/login', {
      username,
      password,
    });
    
    // The backend should return an object like { token: "..." }
    if (response.data && response.data.token) {
      return response.data.token;
    } else {
      throw new Error('Login failed: No token received from server.');
    }
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    // Re-throw the error so the component calling this function can handle it (e.g., show an error message)
    throw error;
  }
};

/**
 * Stores the JWT in the browser's localStorage.
 * @param {string} token - The JWT received from the backend.
 */
export const storeToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieves the JWT from localStorage.
 * @returns {string|null} The stored token, or null if it doesn't exist.
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Removes the JWT from localStorage.
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};