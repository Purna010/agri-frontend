import React, { useState } from "react";
import bgAgri from "/src/assets/bg-agri.jpg";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "/src/firebaseConfig";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }
      const data = await response.json();
      onLogin && onLogin(data.access_token, username);
      setError("");
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  const handleGoogle = async () => {
    try {
      const auth = getAuth(firebaseApp);
      await signInWithPopup(auth, new GoogleAuthProvider());
      setError("");
      navigate("/");
    } catch (err) {
      setError("Google login error: " + err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${bgAgri})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#23272a]/80 via-[#2c2f3a]/70 to-[#121416]/80 z-0"></div>
      <form
        className="relative z-10 max-w-sm w-full bg-[#23272a] rounded-2xl shadow-xl p-8 border border-[#43b581]/30"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold text-[#43b581] mb-6 text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 p-3 rounded-lg bg-[#18191c] border border-[#43b581]/50 focus:ring-2 focus:ring-[#43b581] text-white placeholder:text-[#72767d]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 p-3 rounded-lg bg-[#18191c] border border-[#43b581]/50 focus:ring-2 focus:ring-[#43b581] text-white placeholder:text-[#72767d]"
        />
        <div className="mt-4 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={handleGoogle}
            className="py-3 bg-[#ffffff] text-[#23272a] rounded-lg font-semibold hover:bg-[#f0f0f0] transition-colors"
            aria-label="Continue with Google"
          >
            Google
          </button>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 mt-4 bg-gradient-to-r from-[#43b581] via-[#a3ffe7] to-[#43b581] text-[#23272a] font-bold rounded-lg shadow hover:from-[#43b581] hover:to-[#43b581] transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
