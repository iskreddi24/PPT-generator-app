// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
// We import all the helper functions from our authService
import { login as apiLogin, storeToken, getToken, logout as apiLogout } from '../api/authService';

// 1. Create the context with a default value
const AuthContext = createContext(null);

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
  // --- STATE ---
  const [token, setToken] = useState(getToken()); // Initialize state from localStorage
  const [isLoading, setIsLoading] = useState(true); // Start in a loading state

  // This effect runs only once when the app starts.
  // It checks localStorage to see if a user was already logged in.
  useEffect(() => {
    const initialToken = getToken();
    if (initialToken) {
      setToken(initialToken);
    }
    // Finished the initial check, no longer loading.
    setIsLoading(false);
  }, []);

  // --- DERIVED STATE ---
  // isAuthenticated is not a piece of state itself, but is derived from the token.
  // A user is authenticated if there is a token.
  const isAuthenticated = !!token;

  // --- FUNCTIONS ---

  /**
   * Handles the login process by calling the API, storing the token, and updating state.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<void>}
   */
  const login = async (username, password) => {
    try {
      const receivedToken = await apiLogin(username, password);
      storeToken(receivedToken);
      setToken(receivedToken);
    } catch (error) {
      // If login fails, we ensure the token state is cleared.
      apiLogout();
      setToken(null);
      // Re-throw the error so the LoginPage can display a message
      throw error;
    }
  };

  /**
   * Handles the logout process by clearing the token from storage and state.
   */
  const logout = () => {
    apiLogout();
    setToken(null);
  };

  // The value that will be provided to all consuming components
  const value = {
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  // We don't render anything until the initial loading check is complete.
  // This prevents a "flash" of the wrong page on app load.
  if (isLoading) {
    return null; // Or you could return a full-page loading spinner here
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};