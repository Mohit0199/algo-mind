import { useState, useEffect } from 'react'
import axios from 'axios'
import Plot from 'react-plotly.js'

export default function VisualizationPanel({ algorithmId, controls, datasetType, taskType, is3DMode, runCounter, customDatasetContent }) {
  const [plotData, setPlotData] = useState(null)
  const [metrics, setMetrics] = useState({})
  const [extraGraphics, setExtraGraphics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch when the runCounter increments, OR when the algorithm/taskType uniquely changes
  useEffect(() => {
    // If we haven't clicked run at all yet, we should auto-run ONCE so the user isn't staring at a blank screen initially.
    if (runCounter === 0 && plotData) return; 

    const fetchGraph = async () => {
      setLoading(true)
      setError(null)
      try {
        const API_BASE = import.meta.env.VITE_API_URL || ''
        const response = await axios.post(`${API_BASE}/api/visualize`, {
          algorithm: algorithmId,
          dataset: datasetType,
          hyperparameters: controls,
          task_type: taskType,
          is_3d: is3DMode,
          custom_dataset: datasetType === 'custom' ? customDatasetContent : null
        })
        
        const data = response.data
        setPlotData(data.plotly_json)
        setMetrics(data.metrics || {})
        setExtraGraphics(data.extra_graphics || null)
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to generate visualization. Check parameters.")
      } finally {
        setLoading(false)
      }
    }

    fetchGraph()
  }, [runCounter, algorithmId, taskType, datasetType])

  return (
    <div className="card w-full flex flex-col bg-slate-900 border-slate-800 relative shadow-2xl overflow-hidden p-0">
      
      {/* Top Bar: Live Metrics */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-slate-800/50 border-b border-slate-800">
        
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              📊
           </div>
           <span className="text-sm text-slate-300 font-semibold tracking-wide">Visualization Output</span>
        </div>

        {/* Live Metrics sent back from Python logic */}
        <div className="flex items-center gap-4 text-sm mt-2 sm:mt-0">
           {Object.entries(metrics).filter(([k]) => k !== 'Confusion Matrix').map(([key, value]) => (
             <div key={key} className="flex flex-col items-end">
               <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{key}</span>
               <span className={`font-mono flex items-center gap-1.5 ${key.includes('Error') || key.includes('MSE') ? 'text-amber-400' : 'text-emerald-400'}`}>
                 <span className={`w-1.5 h-1.5 rounded-full inline-block ${key.includes('Error') || key.includes('MSE') ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                 {typeof value === 'number' ? value.toFixed(4) : value}
               </span>
             </div>
           ))}
        </div>

      </div>

      {/* Interactive Confusion Matrix Panel */}
      {metrics['Confusion Matrix'] && (
        <div className="bg-slate-950/80 border-b border-slate-800 p-4 flex flex-col items-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">Confusion Matrix (Test Set)</p>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 rounded p-2 px-6 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                    <span className="block text-[9px] text-emerald-500/70 uppercase">True Pos</span>
                    <span className="text-lg font-bold">{metrics['Confusion Matrix'].TP !== undefined ? metrics['Confusion Matrix'].TP : '-'}</span>
                </div>
                <div className="bg-rose-900/30 border border-rose-500/30 text-rose-400 rounded p-2 px-6 shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                    <span className="block text-[9px] text-rose-500/70 uppercase">False Pos</span>
                    <span className="text-lg font-bold">{metrics['Confusion Matrix'].FP !== undefined ? metrics['Confusion Matrix'].FP : '-'}</span>
                </div>
                <div className="bg-rose-900/30 border border-rose-500/30 text-rose-400 rounded p-2 px-6 shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                    <span className="block text-[9px] text-rose-500/70 uppercase">False Neg</span>
                    <span className="text-lg font-bold">{metrics['Confusion Matrix'].FN !== undefined ? metrics['Confusion Matrix'].FN : '-'}</span>
                </div>
                <div className="bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 rounded p-2 px-6 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                    <span className="block text-[9px] text-emerald-500/70 uppercase">True Neg</span>
                    <span className="text-lg font-bold">{metrics['Confusion Matrix'].TN !== undefined ? metrics['Confusion Matrix'].TN : '-'}</span>
                </div>
            </div>
        </div>
      )}

      {/* Embedded Chart Component Container */}
      <div className="w-full h-[550px] bg-slate-950/50 p-0 relative flex flex-col items-center justify-center">
        
        {runCounter === 0 && !loading && !plotData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 p-8 text-center">
             <span className="text-6xl mb-6">🚀</span>
             <h3 className="text-xl font-bold text-slate-200 mb-2">Ready to Train</h3>
             <p className="text-slate-400 text-sm max-w-sm">Tweak your hyperparameters and press <strong>Run Model</strong> to generate the mathematical decision boundary.</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-indigo-300 font-medium tracking-wide">Training Model & Plotting...</p>
          </div>
        )}

        {error ? (
          <div className="text-red-400 flex flex-col items-center gap-2 p-8 text-center">
            <span className="text-3xl">⚠️</span>
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : plotData ? (
          <Plot
            data={plotData.data}
            layout={{
              ...plotData.layout,
              autosize: true,
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              font: { color: '#cbd5e1' },
              margin: { l: 40, r: 40, t: 40, b: 40 },
              xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155' },
              yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155' }
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
            config={{ displayModeBar: false }}
          />
        ) : null}
      </div>

      {/* Render base64 extra graphics from python if present (e.g., plot_tree) */}
      {extraGraphics?.tree_base64 && (
        <div className="border-t border-slate-800 p-6 bg-slate-900 mt-4">
          <p className="text-sm font-semibold text-slate-300 mb-4 tracking-wide uppercase">Internal Model Architecture (Decision Tree)</p>
          <div className="w-full flex justify-center bg-slate-100 rounded-xl p-4 overflow-x-auto border border-indigo-500/20 shadow-inner">
            <img src={`data:image/png;base64,${extraGraphics.tree_base64}`} alt="Internal model architecture (Decision Tree)" className="max-h-96 object-contain mix-blend-multiply" />
          </div>
        </div>
      )}

    </div>
  )
}
