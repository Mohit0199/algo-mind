import { SvgBase, C, MUTED, Label, Badge, dist } from './vizUtils.jsx'

// Training data: 2 classes
const BLUES = [{x:80,y:80},{x:110,y:60},{x:70,y:110},{x:130,y:90},{x:95,y:130},{x:60,y:55},{x:140,y:120}]
const REDS  = [{x:300,y:200},{x:270,y:180},{x:330,y:220},{x:280,y:230},{x:320,y:170},{x:350,y:205},{x:260,y:210}]
const ALL = [...BLUES.map(p=>({...p,cls:0})),...REDS.map(p=>({...p,cls:1}))]

const QUERY = {x:195, y:160}  // the unknown test point
const K = 5

// Sort all training by distance to query
const sorted = [...ALL].sort((a,b) => dist(a, QUERY) - dist(b, QUERY))
const kNeighbors = sorted.slice(0, K)
const votes = kNeighbors.reduce((acc, n) => { acc[n.cls]++; return acc }, [0,0])
const winner = votes[0] >= votes[1] ? 0 : 1

export const KNN_STEPS = [
  { title: 'Labeled Training Data', description: 'Our training set has two classes — Blue (class 0) and Green (class 1). We need to classify the new unknown point.' },
  { title: 'Unknown Point Arrives', description: 'A new data point (star) needs a label. K-Nearest Neighbors will decide by looking at the K closest training examples around it.' },
  { title: 'Measure Distance to All Points', description: 'KNN computes the Euclidean distance from the query point to every single training point. No model is trained — it\'s lazy learning.' },
  { title: 'Select K=5 Nearest Neighbors', description: `A ring expands until it captures exactly K=${K} neighbors. The closest ${K} points are highlighted and will cast a vote.` },
  { title: 'Neighbors Vote by Majority', description: `Blues vote: ${votes[0]}, Greens vote: ${votes[1]}. Each of the K neighbors votes for their class — majority wins.` },
  { title: `Classified as ${winner === 0 ? 'Blue' : 'Green'} ✓`, description: `The query point is assigned to class ${winner === 0 ? 'Blue (0)' : 'Green (1)'} by majority vote of its ${K} nearest neighbors.` },
]

export default function KNNViz({ step }) {
  // Compute ring radius = distance to k-th neighbor + padding
  const ringR = dist(QUERY, kNeighbors[K-1]) + 10

  return (
    <SvgBase>
      {/* Distance lines from query to all (step 2) */}
      {step === 2 && ALL.map((p, i) => (
        <line key={i} x1={QUERY.x} y1={QUERY.y} x2={p.x} y2={p.y}
          stroke="#94a3b8" strokeWidth={0.7} opacity={0.25} />
      ))}

      {/* K-neighbor selection ring */}
      {step >= 3 && (
        <circle cx={QUERY.x} cy={QUERY.y} r={ringR}
          fill="rgba(99,102,241,0.07)" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="5 3" />
      )}

      {/* Distance lines to k-neighbors only (step 3) */}
      {step === 3 && kNeighbors.map((p, i) => (
        <line key={i} x1={QUERY.x} y1={QUERY.y} x2={p.x} y2={p.y}
          stroke={C[p.cls]} strokeWidth={1.2} opacity={0.5} />
      ))}

      {/* Training points */}
      {ALL.map((p, i) => {
        const isNeighbor = step >= 3 && kNeighbors.includes(p)
        return (
          <circle key={i} cx={p.x} cy={p.y} r={isNeighbor ? 9 : 7}
            fill={C[p.cls]} stroke={isNeighbor ? 'white' : 'rgba(255,255,255,0.3)'}
            strokeWidth={isNeighbor ? 2.5 : 1} opacity={0.9} style={{ transition: 'all 0.4s ease' }} />
        )
      })}

      {/* Query point (step >= 1) */}
      {step >= 1 && (
        <g transform={`translate(${QUERY.x},${QUERY.y})`}>
          {step >= 5 && (
            <circle r={14} fill={C[winner]} opacity={0.2}>
              <animate attributeName="r" values="12;18;12" dur="1.5s" repeatCount="indefinite" />
            </circle>
          )}
          {/* Star shape */}
          {[0,72,144,216,288].map((angle, si) => {
            const rad = (angle - 90) * Math.PI / 180
            const x = Math.cos(rad) * 11
            const y = Math.sin(rad) * 11
            return <circle key={si} cx={x} cy={y} r={3}
              fill={step >= 5 ? C[winner] : 'white'} opacity={0.9} style={{ transition: 'fill 0.5s ease' }} />
          })}
          <circle r={5} fill={step >= 5 ? C[winner] : 'white'} style={{ transition: 'fill 0.5s ease' }} />
          <circle r={5} fill="none" stroke={step >= 5 ? C[winner] : '#6366f1'} strokeWidth={2} />
        </g>
      )}

      {/* Vote tally (step 4+) */}
      {step >= 4 && (
        <g>
          <rect x={280} y={50} width={110} height={80} rx={10} fill="#1e293b" stroke="#334155" strokeWidth={1} />
          <text x={335} y={70} fill="#94a3b8" fontSize={10} textAnchor="middle" fontWeight="bold">VOTES</text>
          <circle cx={300} cy={90} r={7} fill={C[0]} />
          <text x={315} y={95} fill="#e2e8f0" fontSize={12} fontWeight="bold">Blue: {votes[0]}</text>
          <circle cx={300} cy={115} r={7} fill={C[1]} />
          <text x={315} y={120} fill="#e2e8f0" fontSize={12} fontWeight="bold">Green: {votes[1]}</text>
        </g>
      )}

      {step >= 5 && <Badge x={QUERY.x} y={QUERY.y - 22} text={winner === 0 ? '→ Blue!' : '→ Green!'} color={C[winner]} />}
      {step === 0 && <Label x={200} y={278} text="14 labeled training points" color="#475569" size={10} />}
      {step === 1 && <Label x={QUERY.x} y={QUERY.y + 22} text="? unknown" color="white" size={10} />}
    </SvgBase>
  )
}
