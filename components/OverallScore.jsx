"use client";

import CountUp from "react-countup";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

export default function OverallScore({ score }) {
  return (
    <div className="bg-slate-900 rounded-3xl p-10 border border-slate-700">

      <div className="w-56 mx-auto">

        <CircularProgressbar
          value={score * 10}
          text={`${score}/10`}
          styles={buildStyles({
            pathColor: "#3b82f6",
            textColor: "#fff",
            trailColor: "#334155",
          })}
        />

      </div>

      <h2 className="text-center mt-6 text-4xl font-bold">

        <CountUp end={score} duration={2} decimals={1} /> /10

      </h2>

      <p className="text-center text-slate-400 mt-3">

        AI Confidence

      </p>

      <div className="text-center text-green-400 font-bold text-2xl">

        94%

      </div>

    </div>
  );
}