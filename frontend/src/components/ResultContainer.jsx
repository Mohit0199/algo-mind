import { useState } from 'react'
import ExplanationCards from './ExplanationCards'
import VisualizationPanel from './VisualizationPanel'
import ControlsPanel from './ControlsPanel'
import InterviewSection from './InterviewSection'
import MechanismVisualizer from './MechanismVisualizer'

export default function ResultContainer({ result, controls, onControlChange, datasetType, setDatasetType, taskType, setTaskType }) {
  
  // Trigger to fetch the graph (used by the Run button)
  const [runCounter, setRunCounter] = useState(0)
  
  const handleRunModel = () => {
    setRunCounter(prev => prev + 1)
  }

  // The deep contextual data nested under the current task type context
  const contextData = result[taskType]

  if (!contextData) return null

  return (
    <div className="animate-fade-in space-y-8 pb-16">
      {/* Title + Summary Banner */}
      <div className="card-glass animate-slide-up bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/20 border-l-4 border-l-indigo-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-2">
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 leading-tight mb-3">
              {result.title}
            </h2>
            <p className="text-slate-300 leading-relaxed max-w-3xl text-lg">{contextData.summary}</p>
          </div>
          
          {/* Classification / Regression Toggle (if supported) */}
          {result.supportedTypes && result.supportedTypes.length > 1 ? (
             <div className="bg-slate-950/50 p-1.5 rounded-xl border border-slate-800 flex self-start sm:self-center">
                {result.supportedTypes.map(t => (
                  <button 
                    key={t}
                    onClick={() => {
                        setTaskType(t)
                        // Auto-sync the dataset visually when swapping modes
                        if (t === 'regression') setDatasetType('linear')
                        else setDatasetType('blobs')
                        
                        // Increment run counter so the chart auto-draws the correct base dataset
                        setRunCounter(prev => prev + 1)
                    }}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${taskType === t ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          ) : (
             <span className="tag text-sm px-4 py-2 capitalize border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
               {result.supportedTypes[0]}
             </span>
          )}
        </div>
      </div>

      {/* Data Playground Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-slide-up delay-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2"><span className="text-2xl">🌍</span> Data Playground</h3>
            <p className="text-slate-400 text-sm">Select the shape of the dataset to challenge your model's decision boundaries.</p>
          </div>
          <div className="flex bg-slate-950 rounded-xl p-1.5 border border-slate-800">
             {taskType === 'regression' ? (
                <>
                  <button onClick={() => setDatasetType('linear')} className={`px-4 py-2 rounded-lg text-sm transition-all ${datasetType === 'linear' ? 'bg-slate-800 text-indigo-300' : 'text-slate-500 hover:bg-slate-800/50'}`}>Linear Trend</button>
                  <button onClick={() => setDatasetType('sine')} className={`px-4 py-2 rounded-lg text-sm transition-all ${datasetType === 'sine' ? 'bg-slate-800 text-indigo-300' : 'text-slate-500 hover:bg-slate-800/50'}`}>Sine Wave</button>
                </>
             ) : taskType === 'classification' ? (
                <>
                  <button onClick={() => setDatasetType('blobs')} className={`px-4 py-2 rounded-lg text-sm transition-all ${datasetType === 'blobs' ? 'bg-slate-800 text-indigo-300' : 'text-slate-500 hover:bg-slate-800/50'}`}>Blobs (Easy)</button>
                  <button onClick={() => setDatasetType('moons')} className={`px-4 py-2 rounded-lg text-sm transition-all ${datasetType === 'moons' ? 'bg-slate-800 text-indigo-300' : 'text-slate-500 hover:bg-slate-800/50'}`}>Two Moons (Hard)</button>
                  <button onClick={() => setDatasetType('circles')} className={`px-4 py-2 rounded-lg text-sm transition-all ${datasetType === 'circles' ? 'bg-slate-800 text-indigo-300' : 'text-slate-500 hover:bg-slate-800/50'}`}>Concentric (Hard)</button>
                </>
             ) : (
                <>
                  <button onClick={() => setDatasetType('blobs')} className={`px-4 py-2 rounded-lg text-sm transition-all ${datasetType === 'blobs' ? 'bg-slate-800 text-indigo-300' : 'text-slate-500 hover:bg-slate-800/50'}`}>Cluster Blobs</button>
                  <button onClick={() => setDatasetType('moons')} className={`px-4 py-2 rounded-lg text-sm transition-all ${datasetType === 'moons' ? 'bg-slate-800 text-indigo-300' : 'text-slate-500 hover:bg-slate-800/50'}`}>Intertwined Moons</button>
                </>
             )}
          </div>
        </div>
      </div>

      {/* Two-column layout: Visualization + Controls */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Visualization - takes 3/4 space */}
        <div className="w-full lg:w-3/4 animate-slide-up delay-200">
          <VisualizationPanel
            algorithmId={result.id}
            controls={controls}
            datasetType={datasetType}
            taskType={taskType}
            runCounter={runCounter}
          />
        </div>

        {/* Controls Panel - takes 1/4 space */}
        <div className="w-full lg:w-1/4 animate-slide-up delay-300 sticky top-28">
          <ControlsPanel
            hyperparameters={contextData.hyperparameters}
            controls={controls}
            onControlChange={onControlChange}
            onRunModel={handleRunModel}
            runCounter={runCounter}
          />
        </div>
      </div>

      {/* Explanation Cards Engine */}
      <div className="animate-slide-up delay-400 mt-12">
        <ExplanationCards result={contextData} />
      </div>

      {/* Algorithm Mechanism Visualizer */}
      <div className="animate-slide-up delay-500 mt-12">
        <MechanismVisualizer algorithmId={result.id} taskType={taskType} />
      </div>

      {/* Interview Section Engine */}
      {contextData.interviewQs?.length > 0 && (
        <div className="animate-slide-up delay-500 mt-12">
          <InterviewSection questions={contextData.interviewQs} />
        </div>
      )}
    </div>
  )
}
