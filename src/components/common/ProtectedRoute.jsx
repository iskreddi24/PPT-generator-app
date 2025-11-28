// // // src/components/common/ProtectedRoute.jsx
// // import { Navigate, useLocation } from 'react-router-dom';
// // import { useAuth } from '../../context/AuthContext';

// // /**
// //  * A wrapper component that protects routes requiring authentication.
// //  * If the user is authenticated, it renders the child components.
// //  * If the user is not authenticated, it redirects them to the /login page,
// //  * preserving the location they were trying to access.
// //  */
// // const ProtectedRoute = ({ children }) => {
// //   // Get the authentication status from our global context
// //   const { isAuthenticated } = useAuth();
  
// //   // Get the current location to redirect back to it after login
// //   const location = useLocation();

// //   // If the user is not authenticated, redirect them to the login page.
// //   // We pass the current location in the state so that after a successful login,
// //   // we can redirect the user back to the page they were originally trying to visit.
// //   if (!isAuthenticated) {
// //     return <Navigate to="/login" state={{ from: location }} replace />;
// //   }

// //   // If the user is authenticated, render the children components that this
// //   // route is protecting (e.g., the Layout and DashboardPage).
// //   return children;
// // };

// // export default ProtectedRoute;
// // src/components/common/ProtectedRoute.jsx
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();
//   const location = useLocation();

//   // 1️⃣ While AuthContext is still checking token → don't redirect
//   if (isLoading) {
//     return null; // or return <p>Loading...</p>
//   }

//   // 2️⃣ After loading, if not authenticated → go to login
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 3️⃣ Otherwise → allow access
//   return children;
// };

// export default ProtectedRoute;
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1️⃣ WAIT for AuthContext to finish loading
  if (isLoading) {
    return null;
  }

  // 2️⃣ If not authenticated → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
