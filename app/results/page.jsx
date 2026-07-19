"use client";
import { jsPDF } from "jspdf";
import Link from "next/link";
import { useEffect, useState } from "react";

import mockResult from "@/data/mockResult";

import OverallScore from "@/components/OverallScore";
import AgentCard from "@/components/AgentCard";
import RadarGraph from "@/components/RadarGraph";

import ScoreCard from "@/components/ScoreCard";
import FeedbackCard from "@/components/FeedbackCard";

export default function Page() {
  const [result, setResult] = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("evaluationResult");
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading external storage on mount, standard pattern
      setResult(JSON.parse(stored));
    } else {
      // Nobody submitted anything this session (e.g. page refresh, or
      // someone navigated here directly) — fall back to the mock so the
      // page never crashes, but flag it so it's obvious it's not real.
      setResult(mockResult);
      setUsingMock(true);
    }
  }, []);

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading results...</p>
      </main>
    );
  }

  const { parser, scores, feedback } = result;

  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("AI Hackathon Evaluation Report", 20, 20);

    doc.setFontSize(16);
    doc.text(`Project: ${parser.title}`, 20, 40);

    doc.text("Scores", 20, 60);

    doc.setFontSize(13);
    doc.text(`Overall: ${scores.overall}/10`, 30, 75);
    doc.text(`Originality: ${scores.originality}/10`, 30, 85);
    doc.text(`Technical Depth: ${scores.technicalDepth}/10`, 30, 95);
    doc.text(`Demo Quality: ${scores.demoQuality}/10`, 30, 105);
    doc.text(`Impact: ${scores.impact}/10`, 30, 115);

    doc.setFontSize(16);
    doc.text("Tech Stack", 20, 140);

    parser.techStack.forEach((tech, index) => {
      doc.setFontSize(12);
      doc.text(`• ${tech}`, 30, 150 + index * 10);
    });

    const feedbackStart = 150 + parser.techStack.length * 10 + 20;

    doc.setFontSize(16);
    doc.text("AI Suggestions", 20, feedbackStart);

    feedback.forEach((item, index) => {
      doc.setFontSize(12);
      doc.text(`• ${item}`, 30, feedbackStart + 12 + index * 10);
    });

    doc.save("AI_Evaluation_Report.pdf");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {usingMock && (
          <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-sm rounded-lg px-4 py-3 mb-8 text-center">
            Showing sample data — no submission found for this session. Go back and evaluate a real project.
          </div>
        )}

        {/* Heading */}

        <h1 className="text-5xl font-bold text-center mb-12">
          🤖 AI Evaluation Results
        </h1>

        {/* Overall Score */}

        <OverallScore score={scores.overall} />

        {/* AI Agent Cards */}

        <div className="grid md:grid-cols-4 gap-6 my-12">

          <AgentCard
            icon="🤖"
            title="Parser"
            subtitle="Extracted project information"
          />

          <AgentCard
            icon="🧠"
            title="Depth Checker"
            subtitle="Repository analyzed"
          />

          <AgentCard
            icon="📊"
            title="Scorer"
            subtitle="Calculated category scores"
          />

          <AgentCard
            icon="💡"
            title="Feedback"
            subtitle="Generated improvements"
          />

        </div>

        {/* Radar Chart */}

        <div className="mb-12">
          <RadarGraph scores={scores} />
        </div>

        {/* Score Cards */}

        <div className="grid md:grid-cols-2 gap-6 mb-12">

          <ScoreCard
            title="Originality"
            score={scores.originality}
          />

          <ScoreCard
            title="Technical Depth"
            score={scores.technicalDepth}
          />

          <ScoreCard
            title="Demo Quality"
            score={scores.demoQuality}
          />

          <ScoreCard
            title="Impact"
            score={scores.impact}
          />

        </div>

        {/* Parsed Project */}

        <div className="bg-slate-900 rounded-2xl border border-slate-700 p-8 mb-12">

          <h2 className="text-3xl font-bold mb-6">
            📄 Parsed Project
          </h2>

          <p className="text-xl mb-8">
            <span className="font-semibold">
              Project Name:
            </span>{" "}
            {parser.title}
          </p>

          <h3 className="text-2xl font-semibold mb-5">
            🛠 Tech Stack
          </h3>

          <div className="flex flex-wrap gap-4">

            {parser.techStack.map((tech, index) => (

              <span
                key={index}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 rounded-full text-white shadow-md"
              >
                {tech}
              </span>

            ))}

          </div>

        </div>

        {/* Feedback */}

        <FeedbackCard feedback={feedback} />

        {/* Buttons */}

        <div className="flex justify-center gap-6 mt-12">

          <Link href="/">

            <button className="bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl font-bold text-lg">

              🔄 Evaluate Again

            </button>

          </Link>

         <button
  onClick={downloadReport}
  className="bg-green-600 hover:bg-green-700 transition px-8 py-4 rounded-xl font-bold text-lg"
>
  📄 Download Report
</button>

        </div>

      </div>

    </main>
  );
}
