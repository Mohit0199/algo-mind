// Shared SVG helpers used by all mechanism visualizations
export const BG = '#0f172a'
export const GRID = '#1e293b'
export const MUTED = '#475569'
export const TEXT = '#cbd5e1'
export const C = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7']

export const W = 400
export const H = 290

export function SvgBase({ children }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '340px', display: 'block' }}>
      <rect width={W} height={H} fill={BG} rx="10" />
      {/* subtle grid */}
      {[1,2,3,4].map(i => (
        <g key={i} opacity="0.07">
          <line x1={i*80} y1="0" x2={i*80} y2={H} stroke="#94a3b8" strokeWidth="1"/>
          <line x1="0" y1={i*58} x2={W} y2={i*58} stroke="#94a3b8" strokeWidth="1"/>
        </g>
      ))}
      {children}
    </svg>
  )
}

export function Label({ x, y, text, color = TEXT, size = 10, anchor = 'middle', bold = false }) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} textAnchor={anchor} fontWeight={bold ? 'bold' : 'normal'} fontFamily="monospace">
      {text}
    </text>
  )
}

export function Badge({ x, y, text, color }) {
  const w = text.length * 6.5 + 16
  return (
    <g>
      <rect x={x - w/2} y={y - 11} width={w} height={20} rx="10" fill={color} opacity="0.2" />
      <rect x={x - w/2} y={y - 11} width={w} height={20} rx="10" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <text x={x} y={y + 4} fill={color} fontSize={10} textAnchor="middle" fontWeight="bold">{text}</text>
    </g>
  )
}

export function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}
