import { SvgBase, C, Label, Badge } from './vizUtils.jsx'

// 20 regression points with nonlinear trend
const DATA = Array.from({length:18},(_, i)=>({
  x: 25 + i*19,
  y: 200 - Math.sin(i*0.6)*60 - i*4 + (i%3===0?20:-10)
}))

const MEAN_Y = DATA.reduce((s,p)=>s+p.y,0)/DATA.length

// Gradient boosting states: [prediction line Y values, residuals shown]
const PRED_LINES = [
  { yVal: MEAN_Y, label: 'F₀ = mean(y)', color: '#64748b' }, // step 2: mean
  { yVal: null,   label: 'Tree 1 fits residuals', color: C[0] }, // step 3: tree 1
  { yVal: null,   label: 'F₁ = F₀ + α·h₁', color: C[1] }, // step 4: improved
  { yVal: null,   label: 'Tree 2 fits NEW residuals', color: C[2] }, // step 5
  { yVal: null,   label: 'F₂ = F₁ + α·h₂ (better!)', color: C[3] }, // step 6
]

// Pre-compute prediction improvements
function smoothLine(offset, amplitude, phase) {
  return DATA.map(p => ({ x:p.x, y: MEAN_Y + Math.sin(p.x*0.015+phase)*amplitude - offset }))
}
const STAGE_PREDS = [
  DATA.map(p=>({x:p.x, y:MEAN_Y})),               // F0: flat mean
  smoothLine(5, 25, 0.5),                           // F1: first correction
  smoothLine(10, 45, 0.3),                          // F2: second correction
  smoothLine(12, 58, 0.1),                          // F3: closer still
]

export const GB_STEPS = [
  { title: 'Regression Training Data', description: 'A nonlinear output we need to predict. Gradient Boosting builds an additive ensemble — each new tree corrects the ERRORS of all previous trees.' },
  { title: 'F₀: Initialize with the Mean', description: 'The first prediction is simply the mean of all target values. This is the simplest possible starting point — a flat horizontal line.' },
  { title: 'Compute Residuals (rᵢ = yᵢ − F₀)', description: 'Orange arrows show residuals: how far each point is from the current prediction. Positive = predict too low, Negative = predict too high.' },
  { title: 'Train Tree 1 to Fit the Residuals', description: 'A shallow tree (max_depth=3) is trained to PREDICT THE RESIDUALS — not the raw targets. It learns where we\'re systematically wrong.' },
  { title: 'F₁ = F₀ + α × h₁ (Improved)', description: 'Update: new prediction = old prediction + (learning_rate × tree1_output). The line corrects toward the data (blue). Residuals shrink.' },
  { title: 'Compute NEW Residuals, Train Tree 2', description: 'Compute residuals from F₁. Train Tree 2 on these NEW (smaller) residuals. Each iteration solves the remaining error.' },
  { title: 'F₂ = F₁ + α × h₂ (Even Better)', description: 'Second update applied. The prediction follows the data much more closely. We keep adding trees until n_estimators is reached or error stops dropping.' },
  { title: 'Strong Regressor ✓', description: 'Final model = F₀ + α·h₁ + α·h₂ + ... The additive combination creates a flexible, highly accurate model from many weak shallow trees.' },
]

export default function GradientBoostingViz({ step }) {
  const axisY = 265, leftX = 20, rightX = 385

  const predStage = Math.max(0, step >= 4 ? (step >= 6 ? 3 : step >= 4 ? 2 : 1) : (step >= 1 ? 0 : -1))
  const predPts = predStage >= 0 ? STAGE_PREDS[Math.min(predStage, STAGE_PREDS.length-1)] : null

  const predColors = ['#475569', C[0], C[1], C[2]]
  const predColor = predColors[Math.min(predStage, predColors.length-1)]
  const showResiduals = step >= 2 && step !== 4 && step !== 6

  function toPath(pts) {
    return pts?.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  }

  return (
    <SvgBase>
      {/* Axes */}
      <line x1={leftX} y1={axisY} x2={rightX} y2={axisY} stroke="#334155" strokeWidth={1.5}/>
      <line x1={leftX} y1={15}    x2={leftX}  y2={axisY} stroke="#334155" strokeWidth={1.5}/>

      {/* Residual arrows */}
      {showResiduals && DATA.map((p, i) => {
        const predY = predPts ? predPts[i]?.y : MEAN_Y
        if (!predY) return null
        return (
          <line key={i} x1={p.x} y1={p.y} x2={p.x} y2={Math.min(predY, axisY)}
            stroke="#f97316" strokeWidth={1.5} opacity={0.7}
            style={{ transition: 'all 0.6s ease' }}/>
        )
      })}

      {/* Prediction line */}
      {predPts && (
        <path d={toPath(predPts)} fill="none" stroke={predColor} strokeWidth={2.5}
          strokeLinecap="round" opacity={0.9} style={{transition:'all 0.8s ease'}}/>
      )}

      {/* Ground truth data points */}
      {DATA.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={5.5} fill={C[0]} stroke="white" strokeWidth={1.2} opacity={0.85}/>
      ))}

      {/* Labels */}
      {step >= 1 && predPts && (
        <text x={rightX-5} y={predPts[predPts.length-1]?.y-8} fill={predColor} fontSize={9} textAnchor="end" fontWeight="bold">
          {['F₀: mean','F₁','F₂','F₃'][Math.min(predStage,3)]}
        </text>
      )}

      {showResiduals && <text x={leftX+5} y={30} fill="#f97316" fontSize={9}>↕ Residuals (errors to fix)</text>}

      {/* Iteration counter */}
      {step >= 4 && (
        <g>
          <rect x={310} y={20} width={80} height={40} rx={8} fill="#1e293b" stroke="#334155"/>
          <text x={350} y={36} fill="#94a3b8" fontSize={8} textAnchor="middle">Trees added</text>
          <text x={350} y={52} fill="#10b981" fontSize={14} textAnchor="middle" fontWeight="bold">
            {step >= 6 ? 3 : step >= 4 ? 2 : 1}
          </text>
        </g>
      )}

      {step >= 7 && <Badge x={200} y={278} text="✓ Additive Ensemble — Sequential Correction" color="#10b981" />}
      {step === 0 && <Label x={200} y={278} text="Nonlinear regression data" color="#475569" size={10} />}
    </SvgBase>
  )
}
