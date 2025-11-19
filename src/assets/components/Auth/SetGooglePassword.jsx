import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function SetGooglePassword({ firebaseUser, onBackendLogin, onSkip }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [mode, setMode] = useState("signup");
  const navigate = useNavigate();

  const email = firebaseUser?.email || "";

  async function backendSignup() {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        full_name: firebaseUser?.displayName || username,
        phone: "",
        password,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Backend signup failed");
    }
    return res.json();
  }
  async function backendLogin() {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Backend login failed");
    }
    return res.json();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || password.length < 6) {
      setError("Username and strong password required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        await backendSignup();
      }
      const result = await backendLogin();
      localStorage.setItem("authToken", result.access_token);
      localStorage.setItem("username", username);
      onBackendLogin(result.access_token, username);
      navigate("/");
    } catch (err) {
      if (
        mode === "signup" &&
        (err.message || "").toLowerCase().includes("already registered")
      ) {
        setError("Account exists. Logging in...");
        setMode("login");
        try {
          const result = await backendLogin();
          localStorage.setItem("authToken", result.access_token);
          localStorage.setItem("username", username);
          onBackendLogin(result.access_token, username);
          navigate("/");
        } catch (loginErr) {
          setError("Account exists. Please enter your username and password to log in.");
        }
        setLoading(false);
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#23272a] p-6 rounded-lg w-full max-w-md text-white"
      >
        <h2 className="mb-4 text-xl font-bold">Setup AgriGuard Account</h2>
        <p className="mb-4 text-[#b9bbbe]">
          Welcome! Link your Google account to AgriGuard by setting a username and password.
        </p>
        <div className="mb-3">
          <label className="block mb-1">Email</label>
          <input
            value={email}
            readOnly
            className="w-full p-2 rounded bg-[#18191c] border border-[#43b581] mb-2"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 rounded bg-[#18191c] border border-[#43b581]"
            minLength={3}
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-[#18191c] border border-[#43b581]"
            minLength={6}
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full p-2 rounded bg-[#18191c] border border-[#43b581]"
            minLength={6}
          />
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-600 py-2 rounded hover:bg-green-700 font-bold"
          disabled={loading}
        >
          {loading
            ? mode === "signup"
              ? "Setting up..."
              : "Logging in..."
            : mode === "signup"
            ? "Link Account"
            : "Login"}
        </button>
        <button
          type="button"
          className="w-full mt-2 bg-gray-500 py-2 rounded hover:bg-gray-700 font-bold"
          onClick={onSkip}
        >
          Skip setup / Continue as guest
        </button>
      </form>
    </div>
  );
}