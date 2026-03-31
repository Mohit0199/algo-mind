import { SvgBase, C, Label, Badge } from './vizUtils.jsx'

// Points designed so true slope ≈ -0.45 in pixel/pixel space
const DATA = Array.from({ length: 22 }, (_, i) => ({
  x: 35 + i * 15,
  y: 225 - i * 6 + Math.sin(i * 1.3) * 22 + (i % 4 === 0 ? 18 : -10)
}))

// lineY: y = slope*x + intercept  (slope in pixel/pixel, stays within SVG)
function lineY(x, slope, intercept) { return slope * x + intercept }

// States: slope in pixel/pixel — at x=35→35+21*15=350, both endpoints stay in [20,270]
const STATES = [
  { slope: 0,      intercept: 155, showRes: false, label: null },
  { slope: 0,      intercept: 155, showRes: false, label: 'Random Guess (flat)' },
  { slope: 0,      intercept: 155, showRes: true,  label: 'Errors' },
  { slope: -0.18,  intercept: 200, showRes: true,  label: 'Adjusting...' },
  { slope: -0.32,  intercept: 218, showRes: true,  label: 'Better fit' },
  { slope: -0.42,  intercept: 228, showRes: true,  label: 'Good fit' },
  { slope: -0.46,  intercept: 234, showRes: false,  label: '✓ Converged' },
]

export const LR_STEPS = [
  { title: 'Scatter Data (Regression)', description: 'Each point: X is the feature, Y is the target value. We want a line that best predicts Y from X. Points follow a rough downward trend with noise.' },
  { title: 'Start With a Random Line (Poor Guess)', description: 'The algorithm starts with a flat line (slope=0, intercept=mean). This is terrible — the errors between predicted and actual values are huge.' },
  { title: 'Compute Residual Errors', description: 'Orange bars = residuals (actual Y − predicted Y). The Mean Squared Error (MSE) is the average squared length of these bars. We want to minimize it.' },
  { title: 'Gradient Descent: Step 1', description: 'Compute gradients of the loss w.r.t. slope and intercept. Take a small step downhill. The line starts tilting toward the true trend.' },
  { title: 'Gradient Descent: Step 2', description: 'Another step. The line continues rotating. MSE is decreasing, residuals are clearly shrinking.' },
  { title: 'Gradient Descent: Step 3', description: 'Getting very close! The line almost perfectly threads through the data. Residuals are small.' },
  { title: 'Converged — Best Fit Line ✓', description: 'The gradient ≈ 0 — the line can\'t improve further. This slope and intercept minimize the MSE across all data points.' },
]

export default function LinearRegressionViz({ step }) {
  const state = STATES[Math.min(step, STATES.length - 1)]
  const { slope, intercept, showRes, label } = state

  // Clip line to x bounds of the data + margin
  const x1 = 25, x2 = 385
  const y1 = lineY(x1, slope, intercept)
  const y2 = lineY(x2, slope, intercept)

  const axisY = 265

  return (
    <SvgBase>
      {/* Axes */}
      <line x1={25} y1={axisY} x2={390} y2={axisY} stroke="#334155" strokeWidth={1.5} />
      <line x1={25} y1={15}   x2={25}   y2={axisY} stroke="#334155" strokeWidth={1.5} />
      <text x={207} y={282} fill="#475569" fontSize={9} textAnchor="middle">Feature X →</text>
      <text x={14} y={145} fill="#475569" fontSize={8} textAnchor="middle" transform="rotate(-90,14,145)">Target Y</text>

      {/* Residual error bars */}
      {showRes && DATA.map((p, i) => {
        const predY = lineY(p.x, slope, intercept)
        const top = Math.min(p.y, predY)
        const bot = Math.max(p.y, predY)
        return (
          <line key={i}
            x1={p.x} y1={Math.max(top, 16)} x2={p.x} y2={Math.min(bot, axisY - 2)}
            stroke="#f97316" strokeWidth={1.5} opacity={0.7}
            style={{ transition: 'all 0.6s ease' }}
          />
        )
      })}

      {/* Regression line */}
      {step >= 1 && (
        <line
          x1={x1} y1={Math.max(16, Math.min(axisY - 2, y1))}
          x2={x2} y2={Math.max(16, Math.min(axisY - 2, y2))}
          stroke={step === 6 ? '#10b981' : '#f43f5e'}
          strokeWidth={2.5} strokeLinecap="round" opacity={0.9}
          style={{ transition: 'all 0.8s ease' }}
        />
      )}

      {/* Data points (drawn on top of line) */}
      {DATA.map((p, i) => (
        <circle key={i} cx={p.x} cy={Math.max(16, Math.min(axisY - 2, p.y))} r={5.5}
          fill={C[0]} stroke="white" strokeWidth={1.2} opacity={0.85} />
      ))}

      {/* Line label near end of line */}
      {label && step >= 1 && (
        <text
          x={Math.min(x2 - 10, 375)}
          y={Math.max(28, Math.min(axisY - 12, lineY(340, slope, intercept) - 10))}
          fill={step === 6 ? '#10b981' : '#f43f5e'}
          fontSize={9.5} textAnchor="end" fontWeight="bold"
          style={{ transition: 'all 0.8s ease' }}
        >
          {label}
        </text>
      )}

      {/* Legend for residuals */}
      {showRes && (
        <g>
          <line x1={15} y1={28} x2={15} y2={44} stroke="#f97316" strokeWidth={2} />
          <text x={22} y={40} fill="#f97316" fontSize={9}>Residual error</text>
        </g>
      )}

      {step === 6 && <Badge x={200} y={14} text="✓ Minimum MSE — Best Fit Found!" color="#10b981" />}
      {step === 0 && <Label x={207} y={250} text="← Click Play to animate gradient descent →" color="#475569" size={9} />}
    </SvgBase>
  )
}
