import { SvgBase, C, Label, Badge } from './vizUtils.jsx'

// Same concept as Gradient Boosting but with XGBoost-specific details
const DATA = Array.from({length:18},(_, i)=>({
  x: 25 + i*19,
  y: 200 - Math.sin(i*0.6)*55 - i*4 + (i%3===0?18:-8)
}))
const MEAN_Y = DATA.reduce((s,p)=>s+p.y,0)/DATA.length

function smoothLine(amplitude, phase, shift) {
  return DATA.map(p=>({x:p.x, y: MEAN_Y + Math.sin(p.x*0.015+phase)*amplitude - shift}))
}
const STAGE_PREDS = [
  DATA.map(p=>({x:p.x, y:MEAN_Y})),
  smoothLine(20, 0.6, 6),
  smoothLine(40, 0.4, 12),
  smoothLine(55, 0.2, 16),
]

export const XGB_STEPS = [
  { title: 'Training Data (Regression Mode)', description: 'XGBoost is an optimized, regularized gradient boosting. Like GB, it builds trees sequentially — but adds L1/L2 regularization terms directly to the loss function.' },
  { title: 'F₀: Initial Prediction', description: 'Start with a base prediction (e.g., mean for regression). This is the same as standard Gradient Boosting.' },
  { title: 'Compute Gradients & Hessians (gᵢ, hᵢ)', description: 'XGBoost uses both first-order (gradient) AND second-order (Hessian) derivatives of the loss — this is the key difference vs. standard GBM. More information = better splits.' },
  { title: 'Build Tree 1 Using Score Function', description: 'Each split is evaluated using the XGBoost Gain formula: Gain = ½[Gₗ²/Hₗ+λ + Gᵣ²/Hᵣ+λ − G²/H+λ] − γ. λ and γ are regularization terms that penalize complexity.' },
  { title: 'Regularization Shrinks Leaf Outputs', description: 'Unlike vanilla GB, output weights are shrunk: wⱼ = −Gⱼ/(Hⱼ+λ). The λ term prevents any single leaf from becoming too influential.' },
  { title: 'Update Prediction F₁ = F₀ + η·h₁', description: 'Apply step with learning rate η (same as GB). The prediction corrects toward the true values. Residuals reduce.' },
  { title: 'Repeat — Tree 2 & Tree 3 Added', description: 'Each subsequent tree corrects the remaining error. Column subsampling (like Random Forest) adds additional regularization by using only a fraction of features per tree.' },
  { title: 'Final XGBoost Ensemble ✓', description: 'Result: F(x) = F₀ + η·h₁ + η·h₂ + ... The explicit regularization (λ, γ) prevents overfitting, making XGBoost far more robust than standard Gradient Boosting.' },
]

export default function XGBoostViz({ step }) {
  const axisY = 265

  const predStage = step >= 5 ? (step >= 6 ? 3 : 2) : (step >= 3 ? 1 : (step >= 1 ? 0 : -1))
  const predPts = predStage >= 0 ? STAGE_PREDS[Math.min(predStage, 3)] : null
  const predColors = ['#475569', C[0], C[1], C[2]]
  const predColor = predColors[Math.min(Math.max(predStage,0), 3)]
  const showResiduals = step >= 2 && step !== 5 && step !== 7

  function toPath(pts) {
    return pts?.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  }

  return (
    <SvgBase>
      {/* Axes */}
      <line x1={20} y1={axisY} x2={385} y2={axisY} stroke="#334155" strokeWidth={1.5}/>
      <line x1={20} y1={15}   x2={20}   y2={axisY} stroke="#334155" strokeWidth={1.5}/>

      {/* Residual arrows */}
      {showResiduals && DATA.map((p,i) => {
        const predY = predPts?.[i]?.y ?? MEAN_Y
        return (
          <line key={i} x1={p.x} y1={p.y} x2={p.x} y2={Math.min(predY, axisY-2)}
            stroke="#f97316" strokeWidth={1.5} opacity={0.7} style={{transition:'all 0.6s ease'}}/>
        )
      })}

      {/* Prediction line */}
      {predPts && (
        <path d={toPath(predPts)} fill="none" stroke={predColor} strokeWidth={2.5}
          strokeLinecap="round" style={{transition:'all 0.8s ease'}}/>
      )}

      {/* Data points */}
      {DATA.map((p,i) => (
        <circle key={i} cx={p.x} cy={p.y} r={5.5} fill={C[0]} stroke="white" strokeWidth={1.2} opacity={0.85}/>
      ))}

      {/* XGBoost formula box */}
      {step >= 3 && step <= 4 && (
        <g>
          <rect x={100} y={20} width={200} height={55} rx={8} fill="#1e293b" stroke="#6366f1" strokeWidth={1}/>
          <text x={200} y={38} fill="#a5b4fc" fontSize={9} textAnchor="middle" fontWeight="bold">XGBoost Leaf Score</text>
          <text x={200} y={53} fill="#e2e8f0" fontSize={8.5} textAnchor="middle">w* = -G / (H + λ)</text>
          <text x={200} y={68} fill="#94a3b8" fontSize={8} textAnchor="middle">λ = L2 regularization</text>
        </g>
      )}

      {/* Regularization visual */}
      {step === 4 && (
        <g>
          <text x={200} y={100} fill="#f59e0b" fontSize={10} textAnchor="middle" fontWeight="bold">λ shrinks leaf weights →</text>
          <text x={200} y={115} fill="#f59e0b" fontSize={9} textAnchor="middle">prevents any leaf becoming too large</text>
        </g>
      )}

      {/* Column subsampling label */}
      {step >= 6 && step < 7 && (
        <text x={200} y={35} fill={C[2]} fontSize={9} textAnchor="middle">+ Column subsampling (like RF) per tree</text>
      )}

      {/* Trees added counter */}
      {step >= 5 && (
        <g>
          <rect x={310} y={20} width={80} height={40} rx={8} fill="#1e293b" stroke="#334155"/>
          <text x={350} y={36} fill="#94a3b8" fontSize={8} textAnchor="middle">Trees</text>
          <text x={350} y={52} fill="#10b981" fontSize={14} textAnchor="middle" fontWeight="bold">
            {step >= 6 ? 3 : 1}
          </text>
        </g>
      )}

      {step >= 7 && <Badge x={200} y={278} text="✓ XGBoost: Regularized Gradient Boosting" color="#10b981" />}
      {step < 1 && <Label x={200} y={278} text="XGBoost adds L1/L2 regularization to Gradient Boosting" color="#475569" size={9} />}
      {showResiduals && step < 3 && <text x={25} y={30} fill="#f97316" fontSize={9}>↕ Gradients & Hessians</text>}
    </SvgBase>
  )
}
