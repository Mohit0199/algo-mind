import { useState, useEffect, useRef } from 'react'

import KMeansViz, { KMEANS_STEPS } from './mechanisms/KMeansViz'
import DBSCANViz, { DBSCAN_STEPS } from './mechanisms/DBSCANViz'
import AgglomerativeViz, { AGG_STEPS } from './mechanisms/AgglomerativeViz'
import KNNViz, { KNN_STEPS } from './mechanisms/KNNViz'
import DecisionTreeViz, { DT_STEPS } from './mechanisms/DecisionTreeViz'
import RandomForestViz, { RF_STEPS } from './mechanisms/RandomForestViz'
import LinearRegressionViz, { LR_STEPS } from './mechanisms/LinearRegressionViz'
import LogisticRegressionViz, { LOG_STEPS } from './mechanisms/LogisticRegressionViz'
import SVMViz, { SVM_STEPS } from './mechanisms/SVMViz'
import NaiveBayesViz, { NB_STEPS } from './mechanisms/NaiveBayesViz'
import AdaBoostViz, { ADA_STEPS } from './mechanisms/AdaBoostViz'
import GradientBoostingViz, { GB_STEPS } from './mechanisms/GradientBoostingViz'
import XGBoostViz, { XGB_STEPS } from './mechanisms/XGBoostViz'

const VIZ_MAP = {
  kmeans_clustering:        { Component: KMeansViz,           steps: KMEANS_STEPS },
  dbscan:                   { Component: DBSCANViz,            steps: DBSCAN_STEPS },
  agglomerative_clustering: { Component: AgglomerativeViz,    steps: AGG_STEPS },
  knn:                      { Component: KNNViz,               steps: KNN_STEPS },
  decision_tree:            { Component: DecisionTreeViz,     steps: DT_STEPS },
  random_forest:            { Component: RandomForestViz,     steps: RF_STEPS },
  linear_regression:        { Component: LinearRegressionViz, steps: LR_STEPS },
  logistic_regression:      { Component: LogisticRegressionViz, steps: LOG_STEPS },
  svm:                      { Component: SVMViz,               steps: SVM_STEPS },
  naive_bayes:              { Component: NaiveBayesViz,       steps: NB_STEPS },
  adaboost:                 { Component: AdaBoostViz,         steps: ADA_STEPS },
  gradient_boosting:        { Component: GradientBoostingViz, steps: GB_STEPS },
  xgboost:                  { Component: XGBoostViz,          steps: XGB_STEPS },
}

export default function MechanismVisualizer({ algorithmId, taskType }) {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1800)
  const timerRef = useRef(null)

  const viz = VIZ_MAP[algorithmId]
  useEffect(() => { setStep(0); setIsPlaying(false) }, [algorithmId, taskType])

  const totalSteps = viz?.steps.length ?? 0

  useEffect(() => {
    clearInterval(timerRef.current)
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStep(prev => {
          if (prev >= totalSteps - 1) { setIsPlaying(false); return prev }
          return prev + 1
        })
      }, speed)
    }
    return () => clearInterval(timerRef.current)
  }, [isPlaying, speed, totalSteps])

  if (!viz) return null

  const { Component, steps } = viz
  const currentStep = steps[Math.min(step, steps.length - 1)]
  const progress = totalSteps > 1 ? (step / (totalSteps - 1)) * 100 : 100

  const goTo = (s) => { setStep(Math.max(0, Math.min(totalSteps - 1, s))); setIsPlaying(false) }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">

      {/* Section header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800 bg-slate-800/20">
        <div className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center border border-violet-500/25 text-base">🎬</div>
        <div>
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">See It Think</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Watch the algorithm execute step by step</p>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex flex-col lg:flex-row">

        {/* LEFT — big SVG canvas */}
        <div className="flex-1 p-5 bg-slate-950/30 flex items-center justify-center">
          <div className="w-full">
            <Component step={step} taskType={taskType} />
          </div>
        </div>

        {/* Vertical divider (desktop only) */}
        <div className="hidden lg:block w-px bg-slate-800 my-5" />

        {/* RIGHT — annotation + controls */}
        <div className="w-full lg:w-72 flex flex-col justify-between p-6 gap-6 border-t border-slate-800 lg:border-t-0">

          {/* Step counter pill */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Step</span>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              {step + 1} / {totalSteps}
            </span>
          </div>

          {/* Step dots */}
          <div className="flex flex-wrap gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  i === step
                    ? 'bg-violet-500 scale-125 shadow-[0_0_6px_rgba(139,92,246,0.8)]'
                    : i < step
                    ? 'bg-violet-800'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Step annotation */}
          <div className="flex-1 space-y-2 bg-violet-950/20 rounded-xl border border-violet-900/20 p-4">
            <p className="text-sm font-bold text-violet-300 leading-snug">{currentStep.title}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{currentStep.description}</p>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-600 mb-1.5">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Playback controls */}
          <div className="space-y-3">
            {/* Main controls row */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goTo(step - 1)}
                disabled={step === 0}
                className="flex-1 h-9 flex items-center justify-center rounded-xl border border-slate-700 text-slate-300 disabled:opacity-25 hover:border-violet-500/60 hover:text-violet-300 transition-all text-sm font-medium"
              >
                ← Prev
              </button>

              <button
                onClick={() => setIsPlaying(p => !p)}
                className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-violet-500 hover:bg-violet-400 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>

              <button
                onClick={() => goTo(step + 1)}
                disabled={step === totalSteps - 1}
                className="flex-1 h-9 flex items-center justify-center rounded-xl border border-slate-700 text-slate-300 disabled:opacity-25 hover:border-violet-500/60 hover:text-violet-300 transition-all text-sm font-medium"
              >
                Next →
              </button>
            </div>

            {/* Speed + Reset row */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setStep(0); setIsPlaying(false) }}
                className="h-9 px-4 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all text-xs font-medium"
              >
                ↺ Reset
              </button>
              <select
                value={speed}
                onChange={e => setSpeed(Number(e.target.value))}
                className="flex-1 h-9 text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-2 focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value={2800}>🐢 Slow</option>
                <option value={1800}>⚡ Normal</option>
                <option value={800}>🚀 Fast</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
