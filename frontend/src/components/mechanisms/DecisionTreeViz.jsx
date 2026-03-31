import { SvgBase, C, Label, Badge } from './vizUtils.jsx'

const BLUES = [{x:80,y:80},{x:110,y:60},{x:70,y:110},{x:130,y:90},{x:60,y:55},{x:100,y:130}]
const REDS  = [{x:290,y:190},{x:270,y:210},{x:320,y:200},{x:300,y:230},{x:340,y:185},{x:260,y:225}]

// Splits: each is a horizontal or vertical line at a given depth
// Format: {axis:'x'|'y', val, region description, depth}
const SPLITS = [
  { axis:'x', val:200, depthY:[20,270], label:'Split 1: X₁ ≤ 200?', gini:'Gini: 0.50→0.00', color:'#6366f1' },
  { axis:'y', val:145, x1:20,  x2:200, label:'Split 2: X₂ ≤ 145?', gini:'Gini: 0.00', color:'#10b981' },
  { axis:'y', val:145, x1:200, x2:390, label:'Split 3: X₂ ≤ 145?', gini:'Gini: 0.00', color:'#f59e0b' },
]

// Region fills per step (polygons)
const REGIONS = [
  [],
  [{ points:'0,0 200,0 200,270 0,270', color:C[0], opacity:0.08 }],
  [{ points:'0,0 200,0 200,270 0,270', color:C[0], opacity:0.08 }, { points:'0,145 200,145 200,270 0,270', color:C[0], opacity:0.08 }],
  [
    { points:'0,0 200,0 200,145 0,145',   color:C[0], opacity:0.12 },
    { points:'0,145 200,145 200,270 0,270', color:'#94a3b8', opacity:0.05 },
    { points:'200,0 400,0 400,270 200,270', color:C[1], opacity:0.12 },
  ],
]

export const DT_STEPS = [
  { title: 'Training Dataset', description: 'Two classes: Blue and Green. A Decision Tree will learn rules (binary questions) that partition this 2D space to separate them.' },
  { title: 'Evaluate All Possible Splits → Choose Best', description: 'For every feature and every threshold, compute the Gini Impurity of the resulting split. Select the split that maximally reduces impurity (Information Gain).' },
  { title: 'Root Split: X₁ ≤ 200', description: 'The BEST first split is at X₁=200 (vertical line). Left region = mostly Blue, Right region = mostly Green. Gini drops from 0.50 to near 0.' },
  { title: 'Left Branch Is Pure → No More Splits Needed', description: 'All Blue points are on the left with no Green mixed in. Gini = 0 → this leaf is PURE. Pure leaves stop splitting.' },
  { title: 'Right Branch Also Pure ✓', description: 'All Green points are on the right. Both leaves are pure (Gini=0) — the tree has perfectly learned the data.' },
  { title: 'Decision Rules Learned ✓', description: 'The tree produces simple if-else rules: IF X₁ ≤ 200 → Blue, ELSE → Green. Fully interpretable and explainable.' },
]

export default function DecisionTreeViz({ step }) {
  const showSplit1 = step >= 2
  const showSplit2 = step >= 3
  const showSplit3 = step >= 4
  const regions = REGIONS[Math.min(step > 1 ? (step === 2 ? 1 : step <= 3 ? 2 : 3) : 0, REGIONS.length-1)]

  return (
    <SvgBase>
      {/* Region fills */}
      {regions.map((r, i) => (
        <polygon key={i} points={r.points} fill={r.color} opacity={r.opacity} style={{transition:'all 0.6s ease'}} />
      ))}

      {/* Split lines */}
      {showSplit1 && <line x1={200} y1={20} x2={200} y2={262} stroke={C[0]} strokeWidth={2.5} strokeDasharray="6 3" style={{transition:'all 0.5s'}}/>}
      {showSplit2 && <line x1={20}  y1={145} x2={200} y2={145} stroke={C[1]} strokeWidth={2} strokeDasharray="5 3"/>}
      {showSplit3 && <line x1={200} y1={145} x2={390} y2={145} stroke={C[2]} strokeWidth={2} strokeDasharray="5 3"/>}

      {/* Data points */}
      {[...BLUES.map(p=>({...p,cls:0})),...REDS.map(p=>({...p,cls:1}))].map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r={7} fill={C[p.cls]} stroke="white" strokeWidth={1.5} opacity={0.9}/>
      ))}

      {/* Split labels */}
      {showSplit1 && <text x={205} y={35} fill={C[0]} fontSize={10} fontWeight="bold">X₁ ≤ 200?</text>}
      {showSplit1 && <text x={80}  y={15} fill="#94a3b8" fontSize={9} textAnchor="middle">← True (Blue)</text>}
      {showSplit1 && <text x={310} y={15} fill="#94a3b8" fontSize={9} textAnchor="middle">False (Green) →</text>}

      {/* Pure leaf badges */}
      {step >= 3 && <Badge x={100} y={200} text="LEAF: Blue ✓" color={C[0]} />}
      {step >= 4 && <Badge x={300} y={200} text="LEAF: Green ✓" color={C[1]} />}

      {step >= 5 && <Badge x={200} y={278} text="✓ Tree Learned — Gini = 0 on all leaves" color="#10b981" />}
      {step < 2 && <Label x={200} y={278} text="Evaluating every possible split..." color="#475569" size={10} />}
    </SvgBase>
  )
}
