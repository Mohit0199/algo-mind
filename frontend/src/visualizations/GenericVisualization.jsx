export default function GenericVisualization({ controls }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center rounded-xl text-center p-8"
      style={{ minHeight: '320px', background: 'rgba(15,23,42,0.5)', border: '1px dashed rgba(99,102,241,0.3)' }}
    >
      <div className="text-5xl mb-4 animate-float">📊</div>
      <h3 className="text-lg font-semibold text-text mb-2">Visualization Coming Soon</h3>
      <p className="text-muted text-sm max-w-sm">
        This algorithm doesn't have a specific interactive visualization yet. 
        Check the explanation cards below to understand how it works.
      </p>
      <div className="mt-6 flex gap-2 flex-wrap justify-center">
        {Object.entries(controls || {}).map(([key, val]) => (
          <span key={key} className="tag">
            {key}: {val}
          </span>
        ))}
      </div>
    </div>
  )
}
