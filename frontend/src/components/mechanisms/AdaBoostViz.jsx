import { SvgBase, C, Label, Badge } from './vizUtils.jsx'

// 14 training points — some will be misclassified by weak learners
const DATA = [
  {x:70, y:80, cls:0},{x:100,y:60, cls:0},{x:60, y:130,cls:0},{x:120,y:110,cls:0},{x:80, y:155,cls:0},
  {x:150,y:70, cls:0},{x:90, y:190,cls:0},
  {x:270,y:80, cls:1},{x:310,y:110,cls:1},{x:280,y:140,cls:1},{x:340,y:65, cls:1},{x:290,y:195,cls:1},
  {x:330,y:175,cls:1},{x:260,y:155,cls:1},
]

// First weak learner: vertical split at x=200 — correct but some near boundary are "wrong"
// Points it misclassifies
const MISCLASSIFIED_1 = [4, 6]   // indices
const MISCLASSIFIED_2 = [11, 12] // weaker learner 2 gets these wrong
const MISCLASSIFIED_3 = []       // ensemble gets all right

export const ADA_STEPS = [
  { title: 'Equal Weights Initially', description: 'AdaBoost starts with each training point having equal weight (circle size = weight). No point is more important than another yet.' },
  { title: 'Train Weak Learner #1 (Stump)', description: 'A shallow decision tree (stump) trains on the data. It finds the best single split — simple, but often barely better than random.' },
  { title: 'Identify Misclassified Points', description: 'Weak Learner 1 misclassifies some points (outlined in orange). These points are highlighted — they need more attention.' },
  { title: 'Increase Weights of Misclassified Points', description: 'Misclassified points grow bigger — their sample weight increases. The next weak learner will focus harder on getting these RIGHT.' },
  { title: 'Train Weak Learner #2 on Reweighted Data', description: 'Weak Learner 2 trains on the SAME data but with updated weights. It focuses heavily on the previously misclassified points.' },
  { title: 'Each Learner Gets a Vote Weight (α)', description: 'A highly accurate learner gets a large α (vote weight). A barely-better-than-chance learner gets a small α.' },
  { title: 'Combine Weighted Votes (Ensemble)', description: 'Final prediction = sign(Σ αₜ × hₜ(x)) — a weighted sum of all weak learners. Together they form a STRONG classifier.' },
  { title: 'Strong Classifier Complete ✓', description: 'The ensemble\'s combined boundary is complex and accurate — far beyond what any single stump could achieve on its own.' },
]

export default function AdaBoostViz({ step }) {
  const weights = DATA.map((_, i) => {
    if (step >= 3 && MISCLASSIFIED_1.includes(i)) return 2.2
    if (step >= 5 && MISCLASSIFIED_2.includes(i)) return 2.0
    return 1.0
  })

  const showStump1 = step >= 1
  const showStump2 = step >= 4
  const showEnsemble = step >= 6

  return (
    <SvgBase>
      {/* Ensemble combined region (step 6+) */}
      {showEnsemble && (
        <>
          <polygon points="0,0 210,0 210,270 0,270" fill={C[0]} opacity={0.07}/>
          <polygon points="210,0 400,0 400,270 210,270" fill={C[1]} opacity={0.07}/>
        </>
      )}

      {/* Weak learner lines */}
      {showStump1 && (
        <line x1={200} y1={20} x2={200} y2={265} stroke={C[0]} strokeWidth={2} strokeDasharray="6 3" opacity={0.6}/>
      )}
      {showStump2 && (
        <line x1={20} y1={160} x2={390} y2={160} stroke={C[1]} strokeWidth={2} strokeDasharray="6 3" opacity={0.6}/>
      )}
      {showEnsemble && (
        <path d="M 210 20 L 210 160 L 390 160" fill="none" stroke="white" strokeWidth={2.5} opacity={0.8}/>
      )}

      {/* Data points with weight-based size */}
      {DATA.map((p, i) => {
        const w = weights[i]
        const r = 5 + w * 3
        const isMisclassified1 = step >= 2 && MISCLASSIFIED_1.includes(i)
        const isMisclassified2 = step >= 4 && MISCLASSIFIED_2.includes(i)
        const highlight = isMisclassified1 || isMisclassified2

        return (
          <g key={i}>
            {highlight && <circle cx={p.x} cy={p.y} r={r+5} fill="#f97316" opacity={0.25}/>}
            <circle cx={p.x} cy={p.y} r={r}
              fill={C[p.cls]}
              stroke={highlight ? '#f97316' : 'white'}
              strokeWidth={highlight ? 2.5 : 1.5}
              opacity={0.9} style={{transition:'all 0.5s ease'}}/>
          </g>
        )
      })}

      {/* Weight annotation */}
      {step === 0 && DATA.map((p, i) => (
        <text key={i} x={p.x} y={p.y-12} fill="#94a3b8" fontSize={8} textAnchor="middle">w={1}</text>
      ))}

      {/* Learner labels */}
      {showStump1 && step < 4 && <text x={205} y={35} fill={C[0]} fontSize={9}>Learner 1</text>}
      {showStump2 && <text x={25} y={155} fill={C[1]} fontSize={9}>Learner 2</text>}

      {/* Alpha boxes (step 5+) */}
      {step >= 5 && (
        <g>
          <rect x={310} y={25} width={80} height={55} rx={8} fill="#1e293b" stroke="#334155"/>
          <text x={350} y={42} fill="#94a3b8" fontSize={8} textAnchor="middle" fontWeight="bold">Vote Weights</text>
          <text x={350} y={58} fill={C[0]} fontSize={10} textAnchor="middle">α₁ = 0.72</text>
          <text x={350} y={73} fill={C[1]} fontSize={10} textAnchor="middle">α₂ = 0.54</text>
        </g>
      )}

      {step >= 7 && <Badge x={200} y={278} text="✓ Weak Learners → Strong Ensemble" color="#10b981" />}
      {step === 2 && <Label x={200} y={278} text="Orange outline = misclassified (higher weight next round)" color="#f97316" size={9} />}
    </SvgBase>
  )
}
