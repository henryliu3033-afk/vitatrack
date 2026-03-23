export default function SparkLine({ values = [], color = 'var(--in)', width = 120, height = 40, fill = true }) {
  if (!values.length) return null
  const min   = Math.min(...values)
  const max   = Math.max(...values)
  const range = max - min || 1
  const step  = width / Math.max(values.length - 1, 1)
  const pts   = values.map((v, i) => {
    const x = i * step
    const y = height - ((v - min) / range) * (height - 8) - 2
    return [x, y]
  })
  const line  = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area  = `0,${height} ${line} ${width},${height}`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      {fill && (
        <polygon points={area} fill={color} fillOpacity="0.12" />
      )}
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* Last point dot */}
      {pts.length > 0 && (
        <circle cx={pts.at(-1)[0]} cy={pts.at(-1)[1]} r="3" fill={color} />
      )}
    </svg>
  )
}
