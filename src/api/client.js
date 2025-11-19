const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

if (typeof window !== "undefined") window.AGRI_BASE_URL = BASE_URL;
console.log("VITE_API_BASE_URL =", BASE_URL);

// Helper to get token from localStorage
function getAuthToken() {
  return localStorage.getItem("authToken") || null;
}

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function analyzeText(text) {
  console.log("POST ->", `${BASE_URL}/analyze_text`);
  const res = await fetch(`${BASE_URL}/analyze_text`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`analyzeText failed: ${res.status}`);
  return res.json();
}

export async function textToSpeech(text) {
  console.log("POST ->", `${BASE_URL}/text_to_speech`);
  const res = await fetch(`${BASE_URL}/text_to_speech`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`textToSpeech failed: ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function analyzeImage(file) {
  const form = new FormData();
  form.append("file", file);
  console.log("POST ->", `${BASE_URL}/analyze_image`, { file: file?.name });
  const res = await fetch(`${BASE_URL}/analyze_image`, {
    method: "POST",
    body: form,
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`analyzeImage failed: ${res.status}`);
  return res.json();
}

export async function signupUser(userData) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Signup failed");
  }
  return res.json();
}

export async function loginUser(credentials) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }
  return res.json(); // { access_token, token_type }
}

export async function getUserReports() {
  const res = await fetch(`${BASE_URL}/reports/me`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch user reports");
  return res.json();
}

export async function getUserFields() {
  const res = await fetch(`${BASE_URL}/fields/me`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch user fields");
  return res.json();
}

export async function createField(fieldData) {
  const res = await fetch(`${BASE_URL}/fields`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(fieldData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create field");
  }
  return res.json();
}

export async function createReport(reportData) {
  const res = await fetch(`${BASE_URL}/reports`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: reportData, // Expect FormData including image file and other fields
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create report");
  }
  return res.json();
}
