import React, { useState } from "react";
import bgAgri from "/src/assets/bg-agri.jpg";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "/src/firebaseConfig";

export default function Signup({ onSignup }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email is required";
    if (!form.username.trim() || form.username.length < 3)
      return "Username must be at least 3 characters";
    if (!form.password || form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      setSuccess("");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: form.fullName,
            email: form.email,
            username: form.username,
            phone: form.phone,
            password: form.password,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Signup failed");
      }
      setSuccess("Signup successful! Please login.");
      setError("");
      setForm({
        fullName: "",
        email: "",
        username: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      onSignup && onSignup();
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  const handleGoogle = async () => {
    try {
      const auth = getAuth(firebaseApp);
      await signInWithPopup(auth, new GoogleAuthProvider());
      setSuccess("Google signup complete! You are signed in.");
      setError("");
    } catch (err) {
      setError("Google signup error: " + err.message);
      setSuccess("");
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
        className="relative z-10 max-w-md w-full bg-[#23272a] rounded-2xl shadow-xl p-8 border border-[#43b581]/30"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="text-3xl font-extrabold text-[#43b581] mb-6 text-center">Create your account</h2>
        <div className="grid grid-cols-1 gap-3">
          <input
            name="fullName"
            type="text"
            placeholder="Full name"
            value={form.fullName}
            onChange={onChange}
            required
            className="w-full p-3 rounded-lg bg-[#18191c] border border-[#43b581]/50 focus:ring-2 focus:ring-[#43b581] text-white placeholder:text-[#72767d]"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
            className="w-full p-3 rounded-lg bg-[#18191c] border border-[#43b581]/50 focus:ring-2 focus:ring-[#43b581] text-white placeholder:text-[#72767d]"
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={onChange}
            required
            className="w-full p-3 rounded-lg bg-[#18191c] border border-[#43b581]/50 focus:ring-2 focus:ring-[#43b581] text-white placeholder:text-[#72767d]"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={onChange}
            className="w-full p-3 rounded-lg bg-[#18191c] border border-[#43b581]/50 focus:ring-2 focus:ring-[#43b581] text-white placeholder:text-[#72767d]"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
            className="w-full p-3 rounded-lg bg-[#18191c] border border-[#43b581]/50 focus:ring-2 focus:ring-[#43b581] text-white placeholder:text-[#72767d]"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={onChange}
            required
            className="w-full p-3 rounded-lg bg-[#18191c] border border-[#43b581]/50 focus:ring-2 focus:ring-[#43b581] text-white placeholder:text-[#72767d]"
          />
        </div>
        {error && <p className="text-red-500 mt-3">{error}</p>}
        {success && <p className="text-green-500 mt-3">{success}</p>}
        <button
          type="submit"
          className="mt-5 w-full py-3 bg-gradient-to-r from-[#43b581] via-[#a3ffe7] to-[#43b581] text-[#23272a] font-bold rounded-lg shadow hover:from-[#43b581] hover:to-[#43b581] transition-colors"
        >
          Sign Up
        </button>
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#2f3338]" />
          <span className="text-[#9aa1a9] text-sm">or continue with</span>
          <div className="h-px flex-1 bg-[#2f3338]" />
        </div>
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
      </form>
    </div>
  );
}
