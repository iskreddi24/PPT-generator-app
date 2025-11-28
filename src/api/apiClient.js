// // import axios from 'axios';
// // import { getToken, logout } from './authService';

// // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // // Create a central Axios instance
// // const apiClient = axios.create({
// //   baseURL: API_BASE_URL,
// // });

// // // --- AXIOS REQUEST INTERCEPTOR ---
// // // This function runs before every single request is sent.
// // apiClient.interceptors.request.use(
// //   (config) => {
// //     // 1. Get the token from localStorage
// //     const token = getToken();

// //     // 2. If the token exists, add it to the Authorization header
// //     if (token) {
// //       config.headers['Authorization'] = `Bearer ${token}`;
// //     }

// //     // 3. Return the modified request configuration
// //     return config;
// //   },
// //   (error) => {
// //     // If an error occurs before the request is sent, reject the promise
// //     return Promise.reject(error);
// //   }
// // );

// // // --- AXIOS RESPONSE INTERCEPTOR ---
// // // This function runs for every response that comes back from the API.
// // apiClient.interceptors.response.use(
// //   // If the response is successful (status 2xx), just return it
// //   (response) => response,
  
// //   // If the response has an error (status 4xx or 5xx)
// //   (error) => {
// //     // Check if the error is specifically a 401 Unauthorized error
// //     if (error.response && error.response.status === 401) {
// //       // This means the token is either invalid, expired, or missing.

// //       // 1. Log the user out by removing the token from localStorage
// //       logout();
      
// //       // 2. Redirect the user to the login page.
// //       // We use window.location.href to force a full page reload, which
// //       // clears all component state and re-initializes the app.
// //       // We also check to make sure we're not already on the login page
// //       // to avoid an infinite redirect loop.
// //       if (window.location.pathname !== '/login') {
// //         window.location.href = '/login';
// //       }

// //       // 3. THE FIX: Return a new, non-rejecting promise.
// //       // This "swallows" the 401 error and prevents the calling component's .catch() 
// //       // block from running, which stops the "Something went wrong" message from 
// //       // appearing before the redirect.
// //       return new Promise(() => {});
// //     }

// //     // For any other errors (like 500, 404, etc.), we still want the component
// //     // that made the original request to be able to handle it. So, we pass them along.
// //     return Promise.reject(error);
// //   }
// // );

// // export default apiClient;
// import axios from 'axios';
// import { getToken, logout } from './authService';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
// });

// // Request Interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response Interceptor
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       logout();
//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//       return new Promise(() => {});
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;
import axios from "axios";
import { getToken, logout } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
