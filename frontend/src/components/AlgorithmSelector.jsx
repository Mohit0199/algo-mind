import { algorithms } from '../data/algorithms'

// Unique SVG icons per algorithm type
const AlgoIcon = ({ id, size = 20 }) => {
  const icons = {
    decision_tree: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="3" r="2"/><line x1="12" y1="5" x2="12" y2="9"/>
        <circle cx="6" cy="11" r="2"/><circle cx="18" cy="11" r="2"/>
        <line x1="10.5" y1="10" x2="7" y2="10"/><line x1="13.5" y1="10" x2="17" y2="10"/>
        <circle cx="3" cy="19" r="2"/><circle cx="9" cy="19" r="2"/>
        <circle cx="15" cy="19" r="2"/><circle cx="21" cy="19" r="2"/>
        <line x1="5" y1="18" x2="4" y2="18"/><line x1="7" y1="18" x2="8" y2="18"/>
        <line x1="11" y1="18" x2="10" y2="18"/><line x1="13" y1="18" x2="14" y2="18"/>
      </svg>
    ),
    random_forest: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2L8 10h8L12 2z"/><path d="M12 10v12"/>
        <path d="M5 7L2 13h6L5 7z"/><path d="M5 13v5"/>
        <path d="M19 7l-3 6h6l-3-6z"/><path d="M19 13v5"/>
      </svg>
    ),
    knn: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" strokeDasharray="3 2"/>
        <circle cx="5" cy="6" r="1.5" fill="currentColor"/><circle cx="19" cy="8" r="1.5" fill="currentColor"/>
        <circle cx="7" cy="18" r="1.5" fill="currentColor"/><circle cx="17" cy="18" r="1.5" fill="currentColor"/>
      </svg>
    ),
    svm: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="3" y1="18" x2="21" y2="6" strokeWidth="2"/>
        <line x1="3" y1="14" x2="21" y2="2" strokeDasharray="3 2"/>
        <line x1="3" y1="22" x2="21" y2="10" strokeDasharray="3 2"/>
        <circle cx="6" cy="8" r="2" fill="currentColor" opacity="0.6"/>
        <circle cx="18" cy="16" r="2" fill="currentColor" opacity="0.6"/>
      </svg>
    ),
    adaboost: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="2,18 8,10 12,14 18,6 22,9"/><polyline points="17,6 22,6 22,11"/>
      </svg>
    ),
    logistic_regression: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 19 Q6 19 9 12 Q12 5 15 5 Q18 5 21 5" strokeLinecap="round"/>
        <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="3 2" opacity="0.4"/>
        <line x1="3" y1="4" x2="3" y2="20"/>
        <line x1="3" y1="20" x2="21" y2="20"/>
      </svg>
    ),
    linear_regression: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="3" y1="4" x2="3" y2="20"/><line x1="3" y1="20" x2="21" y2="20"/>
        <line x1="4" y1="18" x2="20" y2="6" strokeWidth="2"/>
        <circle cx="6" cy="16" r="1.5" fill="currentColor"/><circle cx="11" cy="13" r="1.5" fill="currentColor"/>
        <circle cx="15" cy="10" r="1.5" fill="currentColor"/><circle cx="19" cy="7" r="1.5" fill="currentColor"/>
      </svg>
    ),
    naive_bayes: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3C8 3 4 7 4 12s4 9 8 9 8-4 8-9-4-9-8-9z"/>
        <path d="M12 3c2 3 3 6 3 9s-1 6-3 9M12 3c-2 3-3 6-3 9s1 6 3 9"/>
        <line x1="4" y1="12" x2="20" y2="12" strokeDasharray="3 2"/>
      </svg>
    ),
    xgboost: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="14" width="4" height="8" rx="1"/><rect x="7" y="10" width="4" height="12" rx="1"/>
        <rect x="12" y="6" width="4" height="16" rx="1"/><rect x="17" y="2" width="4" height="20" rx="1"/>
      </svg>
    ),
    kmeans_clustering: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="7" cy="7" r="4" strokeDasharray="3 2"/><circle cx="17" cy="16" r="4" strokeDasharray="3 2"/>
        <circle cx="7" cy="7" r="1.5" fill="currentColor"/><circle cx="17" cy="16" r="1.5" fill="currentColor"/>
        <circle cx="5" cy="11" r="1" fill="currentColor" opacity="0.6"/>
        <circle cx="10" cy="5" r="1" fill="currentColor" opacity="0.6"/>
        <circle cx="20" cy="13" r="1" fill="currentColor" opacity="0.6"/>
        <circle cx="14" cy="19" r="1" fill="currentColor" opacity="0.6"/>
      </svg>
    ),
    agglomerative_clustering: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="5" cy="19" r="2"/><circle cx="10" cy="19" r="2"/><circle cx="15" cy="19" r="2"/><circle cx="20" cy="19" r="2"/>
        <line x1="5" y1="17" x2="7.5" y2="13"/><line x1="10" y1="17" x2="7.5" y2="13"/>
        <line x1="15" y1="17" x2="17.5" y2="13"/><line x1="20" y1="17" x2="17.5" y2="13"/>
        <circle cx="7.5" cy="12" r="2"/><circle cx="17.5" cy="12" r="2"/>
        <line x1="7.5" y1="10" x2="12" y2="6"/><line x1="17.5" y1="10" x2="12" y2="6"/>
        <circle cx="12" cy="5" r="2"/>
      </svg>
    ),
    dbscan: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="8" cy="8" r="5" strokeDasharray="2 1.5"/>
        <circle cx="16" cy="15" r="4" strokeDasharray="2 1.5"/>
        <circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/>
        <circle cx="6" cy="10" r="1.2" fill="currentColor"/><circle cx="10" cy="7" r="1.2" fill="currentColor"/>
        <circle cx="16" cy="14" r="1.2" fill="currentColor"/><circle cx="17" cy="16" r="1.2" fill="currentColor"/>
        <circle cx="15" cy="16" r="1.2" fill="currentColor"/>
        <circle cx="20" cy="5" r="1.5" stroke="currentColor" opacity="0.5"/>
        <path d="M20 5l1 1M19 5l-1 1" opacity="0.5"/>
      </svg>
    ),
    gradient_boosting: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="2,20 6,14 10,16 14,8 18,10 22,4"/>
        <polyline points="20,4 22,4 22,6"/>
        <circle cx="6" cy="14" r="1.5" fill="currentColor" opacity="0.7"/>
        <circle cx="10" cy="16" r="1.5" fill="currentColor" opacity="0.7"/>
        <circle cx="14" cy="8" r="1.5" fill="currentColor" opacity="0.7"/>
        <circle cx="18" cy="10" r="1.5" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
  }
  return icons[id] || (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

// Word-cloud style sizes — vary by index for visual rhythm
const sizes = [
  'text-xl px-6 py-4',   // Large
  'text-base px-5 py-3', // Medium
  'text-sm px-4 py-3',   // Small
  'text-lg px-6 py-3.5', // Medium-Large
  'text-base px-4 py-3', // Medium
  'text-xl px-7 py-4',   // Large
  'text-sm px-5 py-3',   // Small
  'text-lg px-5 py-3.5', // Medium-Large
  'text-base px-4 py-2.5',
  'text-xl px-6 py-4',
  'text-sm px-4 py-2.5',
  'text-lg px-6 py-3.5',
  'text-base px-5 py-3',
]

// Category color accent per algorithm
const accentColors = {
  decision_tree:          'hover:border-emerald-500/60 hover:text-emerald-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]',
  random_forest:          'hover:border-emerald-400/60 hover:text-emerald-200 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]',
  knn:                    'hover:border-sky-500/60 hover:text-sky-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]',
  svm:                    'hover:border-violet-500/60 hover:text-violet-300 hover:shadow-[0_0_20px_rgba(167,139,250,0.15)]',
  adaboost:               'hover:border-orange-500/60 hover:text-orange-300 hover:shadow-[0_0_20px_rgba(251,146,60,0.15)]',
  logistic_regression:    'hover:border-indigo-500/60 hover:text-indigo-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
  linear_regression:      'hover:border-indigo-400/60 hover:text-indigo-200 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
  naive_bayes:            'hover:border-pink-500/60 hover:text-pink-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]',
  xgboost:                'hover:border-yellow-500/60 hover:text-yellow-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]',
  kmeans_clustering:      'hover:border-cyan-500/60 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]',
  agglomerative_clustering:'hover:border-teal-500/60 hover:text-teal-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]',
  dbscan:                 'hover:border-rose-500/60 hover:text-rose-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
  gradient_boosting:      'hover:border-amber-500/60 hover:text-amber-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
}

export default function AlgorithmSelector({ setActiveAlgorithm }) {
  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-16 text-center animate-slide-up">
      {/* Hero Text */}
      <div className="mb-12">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 leading-tight mb-4">
          Master the <span className="gradient-text">Intuition</span>
          <br />
          Behind ML
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Pick any algorithm below. Tweak hyperparameters, change the dataset, and watch decision boundaries update live.
        </p>
      </div>

      {/* Word-Cloud Algorithm Grid */}
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {algorithms.map((algo, i) => {
          const sizeClass = sizes[i % sizes.length]
          const accent = accentColors[algo.id] || 'hover:border-indigo-500/60 hover:text-indigo-300'
          return (
            <button
              key={algo.id}
              onClick={() => setActiveAlgorithm(algo.id)}
              className={`
                group flex items-center gap-2.5 font-semibold
                bg-slate-900/60 border border-slate-700/60
                rounded-2xl
                text-slate-300
                transition-all duration-200
                hover:bg-slate-800/80 hover:-translate-y-0.5 hover:scale-105
                ${sizeClass} ${accent}
              `}
            >
              <span className="opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
                <AlgoIcon id={algo.id} size={parseInt(sizeClass) > 16 ? 20 : 17} />
              </span>
              {algo.title}
            </button>
          )
        })}
      </div>

      <p className="mt-10 text-slate-600 text-xs uppercase tracking-widest">
        {algorithms.length} algorithms · Interactive visualizations
      </p>

      {/* About / Feature Section */}
      <div className="w-full max-w-5xl mx-auto mt-20 mb-8 px-4">
        {/* Divider */}
        <div className="flex items-center gap-4 mb-14">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold">What is AlgoMind?</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        {/* Intro headline */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4 leading-snug">
            Stop memorizing. Start <span className="gradient-text">understanding</span>.
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            AlgoMind is an interactive ML algorithm visualizer built for students, engineers, and anyone preparing for data science interviews. Every algorithm is explained with real math, real analogies, and a live playground you can actually play with.
          </p>
        </div>

        {/* 3-column feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: '🧠',
              title: 'Deep Intuition',
              desc: 'Every algorithm comes with a plain-English explanation, a real-world analogy, and step-by-step breakdown of how it actually works under the hood — no textbook jargon.',
              accent: 'from-indigo-500/10 to-purple-500/10 border-indigo-500/20',
              glow: 'group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]',
            },
            {
              icon: '⚡',
              title: 'Live Visualization',
              desc: 'Tweak any hyperparameter — max depth, learning rate, number of clusters — and watch the decision boundary or regression line re-draw instantly in your browser.',
              accent: 'from-emerald-500/10 to-cyan-500/10 border-emerald-500/20',
              glow: 'group-hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]',
            },
            {
              icon: '🎯',
              title: 'Interview Ready',
              desc: '5 hard interview questions per algorithm, per mode (classification vs regression) — carefully curated and fact-checked against industry standards.',
              accent: 'from-amber-500/10 to-orange-500/10 border-amber-500/20',
              glow: 'group-hover:shadow-[0_0_30px_rgba(251,146,60,0.15)]',
            },
          ].map(({ icon, title, desc, accent, glow }) => (
            <div
              key={title}
              className={`group relative rounded-2xl border bg-gradient-to-br ${accent} p-6 text-left transition-all duration-300 ${glow}`}
            >
              <span className="text-3xl mb-4 block">{icon}</span>
              <h4 className="text-slate-100 font-bold text-lg mb-2">{title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
