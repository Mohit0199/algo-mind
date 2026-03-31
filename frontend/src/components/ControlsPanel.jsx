import { useState } from 'react'

export default function ControlsPanel({ hyperparameters, controls, onControlChange, onRunModel, runCounter }) {
  if (!hyperparameters) return null

  return (
    <div className="card h-[650px] flex flex-col overflow-hidden bg-slate-900 border-slate-800 relative z-10 p-0 shadow-2xl">
      <div className="p-5 border-b border-slate-800 bg-slate-800/20">
        <h3 className="font-bold text-slate-100 flex items-center gap-2">
          <span className="text-indigo-400">⚙️</span>
          Hyperparameters
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">Fine-tune the mathematical knobs of this algorithm.</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-8 custom-scrollbar">
        {Object.entries(hyperparameters).map(([key, config]) => {
          const value = controls[key] ?? config.default

          return (
            <div key={key} className="space-y-3 group">
              <div className="flex justify-between items-end">
                <label className="text-sm font-semibold text-slate-300 group-hover:text-indigo-300 transition-colors">
                  {config.label}
                </label>
                {config.options ? (
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {value}
                  </span>
                ) : (
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {value}
                  </span>
                )}
              </div>

              {config.options ? (
                <div className="relative">
                  <select
                    value={value}
                    onChange={(e) => onControlChange(key, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 appearance-none hover:border-slate-600 transition-colors cursor-pointer"
                  >
                    {config.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400 border-l border-slate-700 ml-2">
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              ) : (
                <div className="relative pt-1">
                  <input
                    type="range"
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={value}
                    onChange={(e) => onControlChange(key, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                    <span>{config.min}</span>
                    <span>{config.max}</span>
                  </div>
                </div>
              )}

              {config.desc && (
                <p className="text-xs text-slate-500 leading-snug">
                  {config.desc}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Persistent Run Model Footer */}
      <div className="p-5 border-t border-slate-800 bg-slate-950">
         <button 
           onClick={onRunModel}
           className="w-full relative group overflow-hidden rounded-xl p-[1px]"
         >
           <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-70 group-hover:opacity-100 animate-gradient-xy transition-opacity duration-300"></span>
           <div className="relative bg-slate-950 px-4 py-3 rounded-xl flex items-center justify-center gap-3 transition-all group-hover:bg-opacity-0">
             <span className="text-xl group-hover:scale-110 transition-transform">▶</span>
             <span className="font-bold text-white tracking-wide">
               {runCounter === 0 ? "Run Model" : "Re-Run Model"}
             </span>
           </div>
         </button>
      </div>

    </div>
  )
}
