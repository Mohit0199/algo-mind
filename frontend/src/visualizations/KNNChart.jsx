import { useMemo } from 'react'
import { Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

const CLASS_COLORS = [
  { bg: 'rgba(99,102,241,0.7)', border: '#6366F1' },
  { bg: 'rgba(236,72,153,0.7)', border: '#EC4899' },
  { bg: 'rgba(34,197,94,0.7)', border: '#22C55E' },
]

/**
 * Generate clustered data for 3 classes.
 */
function generateClusteredData(numPerClass = 30) {
  const centers = [
    { cx: 25, cy: 25 },
    { cx: 65, cy: 70 },
    { cx: 75, cy: 25 },
  ]

  return centers.map((c, classIdx) => {
    const points = []
    for (let i = 0; i < numPerClass; i++) {
      points.push({
        x: parseFloat((c.cx + (Math.random() - 0.5) * 30).toFixed(2)),
        y: parseFloat((c.cy + (Math.random() - 0.5) * 30).toFixed(2)),
        classIdx,
      })
    }
    return points
  })
}

/**
 * Euclidean distance.
 */
function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

/**
 * KNN classify a query point.
 */
function knnClassify(query, allPoints, k) {
  const sorted = [...allPoints]
    .map(p => ({ ...p, d: dist(query, p) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)

  const votes = [0, 0, 0]
  sorted.forEach(p => votes[p.classIdx]++)
  return votes.indexOf(Math.max(...votes))
}

export default function KNNChart({ controls }) {
  const k = Math.max(1, Math.min(15, controls?.k ?? 3))

  const { classSets, queryPoint, neighbours, predictedClass } = useMemo(() => {
    const sets = generateClusteredData(25)
    const allPoints = sets.flat()
    const query = { x: 50, y: 50 }
    const allSorted = [...allPoints]
      .map(p => ({ ...p, d: dist(query, p) }))
      .sort((a, b) => a.d - b.d)
    const neighbours = allSorted.slice(0, k)
    const predicted = knnClassify(query, allPoints, k)
    return { classSets: sets, queryPoint: query, neighbours, predictedClass: predicted }
  }, [k])

  const kRadius = neighbours.length > 0
    ? neighbours[neighbours.length - 1].d * 1.05
    : 20

  // Build Chart.js datasets
  const classDatasets = classSets.map((pts, i) => ({
    label: `Class ${i + 1}`,
    data: pts,
    backgroundColor: CLASS_COLORS[i].bg,
    borderColor: CLASS_COLORS[i].border,
    pointRadius: 6,
    pointHoverRadius: 8,
    type: 'scatter',
  }))

  // Highlight K neighbours
  const neighbourDataset = {
    label: `${k} Nearest Neighbours`,
    data: neighbours.map(p => ({ x: p.x, y: p.y })),
    backgroundColor: 'rgba(245,158,11,0.9)',
    borderColor: '#F59E0B',
    pointRadius: 9,
    pointStyle: 'circle',
    type: 'scatter',
  }

  // Query point
  const queryDataset = {
    label: 'Query Point',
    data: [queryPoint],
    backgroundColor: CLASS_COLORS[predictedClass].bg,
    borderColor: '#FFFFFF',
    pointRadius: 12,
    pointStyle: 'star',
    type: 'scatter',
  }

  const data = { datasets: [...classDatasets, neighbourDataset, queryDataset] }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    scales: {
      x: {
        min: 0, max: 100,
        grid: { color: 'rgba(51,65,85,0.5)' },
        ticks: { color: '#94A3B8' },
        title: { display: true, text: 'Feature 1', color: '#94A3B8' },
      },
      y: {
        min: 0, max: 100,
        grid: { color: 'rgba(51,65,85,0.5)' },
        ticks: { color: '#94A3B8' },
        title: { display: true, text: 'Feature 2', color: '#94A3B8' },
      }
    },
    plugins: {
      legend: { labels: { color: '#E2E8F0', font: { size: 11 } } },
      tooltip: {
        backgroundColor: '#1E293B',
        borderColor: '#334155', borderWidth: 1,
        titleColor: '#E2E8F0', bodyColor: '#94A3B8',
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col" style={{ minHeight: '320px' }}>
      <div className="flex items-center justify-between mb-2 text-xs text-muted">
        <span>KNN Classification · k = <span className="text-accent-light font-bold">{k}</span></span>
        <span>
          ★ Query predicts:{' '}
          <span className="font-bold" style={{ color: CLASS_COLORS[predictedClass].border }}>
            Class {predictedClass + 1}
          </span>
        </span>
      </div>
      <div className="flex-1">
        <Scatter data={data} options={options} />
      </div>
    </div>
  )
}
