"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const stages = [
  "🤖 Agent 1: Parsing project...",
  "📂 Agent 2: Analyzing GitHub repository...",
  "📊 Agent 3: Scoring submission...",
  "💡 Agent 4: Generating feedback...",
];

// Real evaluation takes ~20-30s (4 sequential AI calls). This animates
// through the stages for visual feedback, then HOLDS on the last stage
// until the real fetch actually resolves (dataReady flips true) —
// it does not navigate away before the real result exists.
export default function LoadingScreen({ onComplete, dataReady }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= stages.length - 1) return; // hold on the last stage
    const timer = setTimeout(() => setIndex((prev) => prev + 1), 1200);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (dataReady) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing final stage to an external "data arrived" signal
      setIndex(stages.length - 1);
      const timer = setTimeout(() => onComplete(), 500);
      return () => clearTimeout(timer);
    }
  }, [dataReady, onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">

      <div className="bg-slate-900 p-10 rounded-2xl w-[500px] border border-slate-700 shadow-xl">

        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          AI Evaluation
        </h2>

        <div className="space-y-5">

          {stages.map((stage, i) => (

            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all
              ${
                i < index
                  ? "text-green-400"
                  : i === index
                  ? "text-blue-400"
                  : "text-gray-500"
              }`}
            >
              <Loader2
                className={`${
                  i === index ? "animate-spin" : ""
                }`}
                size={20}
              />

              <span>{stage}</span>

            </div>

          ))}

        </div>

        {!dataReady && index >= stages.length - 1 && (
          <p className="text-center text-sm text-slate-500 mt-6">
            This can take up to 30 seconds — the agents run one after another.
          </p>
        )}

      </div>

    </div>
  );
}
