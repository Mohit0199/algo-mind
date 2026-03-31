import { SvgBase, C, Label, Badge } from './vizUtils.jsx'

function gaussian(x, mu, sigma) {
  return (1/(sigma*Math.sqrt(2*Math.PI))) * Math.exp(-0.5*((x-mu)/sigma)**2)
}

// Feature distributions per class — P(X|class)
const MU_BLUE = 100, SIGMA_BLUE = 30
const MU_RED  = 260, SIGMA_RED  = 35

const QUERY_X = 170  // the test point X value on horizontal axis

export const NB_STEPS = [
  { title: 'Two-Class Dataset', description: 'Naive Bayes works from probability theory. For each class, it models how features are distributed using a Gaussian bell curve.' },
  { title: 'Learn P(X | Class=Blue)', description: 'From the Blue training points, estimate the mean and standard deviation of feature X. This bell curve represents P(X | Blue).' },
  { title: 'Learn P(X | Class=Green)', description: 'Same for the Green class — a separate Gaussian. "Naive" means this is done independently per feature (assumes features don\'t interact).' },
  { title: 'New Point Arrives at X=170', description: 'A new observation arrives with feature value X=170. We don\'t know its class. Bayes\' theorem will decide.' },
  { title: 'Compute Posterior Probability', description: `P(Blue|X=170) ∝ P(X=170|Blue) × P(Blue). Read off each Gaussian at X=170 and scale by class prior.` },
  { title: 'Pick the Dominant Class ✓', description: `P(Blue) is higher at X=170 (it\'s closer to Blue\'s mean of ${MU_BLUE}). Classified as Blue! The class with the higher posterior wins.` },
]

export default function NaiveBayesViz({ step }) {
  const W = 400, H = 290
  const axisY = 250, leftX = 30, rightX = 380

  // Generate Gaussian curve points
  function curvePoints(mu, sigma, cls) {
    return Array.from({length:80}, (_, i) => {
      const x = leftX + (i/79) * (rightX - leftX)
      const xVal = ((x - leftX) / (rightX - leftX)) * 360  // 0-360 space
      const density = gaussian(xVal, mu, sigma)
      return { x, y: axisY - density * 2800 }
    })
  }

  const bluePoints = curvePoints(MU_BLUE, SIGMA_BLUE, 0)
  const redPoints  = curvePoints(MU_RED,  SIGMA_RED,  1)

  function toPath(pts) {
    return pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  }

  // Query X position on SVG
  const queryX_svg = leftX + (QUERY_X / 360) * (rightX - leftX)

  // Posterior heights at query X
  const pBlueAtQuery = gaussian(QUERY_X, MU_BLUE, SIGMA_BLUE)
  const pRedAtQuery  = gaussian(QUERY_X, MU_RED,  SIGMA_RED)
  const total = pBlueAtQuery + pRedAtQuery
  const pBlue = pBlueAtQuery / total
  const pRed  = pRedAtQuery / total

  // Training scatter (behind the curves)
  const bluePts = Array.from({length:8},(_, i)=>({x: leftX+(MU_BLUE/360)*(rightX-leftX) + (i-4)*12, y:axisY+12}))
  const redPts  = Array.from({length:8},(_, i)=>({x: leftX+(MU_RED/360)*(rightX-leftX)  + (i-4)*12, y:axisY+12}))

  return (
    <SvgBase>
      {/* Axis */}
      <line x1={leftX} y1={axisY} x2={rightX} y2={axisY} stroke="#334155" strokeWidth={1.5}/>
      <text x={200} y={275} fill="#475569" fontSize={9} textAnchor="middle">Feature X →</text>

      {/* Training scatter */}
      {step >= 0 && bluePts.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r={5} fill={C[0]} opacity={0.7}/>
      ))}
      {step >= 0 && redPts.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r={5} fill={C[1]} opacity={0.7}/>
      ))}

      {/* Blue Gaussian (step 1+) */}
      {step >= 1 && (
        <>
          <path d={toPath(bluePoints)} fill={C[0]} opacity={0.2}/>
          <path d={toPath(bluePoints)} fill="none" stroke={C[0]} strokeWidth={2}/>
          <text x={leftX+(MU_BLUE/360)*(rightX-leftX)} y={axisY-gaussian(MU_BLUE,SIGMA_BLUE,0)*2800-8}
            fill={C[0]} fontSize={10} textAnchor="middle">P(X|Blue)</text>
        </>
      )}

      {/* Red Gaussian (step 2+) */}
      {step >= 2 && (
        <>
          <path d={toPath(redPoints)} fill={C[1]} opacity={0.2}/>
          <path d={toPath(redPoints)} fill="none" stroke={C[1]} strokeWidth={2}/>
          <text x={leftX+(MU_RED/360)*(rightX-leftX)} y={axisY-gaussian(MU_RED,SIGMA_RED,0)*2800-8}
            fill={C[1]} fontSize={10} textAnchor="middle">P(X|Green)</text>
        </>
      )}

      {/* Query point vertical line (step 3+) */}
      {step >= 3 && (
        <line x1={queryX_svg} y1={axisY} x2={queryX_svg} y2={60}
          stroke="white" strokeWidth={2} strokeDasharray="5 3"/>
      )}
      {step >= 3 && (
        <g transform={`translate(${queryX_svg}, ${axisY+12})`}>
          <circle r={7} fill="white"/>
          <text y={-15} fill="white" fontSize={10} textAnchor="middle">x={QUERY_X}</text>
        </g>
      )}

      {/* Posterior bars (step 4+) */}
      {step >= 4 && (
        <g>
          <rect x={15} y={200-pBlue*150} width={30} height={pBlue*150} fill={C[0]} opacity={0.85} rx={4}/>
          <rect x={50} y={200-pRed*150}  width={30} height={pRed*150}  fill={C[1]} opacity={0.85} rx={4}/>
          <text x={30} y={210} fill={C[0]} fontSize={9} textAnchor="middle">{(pBlue*100).toFixed(0)}%</text>
          <text x={65} y={210} fill={C[1]} fontSize={9} textAnchor="middle">{(pRed*100).toFixed(0)}%</text>
          <text x={40} y={225} fill="#94a3b8" fontSize={8} textAnchor="middle">Posterior</text>
        </g>
      )}

      {step >= 5 && <Badge x={200} y={14} text={`✓ Classified: Blue (P=${(pBlue*100).toFixed(0)}%)`} color={C[0]} />}
      {step < 1 && <Label x={200} y={260} text="Training points along feature axis" color="#475569" size={10} />}
    </SvgBase>
  )
}
