import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "/src/firebaseConfig";

export default function Navbar({ auth, onLogout }) {
  const loggedIn = !!auth.token || !!auth.firebaseUser;
  const username = auth.username || (auth.firebaseUser ? auth.firebaseUser.displayName || auth.firebaseUser.email : null);

  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout && onLogout();
    const authInstance = getAuth(firebaseApp);
    signOut(authInstance)
      .catch(() => {})
      .finally(() => {
        navigate("/login");
        window.location.reload();
      });
  };

  return (
    <nav className="bg-[#23272a] p-4 flex justify-center space-x-6">
      <Link to="/" className="text-[#43b581] font-bold hover:underline">Home</Link>
      <Link to="/report" className="text-[#43b581] font-bold hover:underline">Report an Issue</Link>
      {loggedIn ? (
        <>
          <Link to="/dashboard" className="text-[#43b581] font-bold hover:underline">Dashboard</Link>
          <Link to="/fields" className="text-[#43b581] font-bold hover:underline">Fields</Link>
          <span className="text-[#43b581] font-semibold">Welcome, {username}</span>
          <button onClick={handleLogoutClick} className="text-[#f04747] font-bold hover:underline">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-[#43b581] font-bold hover:underline">Login</Link>
          <Link to="/signup" className="text-[#43b581] font-bold hover:underline">Signup</Link>
        </>
      )}
    </nav>
  );
}
