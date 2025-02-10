import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Services/Firebaseauth.js"; // Changed import

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      // Optionally, you could add a toast or error notification here
    }
  };

  // Optional: Add method to check if user is authenticated
  const isAuthenticated = () => !!currentUser;

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        logout, 
        isAuthenticated 
      }}
    >
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}

export default AuthProvider;