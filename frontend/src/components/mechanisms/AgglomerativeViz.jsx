import { SvgBase, C, MUTED, Label, Badge, dist } from './vizUtils.jsx'

// 10 points — we'll animate merging them bottom-up
const POINTS = [
  {x:60,y:200},{x:90,y:220},{x:80,y:190},{x:200,y:210},{x:220,y:195},
  {x:310,y:200},{x:330,y:215},{x:160,y:80},{x:180,y:65},{x:145,y:90},
]

// Pre-defined merge sequence (bottom-up agglomeration)
// Each entry: [i, j] => merged at that step, producing a new super-node
const MERGES = [
  [7,8],    // step 1: closest pair
  [2,0],    // step 2
  [5,6],    // step 3
  [1,2],    // step 4 (joins prev group)
  [3,4],    // step 5
  [7,9],    // step 6 (indices shift but keep simple)
  [3,5],    // step 7
  [0,3],    // step 8: final merge
]

// Node groups at each step [array of sets of original indices]
const groupsAtStep = [
  POINTS.map((_, i) => [i]), // step 0 - each alone
  [[7,8],[2],[0],[5,6],[1],[3,4],[9],[10]],
]

// Cluster color per group (assigned at merge time)
const PALETTE = [C[0], C[1], C[2], C[3], C[4], '#a855f7', '#ec4899', '#14b8a6']

// Simplified: define color assignment per step per point
function getColor(pointIdx, step) {
  if (step === 0) return MUTED
  if (step === 1) {
    if ([7,8].includes(pointIdx)) return C[0]
    return MUTED
  }
  if (step === 2) {
    if ([7,8].includes(pointIdx)) return C[0]
    if ([0,2].includes(pointIdx)) return C[1]
    return MUTED
  }
  if (step === 3) {
    if ([7,8].includes(pointIdx)) return C[0]
    if ([0,2].includes(pointIdx)) return C[1]
    if ([5,6].includes(pointIdx)) return C[2]
    return MUTED
  }
  if (step === 4) {
    if ([7,8].includes(pointIdx)) return C[0]
    if ([0,1,2].includes(pointIdx)) return C[1]
    if ([5,6].includes(pointIdx)) return C[2]
    return MUTED
  }
  if (step === 5) {
    if ([7,8].includes(pointIdx)) return C[0]
    if ([0,1,2].includes(pointIdx)) return C[1]
    if ([5,6].includes(pointIdx)) return C[2]
    if ([3,4].includes(pointIdx)) return C[3]
    return MUTED
  }
  if (step >= 6) {
    if ([7,8,9].includes(pointIdx)) return C[0]
    if ([0,1,2].includes(pointIdx)) return C[1]
    if ([3,4,5,6].includes(pointIdx)) return C[2]
  }
  return MUTED
}

// Dendrogram lines to draw per step
function getDendLines(step) {
  const lines = []
  const sy = 45 // top y for dendrogram
  if (step >= 1) lines.push({x1:POINTS[7].x, y1:POINTS[7].y, x2:POINTS[8].x, y2:POINTS[8].y, color:C[0], arch:true, mid:{x:170,y:sy+20}})
  if (step >= 2) lines.push({x1:POINTS[0].x, y1:POINTS[0].y, x2:POINTS[2].x, y2:POINTS[2].y, color:C[1], arch:true, mid:{x:70,y:sy+25}})
  if (step >= 3) lines.push({x1:POINTS[5].x, y1:POINTS[5].y, x2:POINTS[6].x, y2:POINTS[6].y, color:C[2], arch:true, mid:{x:320,y:sy+25}})
  if (step >= 4) lines.push({x1:POINTS[1].x, y1:POINTS[1].y, x2:POINTS[2].x, y2:POINTS[2].y, color:C[1], arch:true, mid:{x:75,y:sy+10}})
  if (step >= 5) lines.push({x1:POINTS[3].x, y1:POINTS[3].y, x2:POINTS[4].x, y2:POINTS[4].y, color:C[3], arch:true, mid:{x:210,y:sy+20}})
  return lines
}

export const AGG_STEPS = [
  { title: 'Each Point is Its Own Cluster', description: '10 observations, each starting as its own individual cluster. This is the "bottom" of the hierarchy.' },
  { title: 'Find & Merge Closest Pair (Step 1)', description: 'Compute all pairwise distances. The two closest points are merged into a single cluster (Ward linkage minimizes within-cluster variance).' },
  { title: 'Merge Next Closest', description: 'Repeat: find the next globally closest pair of clusters, merge them. Notice the left group forming.' },
  { title: 'A Third Group Forms', description: 'Two more closely-located points merge. Three distinct groups are now visible.' },
  { title: 'Groups Absorb Nearby Stragglers', description: 'A straggler nearby an existing group gets absorbed — its distance to the group is less than any other pair.' },
  { title: 'Another Dense Group Merges', description: 'The fourth natural grouping is found. Larger macro-clusters are forming hierarchically.' },
  { title: '3 Final Clusters ✓', description: 'If we stop the merging at n_clusters=3, we get the three natural groupings shown — no K needed before running!' },
]

export default function AgglomerativeViz({ step }) {
  const dendLines = getDendLines(step)

  return (
    <SvgBase>
      {/* Dendrogram connecting lines */}
      {dendLines.map((l, i) => (
        <g key={i}>
          <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={l.color} strokeWidth={2} strokeDasharray="5 3"
            opacity={0.5} style={{ transition: 'all 0.5s ease' }} />
          <ellipse cx={(l.x1+l.x2)/2} cy={(l.y1+l.y2)/2 - 10} rx={12} ry={8}
            fill={l.color} opacity={0.15} />
        </g>
      ))}

      {/* Cluster halos for final groupings */}
      {step >= 6 && [
        { pts: [7,8,9], color: C[0] },
        { pts: [0,1,2], color: C[1] },
        { pts: [3,4,5,6], color: C[2] },
      ].map(({ pts, color }, gi) => {
        const xs = pts.map(i => POINTS[i]?.x).filter(Boolean)
        const ys = pts.map(i => POINTS[i]?.y).filter(Boolean)
        if (!xs.length) return null
        const cx = xs.reduce((s, v) => s + v, 0) / xs.length
        const cy = ys.reduce((s, v) => s + v, 0) / ys.length
        return <ellipse key={gi} cx={cx} cy={cy} rx={55} ry={40} fill={color} opacity={0.08} stroke={color} strokeWidth={1} strokeDasharray="4 3" />
      })}

      {/* Points */}
      {POINTS.map((p, i) => {
        const color = getColor(i, step)
        return (
          <circle key={i} cx={p.x} cy={p.y} r={8}
            fill={color} stroke="white" strokeWidth={1.5}
            opacity={0.92} style={{ transition: 'fill 0.6s ease' }} />
        )
      })}

      {/* Merge arrow labels */}
      {step >= 1 && step < 6 && <Badge x={200} y={12} text={`Merge #${step}`} color={C[step-1] || C[0]} />}
      {step >= 6 && <Badge x={200} y={278} text="✓ 3 Clusters Identified" color="#10b981" />}

      {step === 0 && <Label x={200} y={278} text="Each point = its own cluster" color="#475569" size={10} />}
    </SvgBase>
  )
}
