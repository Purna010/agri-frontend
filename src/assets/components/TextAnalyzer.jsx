// src/assets/components/TextAnalyzer.jsx
import { useState } from "react";
import { analyzeText, textToSpeech } from "/src/api/client";

export default function TextAnalyzer() {
  const [text, setText] = useState("");
  const [data, setData] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setErr("");
    setData(null);
    try {
      const res = await analyzeText(text);
      setData(res);
    } catch (ex) {
      setErr(ex.message || "Analyze failed");
    } finally {
      setLoading(false);
    }
  };

  const onTTS = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setErr("");
    setAudioUrl(null);
    try {
      const url = await textToSpeech(text);
      setAudioUrl(url);
    } catch (ex) {
      setErr(ex.message || "TTS failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0d10", padding: "32px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", background: "#1c2128", borderRadius: 12, padding: 20, color: "#e6edf3", border: "1px solid #2d333b" }}>
        <h2 style={{ marginBottom: 12, color: "#7ee787" }}>Text Analyzer</h2>

        <textarea
          rows={6}
          placeholder="Type crop-related text here…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", padding: 12, background: "#0d1117", color: "#e6edf3", border: "1px solid #30363d", borderRadius: 8 }}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={onAnalyze} disabled={loading || !text.trim()} style={{ padding: "10px 14px", borderRadius: 8 }}>
            Analyze
          </button>
          <button onClick={onTTS} disabled={loading || !text.trim()} style={{ padding: "10px 14px", borderRadius: 8 }}>
            Speak
          </button>
        </div>

        {loading && <div style={{ marginTop: 12, padding: 8, background: "#2d333b" }}>Working…</div>}
        {err && <div style={{ marginTop: 12, padding: 8, background: "#3d1f1f", color: "#ffb4b4" }}>Error: {err}</div>}
        {data && <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{JSON.stringify(data, null, 2)}</pre>}
        {audioUrl && (
          <audio controls src={audioUrl} style={{ marginTop: 12, width: "100%" }} />
        )}
      </div>
    </div>
  );
}
