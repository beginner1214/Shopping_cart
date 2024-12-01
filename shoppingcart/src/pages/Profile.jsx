import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContexts";
import "../Style/Profilepage.css";

const Profilepage = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {currentUser ? (
        <div>
          <p>Welcome, {currentUser.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profilepage;
