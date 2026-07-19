import ProgressBar from "./ProgressBar";

export default function ScoreCard({ title, score }) {
  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-700">

      <div className="flex justify-between mb-3">

        <h3 className="font-semibold text-lg">
          {title}
        </h3>

        <span className="font-bold text-blue-400">
          {score}/10
        </span>

      </div>

      <ProgressBar value={score} />

    </div>
  );
}