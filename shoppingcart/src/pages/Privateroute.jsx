import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContexts";
import "../Style/Authpage.css";

const Authpage = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext); // Assuming `loading` is part of the AuthContext
  const location = useLocation();

  if (loading) {
    return <div className="authpage-loader">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <div className="authpage-container">{children}</div>;
};

export default Authpage;
