import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("AuthService Base URL:", API_BASE_URL);

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
});

const TOKEN_KEY = "jwt-auth-token";

export const login = async (username, password) => {
  try {
    const response = await authApiClient.post("/api/auth/login", {
      username,
      password,
    });

    if (response.data?.token) {
      return response.data.token;
    } else {
      throw new Error("No token returned from server");
    }
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const storeToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};
