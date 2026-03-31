import { useEffect, useRef, useMemo } from 'react'
import * as d3 from 'd3'

/**
 * Generate a balanced binary decision tree structure up to `maxDepth`.
 */
function buildTree(depth, maxDepth, nodeId = 0) {
  const questions = [
    'Age > 30?', 'Income > 50k?', 'Education > 12yr?',
    'Has Loan?', 'Credit > 700?', 'Married?',
    'Owns Home?', 'Employed > 2yr?', 'Savings > 10k?',
    'Uses Card?', 'Late Payment?', 'Income > 80k?',
  ]
  const labels = ['✅ Yes', '❌ No', '⚠️ Maybe', '✅ Approve', '❌ Reject']

  if (depth >= maxDepth) {
    return {
      id: nodeId,
      name: labels[nodeId % labels.length],
      isLeaf: true,
      children: [],
    }
  }

  return {
    id: nodeId,
    name: questions[nodeId % questions.length],
    isLeaf: false,
    children: [
      buildTree(depth + 1, maxDepth, nodeId * 2 + 1),
      buildTree(depth + 1, maxDepth, nodeId * 2 + 2),
    ],
  }
}

export default function DecisionTreeChart({ controls }) {
  const svgRef = useRef(null)
  const depth = Math.max(1, Math.min(6, controls?.depth ?? 3))

  const treeData = useMemo(() => buildTree(0, depth), [depth])

  useEffect(() => {
    if (!svgRef.current) return
    const container = svgRef.current.parentElement
    const W = container.clientWidth || 600
    const H = Math.max(300, depth * 90 + 60)

    // Clear
    d3.select(svgRef.current).selectAll('*').remove()

    const margin = { top: 40, right: 20, bottom: 20, left: 20 }
    const innerW = W - margin.left - margin.right
    const innerH = H - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
      .attr('width', W)
      .attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const root = d3.hierarchy(treeData)
    const treeLayout = d3.tree().size([innerW, innerH])
    treeLayout(root)

    // Links
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y))
      .attr('fill', 'none')
      .attr('stroke', '#334155')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.8)

    // Node groups
    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)

    // Node circles/rects
    node.each(function(d) {
      const el = d3.select(this)
      if (d.data.isLeaf) {
        // Leaf: rounded rect
        el.append('rect')
          .attr('x', -40).attr('y', -14)
          .attr('width', 80).attr('height', 28)
          .attr('rx', 8)
          .attr('fill', 'rgba(34,197,94,0.15)')
          .attr('stroke', '#22C55E')
          .attr('stroke-width', 1.5)
      } else {
        // Internal: circle
        el.append('circle')
          .attr('r', 22)
          .attr('fill', 'rgba(99,102,241,0.2)')
          .attr('stroke', '#6366F1')
          .attr('stroke-width', 2)
      }
    })

    // Node labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', d => d.data.isLeaf ? '#86EFAC' : '#A5B4FC')
      .attr('font-size', d => {
        const label = d.data.name
        if (label.length > 10) return '8px'
        return '9px'
      })
      .attr('font-weight', '600')
      .attr('font-family', 'Inter, sans-serif')
      .text(d => d.data.name)

    // Edge labels (True/False)
    g.selectAll('.edge-label')
      .data(root.links())
      .enter()
      .append('text')
      .attr('class', 'edge-label')
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94A3B8')
      .attr('font-size', '9px')
      .attr('font-family', 'Inter, sans-serif')
      .text((d, i) => (i % 2 === 0 ? 'Yes' : 'No'))
  }, [treeData, depth])

  return (
    <div className="w-full h-full flex flex-col" style={{ minHeight: '320px' }}>
      <div className="text-xs text-muted mb-2">
        Decision Tree · Depth = <span className="text-accent-light font-bold">{depth}</span> · {Math.pow(2, depth) - 1} internal nodes
      </div>
      <div className="flex-1 overflow-auto rounded-xl" style={{ background: 'rgba(15,23,42,0.5)' }}>
        <svg ref={svgRef} style={{ display: 'block' }} />
      </div>
    </div>
  )
}
