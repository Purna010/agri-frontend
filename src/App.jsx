import React, { useState } from "react";

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const field = e.target.field.value;
    const description = e.target.description.value;

    // Show demo response message
    setResponseMessage(
      "Issue submitted successfully! AI indicates possible early-stage fungal disease in your crop."
    );

    // Reset form and clear file input
    e.target.reset();
    setSelectedFile(null);

    // Hide message after 5 seconds
    setTimeout(() => {
      setResponseMessage("");
    }, 5000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#23272a] via-[#2c2f3a] to-[#121416] flex flex-col items-center py-8">
      {/* Header */}
      <header className="w-full px-4 text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow mb-3">
          AgriGuard
        </h1>
        <div className="text-2xl font-medium text-[#43b581] mb-2">
          Protecting Crops with AI
        </div>
        <p className="text-lg text-[#b9bbbe] font-medium max-w-2xl mx-auto">
          Real-time crop monitoring and protection using AI insights. Your farm,
          your community, better protected.
        </p>
      </header>

      {/* Main Grid */}
      <div className="w-full flex flex-col md:flex-row gap-8 justify-center mb-10 px-6">
        {/* Crop Status */}
        <section className="flex-1 bg-[#252a2e] bg-opacity-95 rounded-2xl shadow-xl p-8 border border-[#43b581]/30">
          <h2 className="text-2xl font-bold text-[#43b581] mb-4">Crop Status</h2>
          <p className="text-lg text-white">
            <strong>Healthy crops:</strong> 85%
            <br />
            <strong>Attention needed:</strong> 15%
          </p>
        </section>
        {/* AI Alerts */}
        <section className="flex-1 bg-[#232934] bg-opacity-95 rounded-2xl shadow-xl p-8 border border-[#7289da]/40">
          <h2 className="text-2xl font-bold text-[#7289da] mb-4">AI Alerts</h2>
          <ul className="list-disc list-inside text-[#b9bbbe] text-lg">
            <li>Possible pest infestation detected in field A.</li>
            <li>Low soil moisture detected in field C.</li>
          </ul>
        </section>
      </div>

      {/* Report an Issue */}
      <section className="w-full max-w-2xl bg-[#23272a] rounded-2xl shadow-xl p-8 border border-[#43b581]/30">
        <h2 className="text-2xl font-bold text-[#43b581] mb-4">Report an Issue</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-[#b9bbbe] font-medium mb-2"
              htmlFor="field"
            >
              Field
            </label>
            <input
              id="field"
              name="field"
              required
              className="w-full p-3 bg-[#18191c] text-white border border-[#43b581]/50 rounded-lg focus:ring-2 focus:ring-[#43b581] placeholder:text-[#72767d]"
              placeholder="Field name or ID"
            />
          </div>
          <div>
            <label
              className="block text-[#b9bbbe] font-medium mb-2"
              htmlFor="description"
            >
              Issue Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className="w-full p-3 bg-[#18191c] text-white border border-[#43b581]/50 rounded-lg focus:ring-2 focus:ring-[#43b581] placeholder:text-[#72767d]"
              placeholder="Describe the issue"
            />
          </div>

          {/* File upload input */}
          <div>
            <label
              className="block text-[#b9bbbe] font-medium mb-2"
              htmlFor="file"
            >
              Upload Image for Disease Detection
            </label>
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-white"
            />
            {selectedFile && (
              <p className="text-sm text-green-500 mt-2">
                Selected File: {selectedFile.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-[#43b581] via-[#a3ffe7] to-[#43b581] text-[#23272a] font-bold rounded-lg shadow hover:from-[#43b581] hover:to-[#43b581] transition-colors"
          >
            Submit
          </button>
        </form>

        {/* Demo response message */}
        {responseMessage && (
          <div className="mt-6 p-4 bg-[#43b581] bg-opacity-80 text-[#23272a] rounded-lg font-semibold text-center">
            {responseMessage}
          </div>
        )}
      </section>
    </div>
  );
}
