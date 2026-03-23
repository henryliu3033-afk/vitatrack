import { fmtDateShort } from '../../lib/data'

export default function BarChart({ data = [], valueKey, color = 'var(--in)', height = 140, goal }) {
  if (!data.length) return null

  const values = data.map(d => d[valueKey] || 0)
  const maxVal  = Math.max(...values, goal || 0) * 1.1 || 1
  const barW    = 100 / data.length

  return (
    <div style={{ width: '100%', height }}>
      <svg width="100%" height="100%" viewBox={`0 0 100 100`} preserveAspectRatio="none">
        {/* Goal line */}
        {goal && (
          <line x1="0" y1={100 - (goal / maxVal) * 90 - 2} x2="100" y2={100 - (goal / maxVal) * 90 - 2}
            stroke={color} strokeWidth="0.5" strokeDasharray="2,2" strokeOpacity="0.5" />
        )}
        {data.map((d, i) => {
          const h   = ((d[valueKey] || 0) / maxVal) * 90
          const x   = i * barW + barW * 0.15
          const w   = barW * 0.7
          const y   = 100 - h - 2
          const met = goal ? d[valueKey] >= goal : true
          return (
            <rect key={d.date} x={x} y={y} width={w} height={h}
              rx="1" fill={met ? color : `${color}60`}
              style={{ transition: 'all .3s' }}>
              <title>{fmtDateShort(d.date)}: {d[valueKey]?.toLocaleString()}</title>
            </rect>
          )
        })}
      </svg>
      {/* X labels */}
      <div className="flex" style={{ marginTop: '4px' }}>
        {data.map((d, i) => (
          <div key={d.date} className="text-center" style={{ flex: 1, fontSize: '9px', color: 'var(--tx-3)' }}>
            {i % 2 === 0 ? fmtDateShort(d.date).slice(-3) : ''}
          </div>
        ))}
      </div>
    </div>
  )
}
