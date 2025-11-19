import React from "react";
import bgImage from "/src/assets/image.jpg"; // Your attached file

const DEVS = [
  {
    name: "Gabbur Sripurna",
    role: "Backend & API Developer",
    github: "",
    linkedin: "https://www.linkedin.com/in/gabbur-sripurna69/",
  },
  {
    name: "Akash H.R.",
    role: "Frontend Developer",
    github: "",
    linkedin: "https://www.linkedin.com/in/akash-h-r-5a1831378/",
  },
  {
    name: "G.P. Anush Kumar",
    role: "AI/ML Integration Engineer",
    github: "",
    linkedin: "https://www.linkedin.com/in/anush-kumar-824b09354/",
  },
];

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

function DeveloperCard({ dev }) {
  return (
    <div className="bg-[#23272a] border border-[#2f3338] rounded-xl p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-[#2d333b] flex items-center justify-center text-[#7ee787] font-bold">
        {initials(dev.name)}
      </div>
      <div className="flex-1">
        <div className="text-white font-semibold">{dev.name}</div>
        <div className="text-sm text-[#9aa1a9]">{dev.role}</div>
      </div>
      <div className="flex gap-2">
        {dev.github ? (
          <a
            href={dev.github}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded-md bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm hover:bg-[#161b22]"
            aria-label={`${dev.name} GitHub`}
          >
            GitHub
          </a>
        ) : null}
        {dev.linkedin ? (
          <a
            href={dev.linkedin}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded-md bg-[#0a66c2] text-white text-sm hover:opacity-90"
            aria-label={`${dev.name} LinkedIn`}
          >
            LinkedIn
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center py-8 relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay to improve text contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#23272a]/80 to-[#223314]/80 z-0"></div>
      <div className="relative z-10 w-full flex flex-col items-center">
        <header className="w-full px-4 text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow mb-3">
            AgriGuard
          </h1>
          <div className="text-2xl font-medium text-[#43b581] mb-2">
            Protecting Crops with AI
          </div>
          <p className="text-lg text-[#b9bbbe] font-medium max-w-2xl mx-auto">
            Welcome to AgriGuard! Your partner in smart, AI-powered crop monitoring and protection.
            Navigate to report issues and monitor your fields.
          </p>
        </header>

        <section className="w-full max-w-2xl bg-[#23272a] rounded-2xl shadow-xl p-8 border border-[#43b581]/30 text-center mb-8">
          <h2 className="text-3xl font-bold text-[#43b581] mb-6">How It Works</h2>
          <ul className="text-[#b9bbbe] text-lg list-disc list-inside space-y-3 text-left">
            <li>Upload images of your crops to detect potential diseases.</li>
            <li>Receive AI-powered analysis and alerts.</li>
            <li>Access reports on crop health and recommendations.</li>
          </ul>
        </section>

        <section className="w-full max-w-4xl bg-[#1f2428] rounded-2xl shadow-xl p-8 border border-[#2f3338]">
          <h3 className="text-2xl font-bold text-white mb-4">Meet the Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEVS.map((dev) => (
              <DeveloperCard key={dev.name} dev={dev} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
