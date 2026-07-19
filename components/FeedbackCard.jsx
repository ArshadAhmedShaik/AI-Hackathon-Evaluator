export default function FeedbackCard({ feedback }) {
  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">

      <h2 className="text-2xl font-bold mb-5">
        AI Suggestions
      </h2>

      <div className="space-y-4">

        {feedback.map((item, index) => (

          <div
            key={index}
            className="bg-slate-800 p-4 rounded-lg"
          >
            ✅ {item}
          </div>

        ))}

      </div>

    </div>
  );
}