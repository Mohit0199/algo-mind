import { SvgBase, C, Label, Badge } from './vizUtils.jsx'

const BLUES = [{x:90,y:210},{x:115,y:230},{x:75,y:245},{x:130,y:215},{x:60,y:225}]
const REDS  = [{x:290,y:75},{x:310,y:95},{x:270,y:85},{x:330,y:65},{x:300,y:55}]

// SVM stages: margin lines and support vectors
const STAGES = [
  { m1:null, m2:null, center:null, svs:[] },
  { m1:{x1:50,y1:20,x2:50,y2:270},  m2:{x1:350,y1:20,x2:350,y2:270}, center:{x1:200,y1:20,x2:200,y2:270}, svs:[] }, // bad boundary
  { m1:{x1:80,y1:20,x2:80,y2:270},  m2:{x1:320,y1:20,x2:320,y2:270}, center:{x1:200,y1:20,x2:200,y2:270}, svs:[BLUES[0],REDS[0]] },
  { m1:{x1:130,y1:20,x2:130,y2:270},m2:{x1:270,y1:20,x2:270,y2:270}, center:{x1:200,y1:20,x2:200,y2:270}, svs:[BLUES[0],BLUES[3],REDS[0],REDS[3]] },
  { m1:{x1:155,y1:20,x2:155,y2:270},m2:{x1:245,y1:20,x2:245,y2:270}, center:{x1:200,y1:20,x2:200,y2:270}, svs:[BLUES[0],BLUES[3],REDS[0],REDS[3]] },
  { m1:{x1:155,y1:20,x2:155,y2:270},m2:{x1:245,y1:20,x2:245,y2:270}, center:{x1:200,y1:20,x2:200,y2:270}, svs:[BLUES[0],BLUES[3],REDS[0],REDS[3]] },
  { m1:{x1:155,y1:20,x2:155,y2:270},m2:{x1:245,y1:20,x2:245,y2:270}, center:{x1:200,y1:20,x2:200,y2:270}, svs:[BLUES[0],BLUES[3],REDS[0],REDS[3]] },
]

export const SVM_STEPS = [
  { title: 'Classification Data', description: 'Two linearly separable classes. SVM\'s goal: find the line (hyperplane in N-D) that separates them with maximum margin.' },
  { title: 'Any Line Can Separate — But Which?', description: 'There are infinite lines that can separate these points. The question is: which one will generalize best to new, unseen data?' },
  { title: 'Find Support Vectors', description: 'Support Vectors are the closest points from each class to the boundary. The margin is the distance between these two outer lines. SVM maximizes this margin.' },
  { title: 'Maximize the Margin', description: 'The margin (gap between dashed lines) widens as the boundary shifts to the center. Wider margin = less sensitivity to noise.' },
  { title: 'Maximum-Margin Hyperplane Found ✓', description: 'The optimal boundary sits exactly halfway between the two classes\' closest points (support vectors). This is the maximum-margin solution.' },
  { title: 'Only Support Vectors Matter', description: 'Remove all non-support-vector points and the boundary doesn\'t change. The model is defined entirely by the support vectors — this is computationally elegant.' },
  { title: 'Decision Boundary Complete ✓', description: 'New points are classified by which side of the hyperplane they fall on. The wide margin means the model is robust to small perturbations.' },
]

export default function SVMViz({ step }) {
  const stage = STAGES[Math.min(step, STAGES.length-1)]
  const { m1, m2, center, svs } = stage
  const marginW = step >= 4 ? 245 - 155 : (step === 3 ? 270-130 : (step === 2 ? 320-80 : (step === 1 ? 350-50 : 0)))

  return (
    <SvgBase>
      {/* Margin fill */}
      {m1 && m2 && (
        <rect x={m1.x1} y={20} width={m2.x1 - m1.x1} height={250}
          fill="#6366f1" opacity={0.07} style={{transition:'all 0.8s ease'}} />
      )}

      {/* Margin lines */}
      {m1 && <line {...m1} stroke={C[0]} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.6} style={{transition:'all 0.8s ease'}}/>}
      {m2 && <line {...m2} stroke={C[1]} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.6} style={{transition:'all 0.8s ease'}}/>}

      {/* Decision boundary */}
      {center && (
        <line {...center} stroke="white" strokeWidth={2.5} opacity={step >= 1 ? 0.9 : 0} style={{transition:'all 0.8s ease'}}/>
      )}

      {/* Margin width label */}
      {step >= 2 && marginW > 0 && (
        <g>
          <line x1={m1?.x1} y1={140} x2={m2?.x1} y2={140} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#arr)" style={{transition:'all 0.8s ease'}}/>
          <text x={(m1?.x1 + m2?.x1)/2} y={130} fill="#94a3b8" fontSize={9} textAnchor="middle" style={{transition:'all 0.8s ease'}}>
            margin = {marginW}px
          </text>
        </g>
      )}

      {/* Support vectors highlight */}
      {svs.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={13} fill="none" stroke="white" strokeWidth={2} strokeDasharray="3 2" opacity={0.7}/>
      ))}

      {/* Data points */}
      {[...BLUES.map(p=>({...p,cls:0})),...REDS.map(p=>({...p,cls:1}))].map((p,i) => {
        const isSV = step >= 5 && !svs.find(s => s.x===p.x && s.y===p.y)
        return (
          <circle key={i} cx={p.x} cy={p.y} r={7}
            fill={C[p.cls]} stroke="white" strokeWidth={1.5}
            opacity={isSV ? 0.25 : 0.9} style={{transition:'opacity 0.5s ease'}}/>
        )
      })}

      {step >= 4 && <text x={205} y={40} fill="white" fontSize={9} textAnchor="start">Hyperplane</text>}
      {step >= 5 && <Badge x={200} y={278} text="Only the circled points define the model" color="white" />}
      {step >= 6 && <Badge x={200} y={14} text="✓ Maximum-Margin Classifier" color="#6366f1" />}
      {step < 1 && <Label x={200} y={278} text="Goal: find separating line with maximum margin" color="#475569" size={10} />}
    </SvgBase>
  )
}
