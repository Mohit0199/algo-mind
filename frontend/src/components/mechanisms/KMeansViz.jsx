import { SvgBase, C, MUTED, TEXT, Label, Badge, dist } from './vizUtils.jsx'

const DATA = [
  {x:82,y:72},{x:105,y:88},{x:88,y:108},{x:115,y:68},{x:72,y:90},{x:98,y:62},
  {x:302,y:78},{x:322,y:98},{x:314,y:62},{x:338,y:84},{x:296,y:94},{x:326,y:72},
  {x:183,y:218},{x:206,y:230},{x:194,y:200},{x:224,y:222},{x:172,y:222},{x:212,y:208},
]
const K = 3
const INIT_CENTROIDS = [{x:170,y:100},{x:200,y:175},{x:235,y:100}]

function assign(data, centroids) {
  return data.map(p => {
    let best = 0, bd = Infinity
    centroids.forEach((c, i) => { const d = dist(p, c); if (d < bd) { bd = d; best = i } })
    return best
  })
}
function meanOf(pts) {
  if (!pts.length) return {x: 200, y: 150}
  return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length }
}
function updateC(data, assignments) {
  return Array.from({ length: K }, (_, i) => meanOf(data.filter((_, j) => assignments[j] === i)))
}

// Pre-compute all steps
const snapshots = []
let centroids = INIT_CENTROIDS
snapshots.push({ centroids: [...centroids], assignments: null, showCentroids: false })
snapshots.push({ centroids: [...centroids], assignments: null, showCentroids: true })
const a1 = assign(DATA, centroids)
snapshots.push({ centroids: [...centroids], assignments: a1, showCentroids: true })
centroids = updateC(DATA, a1)
snapshots.push({ centroids: [...centroids], assignments: a1, showCentroids: true })
const a2 = assign(DATA, centroids)
snapshots.push({ centroids: [...centroids], assignments: a2, showCentroids: true })
centroids = updateC(DATA, a2)
snapshots.push({ centroids: [...centroids], assignments: a2, showCentroids: true })
const a3 = assign(DATA, centroids)
snapshots.push({ centroids: [...centroids], assignments: a3, showCentroids: true })
centroids = updateC(DATA, a3)
snapshots.push({ centroids: [...centroids], assignments: a3, showCentroids: true, converged: true })

export const KMEANS_STEPS = [
  { title: 'Unlabeled Dataset', description: '18 unlabeled points live in 2D space. We can see natural groupings visually — but the algorithm sees nothing yet.' },
  { title: 'Initialize K=3 Centroids', description: 'Place 3 centroids at arbitrary positions. These are our initial guesses for cluster centers — intentionally bad.' },
  { title: 'Assign Points → Nearest Centroid', description: 'Compute Euclidean distance from every point to each centroid. Each point takes the color of its nearest centroid.' },
  { title: 'Recompute Centroid = Mean of Cluster', description: 'Move each centroid to the mean (average x, average y) of all points assigned to it. Watch them slide.' },
  { title: 'Re-assign Points', description: 'With centroids in new positions, some points are now closer to a different centroid. Colors update.' },
  { title: 'Centroids Move Again (Smaller Step)', description: 'The centroids continue converging toward the true cluster centers. Steps are getting smaller.' },
  { title: 'Nearly Stable', description: 'Assignments are almost unchanged. The algorithm is approaching convergence.' },
  { title: 'Converged ✓', description: 'Centroids stopped moving (delta < tolerance). The 3 natural clusters are discovered — no labels needed!' },
]

export default function KMeansViz({ step }) {
  const snap = snapshots[Math.min(step, snapshots.length - 1)]
  const { centroids: cents, assignments, showCentroids, converged } = snap

  return (
    <SvgBase>
      {/* Soft cluster region halos */}
      {showCentroids && cents.map((c, i) => (
        <circle key={`halo-${i}`} cx={c.x} cy={c.y} r={100} fill={C[i]} opacity={0.06} style={{ transition: 'all 0.7s ease' }} />
      ))}

      {/* Data points */}
      {DATA.map((p, i) => {
        const color = assignments ? C[assignments[i]] : MUTED
        return (
          <circle key={i} cx={p.x} cy={p.y} r={7} fill={color} stroke="white" strokeWidth={1.5}
            opacity={0.92} style={{ transition: 'fill 0.6s ease' }} />
        )
      })}

      {/* Centroids */}
      {showCentroids && cents.map((c, i) => (
        <g key={`cent-${i}`} style={{ transition: 'transform 0.8s ease' }} transform={`translate(${c.x},${c.y})`}>
          {converged && (
            <circle r={16} fill={C[i]} opacity={0.15} stroke={C[i]} strokeWidth={1.5}>
              <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
          <line x1={-11} y1={0} x2={11} y2={0} stroke={C[i]} strokeWidth={3} strokeLinecap="round" />
          <line x1={0} y1={-11} x2={0} y2={11} stroke={C[i]} strokeWidth={3} strokeLinecap="round" />
          <circle r={4} fill="white" />
        </g>
      ))}

      {/* Convergence badge */}
      {converged && <Badge x={200} y={275} text="✓ Converged — Algorithm Complete" color="#10b981" />}

      {/* Legend */}
      {step >= 2 && ['Cluster A', 'Cluster B', 'Cluster C'].map((label, i) => (
        <g key={label} transform={`translate(${10 + i * 128},12)`}>
          <circle cx={7} cy={8} r={5} fill={C[i]} />
          <text x={15} y={13} fill="#94a3b8" fontSize={9.5}>{label}</text>
        </g>
      ))}

      {/* Step 0 label */}
      {step === 0 && <Label x={200} y={278} text="← Click Play or Step → to animate" color="#475569" size={10} />}
    </SvgBase>
  )
}
