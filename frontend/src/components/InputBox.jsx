import { useState } from 'react'

const QUICK_ALGORITHMS = [
  { label: '📈 Linear Regression', value: 'Linear Regression' },
  { label: '🔵 KNN', value: 'K-Nearest Neighbors' },
  { label: '🌳 Decision Tree', value: 'Decision Tree' },
  { label: '🧬 Neural Network', value: 'Neural Network' },
  { label: '🌀 K-Means', value: 'K-Means Clustering' },
  { label: '📦 Naive Bayes', value: 'Naive Bayes' },
]

export default function InputBox({ algorithm, setAlgorithm, onVisualize, loading }) {
  const [activeQuick, setActiveQuick] = useState(null)

  const handleQuickClick = (value) => {
    setActiveQuick(value)
    setAlgorithm(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (algorithm.trim()) {
      onVisualize(algorithm)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-16 text-center">
      {/* Hero */}
      <div className="mb-10 animate-slide-up">
        <div className="inline-flex items-center gap-2 tag mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
          AI-powered · Interactive · Visual
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text leading-tight mb-4">
          Understand{' '}
          <span className="gradient-text">Any Algorithm</span>
          <br />
          Visually
        </h2>
        <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
          Enter a machine learning algorithm below. Our AI breaks it down into simple visuals, 
          step-by-step guides, and interactive controls — so it <em>clicks</em>.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl animate-slide-up delay-100">
        <div className="card-glass p-2 flex gap-2">
          <input
            id="algorithm-input"
            type="text"
            className="input-field bg-transparent border-0 focus:ring-0 text-base flex-1"
            style={{ boxShadow: 'none' }}
            placeholder="e.g. Linear Regression, Random Forest, SVM..."
            value={algorithm}
            onChange={(e) => {
              setAlgorithm(e.target.value)
              setActiveQuick(null)
            }}
            autoFocus
          />
          <button
            id="visualize-btn"
            type="submit"
            disabled={loading || !algorithm.trim()}
            className="btn-accent whitespace-nowrap flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
                Thinking...
              </>
            ) : (
              <>
                <span>✨</span>
                Visualize
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Buttons */}
      <div className="mt-6 animate-slide-up delay-200">
        <p className="text-muted text-xs mb-3 uppercase tracking-wider">Quick start</p>
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_ALGORITHMS.map(({ label, value }) => (
            <button
              key={value}
              id={`quick-${value.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleQuickClick(value)}
              className={`btn-pill ${activeQuick === value ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-3 gap-8 animate-slide-up delay-300">
        {[
          { value: '3+', label: 'Visualizations' },
          { value: 'AI', label: 'Powered Explanations' },
          { value: '∞', label: 'Algorithms Supported' },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="text-3xl font-black gradient-text">{value}</div>
            <div className="text-muted text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
