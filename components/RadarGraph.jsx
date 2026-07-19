"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export default function RadarGraph({ scores }) {
  const data = [
    {
      subject: "Originality",
      value: scores.originality,
    },
    {
      subject: "Technical",
      value: scores.technicalDepth,
    },
    {
      subject: "Demo",
      value: scores.demoQuality,
    },
    {
      subject: "Impact",
      value: scores.impact,
    },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 h-[450px]">

      <h2 className="text-2xl font-bold mb-5">
        Score Distribution
      </h2>

      <ResponsiveContainer>

        <RadarChart data={data}>

          <PolarGrid />

          <PolarAngleAxis dataKey="subject" />

          <Radar
            dataKey="value"
            fill="#3b82f6"
            fillOpacity={0.6}
          />

        </RadarChart>

      </ResponsiveContainer>

    </div>
  );
}