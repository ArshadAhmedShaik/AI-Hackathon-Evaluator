export default function ProgressBar({ value }) {
  return (
    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
      <div
        className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
        style={{ width: `${value * 10}%` }}
      />
    </div>
  );
}