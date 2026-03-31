import { SvgBase, C, Label, Badge } from './vizUtils.jsx'

const BLUES = [{x:80,y:200},{x:100,y:220},{x:70,y:240},{x:120,y:215},{x:60,y:210},{x:90,y:235}]
const REDS  = [{x:290,y:80},{x:310,y:100},{x:270,y:90},{x:330,y:70},{x:300,y:65},{x:280,y:110}]

// Sigmoid function
function sigmoid(z) { return 1 / (1 + Math.exp(-z)) }

// At each step, we animate the decision boundary rotating into place
// Decision boundary: a line on the SVG where predicted prob = 0.5
const BOUNDARIES = [
  { x1:200, y1:20,  x2:200, y2:270, opacity:0 },         // step 0: none
  { x1:200, y1:20,  x2:200, y2:270, opacity:0.3 },         // step 1: vertical (bad)
  { x1:100, y1:20,  x2:300, y2:270, opacity:0.5 },         // step 2: tilting
  { x1:60,  y1:60,  x2:340, y2:240, opacity:0.7 },         // step 3: nearly there
  { x1:40,  y1:80,  x2:360, y2:220, opacity:1.0 },         // step 4: good
  { x1:40,  y1:80,  x2:360, y2:220, opacity:1.0 },         // step 5: same, show sigmoid
  { x1:40,  y1:80,  x2:360, y2:220, opacity:1.0 },         // step 6: final + prob
]

export const LOG_STEPS = [
  { title: 'Binary Classification Data', description: 'Two classes: Blue (0) and Green (1). Unlike linear regression, we need to predict a category, not a number.' },
  { title: 'Start with a Linear Score (z)', description: 'Logistic Regression first computes a linear combination z = w₀ + w₁x₁ + w₂x₂. This is just a weighted sum — same as linear regression.' },
  { title: 'Apply Sigmoid: σ(z) = 1/(1+e⁻ᶻ)', description: 'The sigmoid "squishes" any real-valued z into the range (0, 1). This gives us a probability: P(class=1|x).' },
  { title: 'Gradient Descent Adjusts Weights', description: 'Using cross-entropy loss, the model adjusts weights w to shift the decision boundary toward better separation.' },
  { title: 'Decision Boundary Converges', description: 'The line where P=0.5 — the decision boundary — settles into the optimal separating position.' },
  { title: 'Probability Output', description: 'A point left of boundary gets P(green) ≈ 0.05 → classified Blue. Right of boundary gets P(green) ≈ 0.95 → classified Green.' },
  { title: 'Classification Complete ✓', description: 'Every point is classified by whether its probability crosses the 0.5 threshold. Logistic Regression outputs calibrated probabilities, not just labels.' },
]

export default function LogisticRegressionViz({ step }) {
  const bnd = BOUNDARIES[Math.min(step, BOUNDARIES.length-1)]

  // Sigmoid curve display (step 2+)
  const sigPoints = step >= 2 ? Array.from({length:50},(_,i)=>{
    const z = (i/49) * 12 - 6
    return { x: 30 + i*7.2, y: 150 - sigmoid(z)*80 }
  }) : []
  const sigPath = sigPoints.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  return (
    <SvgBase>
      {/* Sigmoid curve (background — step 2+) */}
      {step >= 2 && (
        <g opacity={0.15}>
          <path d={sigPath} fill="none" stroke="#a855f7" strokeWidth={2} />
          <text x={340} y={80} fill="#a855f7" fontSize={9}>σ(z)=1</text>
          <text x={340} y={160} fill="#a855f7" fontSize={9}>σ(z)=0.5</text>
          <text x={340} y={230} fill="#a855f7" fontSize={9}>σ(z)=0</text>
          <line x1={30} y1={150} x2={390} y2={150} stroke="#a855f7" strokeWidth={0.8} strokeDasharray="3 3" />
        </g>
      )}

      {/* Decision boundary */}
      {step >= 1 && (
        <line x1={bnd.x1} y1={bnd.y1} x2={bnd.x2} y2={bnd.y2}
          stroke="#a855f7" strokeWidth={2.5} strokeDasharray="8 4"
          opacity={bnd.opacity} style={{ transition: 'all 0.8s ease' }} />
      )}

      {/* Class shading (step 4+) */}
      {step >= 4 && (
        <>
          <polygon points={`${bnd.x1},${bnd.y1} ${bnd.x2},${bnd.y2} 0,270 0,0`} fill={C[0]} opacity={0.06} />
          <polygon points={`${bnd.x1},${bnd.y1} ${bnd.x2},${bnd.y2} 400,270 400,0`} fill={C[1]} opacity={0.06} />
        </>
      )}

      {/* Data points */}
      {[...BLUES.map(p=>({...p,cls:0})), ...REDS.map(p=>({...p,cls:1}))].map((p,i) => (
        <circle key={i} cx={p.x} cy={p.y} r={7}
          fill={C[p.cls]} stroke="white" strokeWidth={1.5} opacity={0.9} />
      ))}

      {/* Probability annotation */}
      {step >= 5 && (
        <g>
          <text x={80}  y={270} fill={C[0]} fontSize={10} textAnchor="middle">P(green)≈0.05 → Blue</text>
          <text x={310} y={50}  fill={C[1]} fontSize={10} textAnchor="middle">P(green)≈0.95 → Green</text>
        </g>
      )}

      {step >= 6 && <Badge x={200} y={14} text="✓ Decision Boundary Optimal" color="#a855f7" />}
      {step < 1 && <Label x={200} y={278} text="Binary classification — 2 classes, 2D features" color="#475569" size={10} />}
      {step === 1 && <Label x={210} y={135} text="Decision boundary (P=0.5)" color="#a855f7" size={9} anchor="start" />}
    </SvgBase>
  )
}
