import { SvgBase, C, MUTED, TEXT, dist, Label, Badge } from './vizUtils.jsx'

// A mix of dense + sparse + noise points — perfect for DBSCAN
const DATA = [
  // Dense cluster 1
  {x:85,y:80},{x:100,y:90},{x:92,y:70},{x:110,y:82},{x:78,y:95},{x:103,y:100},{x:90,y:108},{x:115,y:95},
  // Dense cluster 2
  {x:290,y:200},{x:305,y:188},{x:318,y:205},{x:298,y:220},{x:280,y:210},{x:310,y:218},{x:325,y:195},{x:288,y:197},
  // Sparse noise points
  {x:190,y:140},{x:220,y:40},{x:350,y:60},{x:30,y:250},{x:140,y:265},{x:375,y:275},
]

const EPS = 70 // visualization radius for the animation
const MIN_SAMPLES = 3

function findNeighbors(idx, data, eps) {
  return data.map((p, i) => ({ i, d: dist(data[idx], p) })).filter(n => n.i !== idx && n.d <= eps).map(n => n.i)
}

export const DBSCAN_STEPS = [
  { title: 'Unlabeled Dataset', description: 'Points scattered in space. Some form dense groups, others are isolated. DBSCAN will find clusters WITHOUT knowing K.' },
  { title: 'Pick First Point → Measure ε-Neighborhood', description: `Draw an ε-radius circle around a point. Count how many points fall inside. If ≥ ${MIN_SAMPLES}, it's a CORE point.` },
  { title: 'Core Point Found! Expand Cluster', description: 'This point has enough neighbors → labeled CORE. Every neighbor joins the same cluster and is also checked for their own neighborhoods.' },
  { title: 'Chain Reaction — Density-Connected Expansion', description: 'Each newly found neighbor that is also a core point expands the cluster further. Dense regions chain together into one cluster.' },
  { title: 'Cluster 1 Complete', description: 'The first dense region is fully labeled as Cluster 1 (indigo). All points reachable by density chaining are included.' },
  { title: 'Start New Cluster from Another Dense Region', description: 'Move to an unvisited point. A second dense group forms Cluster 2 (emerald) — completely independent from Cluster 1.' },
  { title: 'Noise Points Identified', description: 'Isolated points with fewer than MinPts neighbors in their ε-circle are labeled NOISE (grey ✕). They belong to no cluster — this is DBSCAN\'s superpower.' },
  { title: 'Complete ✓', description: 'Two clusters discovered based on density, plus outliers marked as noise — no predefined K required!' },
]

export default function DBSCANViz({ step }) {
  const cluster1 = [0,1,2,3,4,5,6,7]
  const cluster2 = [8,9,10,11,12,13,14,15]
  const noise = [16,17,18,19,20,21]

  const getColor = (idx) => {
    if (step >= 5 && cluster1.includes(idx)) return C[0]
    if (step >= 6 && cluster2.includes(idx)) return C[1]
    if (step >= 7 && noise.includes(idx)) return '#64748b'
    if (step >= 2 && step < 5 && cluster1.includes(idx) && idx < 5) return C[0]
    return MUTED
  }

  const isNoise = (idx) => step >= 7 && noise.includes(idx)
  const showEps1 = step >= 1 && step <= 4
  const showEps2 = step >= 5 && step <= 6
  const activePoint = step >= 1 && step <= 4 ? DATA[0] : step >= 5 ? DATA[8] : null

  return (
    <SvgBase>
      {/* ε-circle */}
      {showEps1 && (
        <circle cx={DATA[0].x} cy={DATA[0].y} r={EPS} fill={`${C[0]}18`} stroke={C[0]} strokeWidth={1.5} strokeDasharray="5 3" />
      )}
      {showEps2 && (
        <circle cx={DATA[8].x} cy={DATA[8].y} r={EPS} fill={`${C[1]}18`} stroke={C[1]} strokeWidth={1.5} strokeDasharray="5 3" />
      )}

      {/* Density lines from active core point */}
      {step >= 2 && step <= 4 && cluster1.slice(1, 5).map(idx => (
        <line key={idx}
          x1={DATA[0].x} y1={DATA[0].y} x2={DATA[idx].x} y2={DATA[idx].y}
          stroke={C[0]} strokeWidth={1} opacity={0.3} strokeDasharray="4 3" />
      ))}

      {/* Data points */}
      {DATA.map((p, i) => {
        const color = getColor(i)
        const isActive = (showEps1 && i === 0) || (showEps2 && i === 8)
        const isNoisePoint = isNoise(i)

        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={isActive ? 10 : 7}
              fill={color} stroke={isActive ? 'white' : 'rgba(255,255,255,0.3)'}
              strokeWidth={isActive ? 2 : 1.2}
              opacity={0.9} style={{ transition: 'all 0.5s ease' }} />
            {isNoisePoint && (
              <g>
                <line x1={p.x-6} y1={p.y-6} x2={p.x+6} y2={p.y+6} stroke="#94a3b8" strokeWidth={2} />
                <line x1={p.x+6} y1={p.y-6} x2={p.x-6} y2={p.y+6} stroke="#94a3b8" strokeWidth={2} />
              </g>
            )}
            {isActive && (
              <circle cx={p.x} cy={p.y} r={14} fill="none" stroke="white" strokeWidth={1} opacity={0.4}>
                <animate attributeName="r" values="10;16;10" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        )
      })}

      {/* Badges */}
      {step >= 2 && step <= 4 && <Badge x={DATA[0].x} y={DATA[0].y - 18} text="CORE" color={C[0]} />}
      {step >= 5 && <Badge x={DATA[0].x} y={DATA[0].y - 18} text="Cluster 1" color={C[0]} />}
      {step >= 6 && <Badge x={DATA[8].x} y={DATA[8].y - 18} text="Cluster 2" color={C[1]} />}
      {step >= 7 && <Label x={200} y={278} text="Grey ✕ = Noise (no cluster)" color="#64748b" size={10} />}

      {/* MinPts label */}
      {step >= 1 && step <= 4 && (
        <Label x={DATA[0].x + EPS + 5} y={DATA[0].y - 5} text={`ε radius`} color={C[0]} size={10} anchor="start" />
      )}
    </SvgBase>
  )
}
