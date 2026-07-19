"use client";

import SubmissionForm from "@/components/SubmissionForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-4xl">

        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold mb-4">
            AI Hackathon Evaluator
          </h1>

          <p className="text-slate-400 text-lg">
            Evaluate your hackathon project using multiple AI agents.
          </p>

        </div>

        <SubmissionForm />

      </div>
    </main>
  );
}