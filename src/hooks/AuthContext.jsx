// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase"; // Import the Firebase auth instance
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Create a context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component that wraps around the app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Log in function
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Log out function
  const logout = () => {
    return signOut(auth);
  };

  // Set up the onAuthStateChanged listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Set loading to false once the user is known
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children once loading is complete */}
    </AuthContext.Provider>
  );
};
