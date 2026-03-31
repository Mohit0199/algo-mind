import { useMemo } from 'react'
import { Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

/**
 * Generate scatter data with a linear trend and configurable noise.
 */
function generateData(numPoints, noisePct) {
  const noiseStrength = (noisePct / 100) * 60
  const points = []
  for (let i = 0; i < numPoints; i++) {
    const x = Math.random() * 100
    const noise = (Math.random() - 0.5) * 2 * noiseStrength
    const y = 0.6 * x + 20 + noise
    points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) })
  }
  return points
}

/**
 * Compute OLS best-fit line endpoints.
 */
function computeBestFitLine(points) {
  const n = points.length
  if (n < 2) return []
  const sumX = points.reduce((s, p) => s + p.x, 0)
  const sumY = points.reduce((s, p) => s + p.y, 0)
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0)
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0)
  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const b = (sumY - m * sumX) / n
  return [
    { x: 0, y: b },
    { x: 100, y: m * 100 + b }
  ]
}

export default function LinearRegressionChart({ controls }) {
  const noise = controls?.noise ?? 30
  const numPoints = controls?.points ?? 50

  const { scatterPoints, linePoints } = useMemo(() => {
    const pts = generateData(numPoints, noise)
    return { scatterPoints: pts, linePoints: computeBestFitLine(pts) }
  }, [noise, numPoints])

  const data = {
    datasets: [
      {
        label: 'Data Points',
        data: scatterPoints,
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        pointRadius: 5,
        pointHoverRadius: 7,
        type: 'scatter',
      },
      {
        label: 'Best Fit Line',
        data: linePoints,
        type: 'line',
        borderColor: '#F59E0B',
        borderWidth: 2.5,
        pointRadius: 0,
        fill: false,
        tension: 0,
        spanGaps: true,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: 100,
        title: { display: true, text: 'Feature (X)', color: '#94A3B8' },
        grid: { color: 'rgba(51,65,85,0.5)' },
        ticks: { color: '#94A3B8' },
      },
      y: {
        min: -20,
        max: 120,
        title: { display: true, text: 'Target (Y)', color: '#94A3B8' },
        grid: { color: 'rgba(51,65,85,0.5)' },
        ticks: { color: '#94A3B8' },
      }
    },
    plugins: {
      legend: {
        labels: { color: '#E2E8F0', font: { size: 12 } }
      },
      tooltip: {
        backgroundColor: '#1E293B',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#E2E8F0',
        bodyColor: '#94A3B8',
      }
    }
  }

  return (
    <div className="w-full h-full relative" style={{ minHeight: '320px' }}>
      <div className="absolute top-0 left-0 right-0 text-center">
        <span className="text-xs text-muted">Scatter Plot with Best-Fit Line · OLS Regression</span>
      </div>
      <div className="w-full" style={{ height: '100%', paddingTop: '24px' }}>
        <Scatter data={data} options={options} />
      </div>
    </div>
  )
}
