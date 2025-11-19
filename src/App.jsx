import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";

import Login from "./assets/components/Auth/Login";
import Signup from "./assets/components/Auth/Signup";
import Navbar from "./assets/components/Navbar";
import TextAnalyzer from "./assets/components/TextAnalyzer";
import ReportIssue from "./assets/components/ReportIssue";
import Home from "./home";
import Dashboard from "./assets/components/Dashboard";
import FieldsManagement from "./assets/components/FieldsManagement";
import SetGooglePassword from "./assets/components/Auth/SetGooglePassword";

export default function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("authToken"),
    username: localStorage.getItem("username"),
    firebaseUser: null,
    needsGooglePassword: false,
    skippedGoogleSetup: false, // NEW: allow skipping Google password page
  });

  const handleBackendLogin = (token, username) => {
    setAuth((a) => ({
      ...a,
      token,
      username,
      needsGooglePassword: false,
      skippedGoogleSetup: false
    }));
    localStorage.setItem("authToken", token);
    localStorage.setItem("username", username);
  };

  useEffect(() => {
    const authInstance = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        const backendJwt = localStorage.getItem("authToken");
        const username = localStorage.getItem("username");
        if (!backendJwt || !username) {
          setAuth((a) => ({
            ...a,
            firebaseUser: user,
            needsGooglePassword: !a.skippedGoogleSetup, // only if not skipped
            token: null,
            username: null,
          }));
        } else {
          setAuth((a) => ({
            ...a,
            firebaseUser: user,
            username,
            token: backendJwt,
            needsGooglePassword: false,
            skippedGoogleSetup: false
          }));
        }
      } else {
        setAuth({
          token: null,
          username: null,
          firebaseUser: null,
          needsGooglePassword: false,
          skippedGoogleSetup: false
        });
        localStorage.removeItem("username");
        localStorage.removeItem("authToken");
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  const handleLogin = (token, username) => {
    setAuth({
      token,
      username,
      firebaseUser: null,
      needsGooglePassword: false,
      skippedGoogleSetup: false
    });
    localStorage.setItem("authToken", token);
    localStorage.setItem("username", username);
  };

  const handleLogout = () => {
    const authInstance = getAuth(firebaseApp);
    signOut(authInstance).catch(() => {});
    setAuth({
      token: null,
      username: null,
      firebaseUser: null,
      needsGooglePassword: false,
      skippedGoogleSetup: false
    });
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
  };

  const handleSkipGoogleSetup = () => {
    setAuth((a) => ({
      ...a,
      needsGooglePassword: false,
      skippedGoogleSetup: true,
    }));
  };

  return (
    <Router>
      {auth.needsGooglePassword && !auth.skippedGoogleSetup ? (
        <SetGooglePassword
          firebaseUser={auth.firebaseUser}
          onBackendLogin={handleBackendLogin}
          onSkip={handleSkipGoogleSetup}
        />
      ) : (
        <>
          <Navbar auth={auth} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportIssue auth={auth} />} />
            <Route path="/analyze-image" element={<ReportIssue auth={auth} />} />
            <Route path="/analyze-text" element={<TextAnalyzer />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard auth={auth} />} />
            <Route path="/fields" element={<FieldsManagement />} />
            <Route path="/image" element={<Navigate to="/analyze-image" replace />} />
          </Routes>
        </>
      )}
    </Router>
  );
}
