// src/assets/components/ImageAnalyzer.jsx
import { useState } from "react";
import { analyzeImage } from "/src/api/client";

export default function ImageAnalyzer() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setErr("");
    setData(null);
    try {
      const res = await analyzeImage(file);
      setData(res);
    } catch (ex) {
      setErr(ex.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0d10", padding: "32px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", background: "#1c2128", borderRadius: 12, padding: 20, color: "#e6edf3", border: "1px solid #2d333b" }}>
        <h2 style={{ marginBottom: 12, color: "#7ee787" }}>Image Analyzer</h2>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ color: "#e6edf3" }}
          />
          <button type="submit" disabled={loading || !file} style={{ padding: "10px 14px", borderRadius: 8 }}>
            Analyze Image
          </button>
        </form>

        {loading && <div style={{ marginTop: 12, padding: 8, background: "#2d333b" }}>Uploading & analyzing…</div>}
        {err && <div style={{ marginTop: 12, padding: 8, background: "#3d1f1f", color: "#ffb4b4" }}>Error: {err}</div>}
        {data && <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  );
}
