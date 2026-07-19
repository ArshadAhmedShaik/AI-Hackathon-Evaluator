"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import { adaptBackendResult } from "@/lib/adaptResult";

const sampleDescription = `Project Name: Smart Waste Management System

Our project is an AI-powered waste management platform that helps cities optimize garbage collection routes.

Features:
• Upload images of garbage bins
• AI detects whether bins are full using computer vision
• Predicts when bins will overflow
• Generates optimized collection routes
• Admin dashboard with analytics
• Real-time notifications

Tech Stack:
• Next.js
• Node.js
• Express.js
• MongoDB
• OpenAI API
• Python (YOLOv8)

Impact:
Reduces fuel consumption, prevents overflowing bins, and improves city cleanliness by making waste collection more efficient.
`;

export default function SubmissionForm() {
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  async function handleSubmit() {
    if (description.trim() === "") {
      alert("Please enter project description.");
      return;
    }

    setLoading(true);
    setDataReady(false);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description, repoUrl }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Evaluation failed. Try again.");
      }

      const raw = await res.json();
      const adapted = adaptBackendResult(raw);

      // Pass the result to the /results page without a backend database —
      // sessionStorage is enough for a single evaluate -> view flow.
      sessionStorage.setItem("evaluationResult", JSON.stringify(adapted));
      setDataReady(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      {loading && (
        <LoadingScreen
          dataReady={dataReady}
          onComplete={() => {
            router.push("/results");
          }}
        />
      )}

      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl">

        {/* Project Description Header */}
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold text-lg">
            Project Description
          </label>

          <button
            type="button"
            onClick={() => setDescription(sampleDescription)}
            className="text-sm bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
          >
            Use Sample Project
          </button>
        </div>

        {/* Textarea */}
        <div className="mb-6">
          <textarea
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-slate-800 p-4 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your project..."
          />
        </div>

        {/* GitHub URL */}
        <div className="mb-8">
          <label className="block mb-2 font-semibold text-lg">
            GitHub Repository (Optional)
          </label>

          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full rounded-xl bg-slate-800 p-4 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/username/project"
          />
        </div>

        {/* Evaluate Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-4 text-lg font-bold transition duration-300"
        >
          🚀 Evaluate Project
        </button>

      </div>
    </>
  );
}
