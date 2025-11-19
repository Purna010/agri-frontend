import React, { useState, useEffect, useRef } from "react";
import bgAgri from "/src/assets/img.jpg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function getCropStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/crop_status`);
    if (!res.ok) throw new Error("Failed to fetch crop status");
    return await res.json();
  } catch (e) {
    return { healthy: "--", attention: "--" };
  }
}

async function getAiAlerts() {
  try {
    const res = await fetch(`${API_BASE_URL}/ai_alerts`);
    if (!res.ok) throw new Error("Failed to fetch AI alerts");
    const data = await res.json();
    return data?.alerts || [];
  } catch (e) {
    return [];
  }
}

export default function ReportIssue({ auth }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [diseaseResults, setDiseaseResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [cropStatus, setCropStatus] = useState({ healthy: "--", attention: "--" });
  const [aiAlerts, setAiAlerts] = useState([]);
  const [loadingCropStatus, setLoadingCropStatus] = useState(true);
  const [loadingAiAlerts, setLoadingAiAlerts] = useState(true);

  const [detailed, setDetailed] = useState(false); // NEW
  const fieldRef = useRef(null);
  const descriptionRef = useRef(null);

  const recognition = typeof window !== "undefined" && "webkitSpeechRecognition" in window
    ? new window.webkitSpeechRecognition()
    : null;

  const handleSpeechToText = () => {
    if (!recognition) {
      alert("Speech recognition is not supported by your browser.");
      return;
    }
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      if (descriptionRef.current) {
        descriptionRef.current.value = event.results[0][0].transcript;
      }
    };
    recognition.start();
  };

  useEffect(() => {
    setLoadingCropStatus(true);
    getCropStats().then(setCropStatus).finally(() => setLoadingCropStatus(false));
    setLoadingAiAlerts(true);
    getAiAlerts().then(setAiAlerts).finally(() => setLoadingAiAlerts(false));
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    setDiseaseResults([]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setDiseaseResults([]);
    if (selectedFiles.length === 0) {
      setError("Please upload at least one image before submitting.");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      selectedFiles.forEach((file) => {
        form.append("files", file);
      });
      form.append("description", descriptionRef.current?.value || "");
      form.append("field", fieldRef.current?.value || "");

      const response = await fetch(`${API_BASE_URL}/analyze_image?detailed=${detailed}`, {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error("AI prediction failed");
      const resData = await response.json();
      setDiseaseResults(resData.results || []);
    } catch (err) {
      setError(err.message);
      setDiseaseResults([]);
    } finally {
      setLoading(false);
      setSelectedFiles([]);
      setImagePreviews([]);
    }
  };

  const handleDownloadImage = async () => {
    if (!diseaseResults.length) return;
    const resultSection = document.getElementById("results-section");
    if (!resultSection) return;
    const canvas = await html2canvas(resultSection);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "agri-report.png";
    link.click();
  };

  const handleDownloadPDF = async () => {
    if (!diseaseResults.length) return;
    const resultSection = document.getElementById("results-section");
    if (!resultSection) return;
    const canvas = await html2canvas(resultSection);
    const imgData = canvas.toDataURL("image/jpeg");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "JPEG", 10, 10, 190, 0);
    pdf.save("agri-report.pdf");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center py-8 relative"
      style={{
        backgroundImage: `url(${bgAgri})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#23272a]/80 via-[#2c2f3a]/70 to-[#121416]/80 z-0"></div>
      <div className="relative z-10 w-full flex flex-col items-center max-w-5xl px-4">
        <section className="w-full max-w-2xl bg-[#23272a] rounded-2xl shadow-xl p-8 border border-[#43b581]/30">
          <h2 className="text-2xl font-bold text-[#43b581] mb-4">Report an Issue</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[#b9bbbe] font-medium mb-2" htmlFor="field">
                Field
              </label>
              <input
                id="field"
                name="field"
                ref={fieldRef}
                required
                className="w-full p-3 bg-[#18191c] text-white border border-[#43b581]/50 rounded-lg focus:ring-2 focus:ring-[#43b581] placeholder:text-[#72767d]"
                placeholder="Field name or ID"
              />
            </div>
            <div>
              <label className="block text-[#b9bbbe] font-medium mb-2" htmlFor="description">
                Issue Description
              </label>
              <div className="flex gap-2 items-center">
                <textarea
                  id="description"
                  name="description"
                  ref={descriptionRef}
                  rows="4"
                  className="w-full p-3 bg-[#18191c] text-white border border-[#43b581]/50 rounded-lg focus:ring-2 focus:ring-[#43b581] placeholder:text-[#72767d]"
                  placeholder="Describe the issue"
                />
                <button
                  type="button"
                  onClick={handleSpeechToText}
                  className="px-3 py-1 rounded bg-[#43b581] text-[#23272a] font-bold shadow"
                  title="Speak your description"
                >
                  🎤
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[#b9bbbe] font-medium mb-2" htmlFor="file">
                Upload Image for Disease Detection
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full text-white"
              />
              {imagePreviews.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-4">
                  {imagePreviews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Upload Preview ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded shadow"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Detailed solution toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="detailedToggle"
                checked={detailed}
                onChange={() => setDetailed((prev) => !prev)}
                className="accent-[#43b581]"
              />
              <label
                htmlFor="detailedToggle"
                className="text-[#b9bbbe] font-medium select-none"
              >
                Request detailed solution
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-[#43b581] via-[#a3ffe7] to-[#43b581] text-[#23272a] font-bold rounded-lg shadow hover:from-[#43b581] hover:to-[#43b581] transition-colors disabled:opacity-50"
            >
              {loading ? "Analyzing…" : "Submit"}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-[#7f1d1d] text-[#fde2e2] rounded-lg font-semibold text-center">
              Error: {error}
            </div>
          )}

          {/* Display Results */}
          {diseaseResults.length > 0 && (
            <section
              id="results-section"
              className="mt-4 w-full max-w-2xl space-y-6 bg-[#222] border-2 border-[#43b581] text-white rounded-lg p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-center">Results</h3>
              {diseaseResults.map((res, idx) => (
                <div
                  key={idx}
                  className="bg-[#32353c] p-4 rounded-lg border border-[#43b581] shadow flex flex-col gap-2"
                >
                  <p><strong>Disease Prediction:</strong> {res.prediction}</p>
                  <p><strong>User Description:</strong> {res.user_description || <i>N/A</i>}</p>
                  <p><strong>Causes:</strong> {res.causes}</p>
                  <p><strong>Solution:</strong></p>
                  <p style={{ whiteSpace: "pre-line" }}>{res.solution}</p>
                </div>
              ))}
              <div className="mt-6 flex justify-center gap-6">
                <button
                  onClick={handleDownloadImage}
                  className="px-5 py-2 bg-[#23272a] text-[#43b581] border border-[#43b581] rounded font-semibold hover:bg-[#202221]"
                >
                  Download Results as Image
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-5 py-2 bg-[#7289da] text-white rounded font-semibold hover:bg-[#6d79e0]"
                >
                  Download Results as PDF
                </button>
              </div>
            </section>
          )}
        </section>
      </div>
    </div>
  );
}
