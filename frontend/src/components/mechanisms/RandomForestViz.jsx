import { SvgBase, C, Label, Badge } from './vizUtils.jsx'

// All 20 training points
const ALL_DATA = [
  {x:70,y:80,cls:0},{x:110,y:60,cls:0},{x:80,y:120,cls:0},{x:130,y:100,cls:0},
  {x:60,y:55,cls:0},{x:100,y:140,cls:0},{x:140,y:70,cls:0},{x:90,y:95,cls:0},
  {x:300,y:200,cls:1},{x:270,y:220,cls:1},{x:330,y:210,cls:1},{x:280,y:245,cls:1},
  {x:340,y:190,cls:1},{x:260,y:230,cls:1},{x:320,y:240,cls:1},{x:295,y:215,cls:1},
]

// Bootstrap samples (indices) for each of 3 trees
const BS1 = [0,1,3,4,6,7,8,10,12,14]  // subset with some left out
const BS2 = [0,2,4,5,7,9,11,13,15,1]
const BS3 = [1,3,5,6,8,10,12,14,2,4]

// Tree boundary lines (simplified)
const TREE_BOUNDS = [
  { x1:200, y1:20, x2:200, y2:270, color:C[0] },  // tree 1: vertical
  { x1:20,  y1:155, x2:380, y2:155, color:C[1] },  // tree 2: horizontal
  { x1:160, y1:20, x2:240, y2:270, color:C[2] },  // tree 3: diagonal-ish
]

export const RF_STEPS = [
  { title: 'Full Training Dataset', description: '16 labeled points — 8 Blue and 8 Green. Random Forest will build multiple trees, each on a different random subset.' },
  { title: 'Bootstrap Sample 1 (Random Subset)', description: 'Draw a random sample WITH replacement — some points appear twice, some not at all (Out-of-Bag). Tree 1 trains on this sample.' },
  { title: 'Tree 1 Learns a Boundary', description: 'Tree 1 trains and draws its decision boundary. It only saw a subset of data + a random subset of features at each split.' },
  { title: 'Bootstrap Sample 2 → Different Sample', description: 'Draw another independent random sample. Tree 2 sees a completely different data distribution — this decorrelates the trees.' },
  { title: 'Tree 2 Learns a Different Boundary', description: 'Tree 2 draws a different boundary than Tree 1. Each tree is slightly wrong, but they\'re wrong in different ways — diversity is the key.' },
  { title: 'Bootstrap Sample 3 → Third View', description: 'Tree 3 trains on yet another random sample. Building more trees reduces variance (overfitting) further.' },
  { title: 'Aggregate All Votes (Soft Voting)', description: 'For a new point, all 3 trees vote. The class with the highest average probability across all trees wins. Ensemble is more accurate than any single tree.' },
  { title: 'Final Ensemble Boundary ✓', description: 'The combined boundary (majority vote of all trees) is smoother and more robust than any individual tree. This is the power of the ensemble.' },
]

export default function RandomForestViz({ step }) {
  const showTree1 = step >= 2
  const showTree2 = step >= 4
  const showTree3 = step >= 5
  const showVoting = step >= 6

  const bs1Points = step === 1 || step === 2 ? ALL_DATA.filter((_, i) => BS1.includes(i)) : null
  const bs2Points = step === 3 || step === 4 ? ALL_DATA.filter((_, i) => BS2.includes(i)) : null

  return (
    <SvgBase>
      {/* Class region background when voting */}
      {showVoting && (
        <>
          <polygon points="0,0 200,0 200,270 0,270" fill={C[0]} opacity={0.07} />
          <polygon points="200,0 400,0 400,270 200,270" fill={C[1]} opacity={0.07} />
        </>
      )}

      {/* Tree boundaries */}
      {showTree1 && <line {...{ x1:200,y1:20,x2:200,y2:265 }} stroke={C[0]} strokeWidth={2} strokeDasharray="7 3" opacity={0.7}/>}
      {showTree2 && <line {...{ x1:20,y1:155,x2:385,y2:155 }} stroke={C[1]} strokeWidth={2} strokeDasharray="7 3" opacity={0.7}/>}
      {showTree3 && <line {...{ x1:175,y1:20,x2:225,y2:265 }} stroke={C[2]} strokeWidth={2} strokeDasharray="7 3" opacity={0.7}/>}

      {/* Tree legend */}
      {showTree1 && <text x={208} y={40} fill={C[0]} fontSize={9}>Tree 1</text>}
      {showTree2 && <text x={25}  y={170} fill={C[1]} fontSize={9}>Tree 2</text>}
      {showTree3 && <text x={228} y={260} fill={C[2]} fontSize={9}>Tree 3</text>}

      {/* Bootstrap highlight overlay */}
      {bs1Points && bs1Points.map((p,i)=>(
        <circle key={`h-${i}`} cx={p.x} cy={p.y} r={13} fill={C[0]} opacity={0.15} stroke={C[0]} strokeWidth={1} strokeDasharray="3 2"/>
      ))}
      {bs2Points && bs2Points.map((p,i)=>(
        <circle key={`h2-${i}`} cx={p.x} cy={p.y} r={13} fill={C[1]} opacity={0.15} stroke={C[1]} strokeWidth={1} strokeDasharray="3 2"/>
      ))}

      {/* All data points */}
      {ALL_DATA.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={7} fill={C[p.cls]} stroke="white" strokeWidth={1.5} opacity={0.9}/>
      ))}

      {/* Voting box (step 6+) */}
      {showVoting && (
        <g>
          <rect x={145} y={100} width={110} height={75} rx={10} fill="#1e293b" stroke="#334155" strokeWidth={1}/>
          <text x={200} y={120} fill="#94a3b8" fontSize={9} textAnchor="middle" fontWeight="bold">VOTES (new point)</text>
          <text x={200} y={140} fill={C[0]} fontSize={11} textAnchor="middle">Tree1: Blue ▶</text>
          <text x={200} y={158} fill={C[1]} fontSize={11} textAnchor="middle">Tree2: Green ▶</text>
          <text x={200} y={170} fill={C[0]} fontSize={9} textAnchor="middle">Tree3: Blue ▶ WIN</text>
        </g>
      )}

      {step >= 7 && <Badge x={200} y={278} text="✓ Ensemble Majority → More Accurate" color="#10b981" />}
      {step === 0 && <Label x={200} y={278} text="16 training points — ready for bootstrapping" color="#475569" size={10} />}
    </SvgBase>
  )
}
