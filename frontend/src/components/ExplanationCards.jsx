export default function ExplanationCards({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Deep Explanation + Analogy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simple Explanation */}
        <div className="card border-l-4 border-indigo-500 bg-slate-900 border-slate-800">
          <p className="section-label">High-Level Intuition</p>
          <p className="text-slate-200 leading-relaxed text-[15px]">{result.explanation}</p>
        </div>

        {/* Analogy */}
        {result.analogy && (
          <div className="card bg-indigo-500/10 border-indigo-500/30">
            <p className="section-label">Real-World Analogy</p>
            <div className="flex gap-4">
              <span className="text-4xl translate-y-1">💡</span>
              <p className="text-indigo-100 leading-relaxed text-[15px] italic">"{result.analogy}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Mechanism */}
      {result.steps?.length > 0 && (
        <div className="card bg-slate-900 border-slate-800">
          <p className="section-label">How It Actually Learns (Step by Step)</p>
          <div className="space-y-5 mt-6">
            {result.steps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-indigo-400 border border-indigo-500/30 text-sm font-black flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg">
                  {i + 1}
                </div>
                <div className="flex-1 pt-1.5">
                  <p className="text-slate-300 leading-relaxed text-[15px]">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
