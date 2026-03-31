import { useState, useMemo } from 'react'
import { algorithms } from '../data/algorithms'
import AlgorithmSelector from '../components/AlgorithmSelector'
import ResultContainer from '../components/ResultContainer'

export default function Home() {
  const [activeAlgorithmId, setActiveAlgorithmId] = useState(null)
  
  // Data Playground State
  const [datasetType, setDatasetType] = useState('blobs') // default dataset shape
  
  // Task Type State (classification / regression)
  const [taskType, setTaskType] = useState('classification')

  // Slider Control State
  const [controls, setControls] = useState({})

  // Find the full algorithm object from the static database
  const activeAlgorithm = useMemo(() => {
    return algorithms.find(a => a.id === activeAlgorithmId) || null
  }, [activeAlgorithmId])

  // Reset taskType when algorithm purely changes
  useMemo(() => {
    if (activeAlgorithm) {
      if (activeAlgorithm.supportedTypes && activeAlgorithm.supportedTypes.length > 0) {
        // Default to the first supported type (usually classification)
        setTaskType(activeAlgorithm.supportedTypes[0])
      }
    }
  }, [activeAlgorithm])

  // Reset controls whenever the algorithm OR the taskType (class/regress mode) changes
  // This explicitly solves the bug of sending classification parameters to regression models!
  useMemo(() => {
    if (activeAlgorithm && activeAlgorithm[taskType] && activeAlgorithm[taskType].hyperparameters) {
      const initial = {}
      Object.entries(activeAlgorithm[taskType].hyperparameters).forEach(([key, cfg]) => {
        initial[key] = cfg.default
      })
      setControls(initial)
    }
  }, [activeAlgorithm, taskType])

  const handleControlChange = (key, value) => {
    setControls(prev => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    setActiveAlgorithmId(null)
    setControls({})
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      {activeAlgorithm && (
        <div className="flex justify-end mb-8 animate-fade-in">
           <button onClick={handleReset} className="btn-pill text-sm flex items-center gap-2">
             <span>←</span> Change Algorithm
           </button>
        </div>
      )}

      {/* Hero / Search Area */}
      {!activeAlgorithm && (
        <AlgorithmSelector 
          activeAlgorithm={activeAlgorithmId}
          setActiveAlgorithm={setActiveAlgorithmId}
        />
      )}

      {/* Main Analysis + Simulator Container */}
      {activeAlgorithm && (
        <ResultContainer
          result={activeAlgorithm}
          controls={controls}
          onControlChange={handleControlChange}
          datasetType={datasetType}
          setDatasetType={setDatasetType}
          taskType={taskType}
          setTaskType={setTaskType}
        />
      )}
    </div>
  )
}
