export default function RingChart({ pct = 0, size = 80, stroke = 8, color = 'var(--in)', label, sublabel }) {
  const r   = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (Math.min(pct, 100) / 100) * circ

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-2)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash.toFixed(2)} ${circ.toFixed(2)}`}
          strokeLinecap="round" style={{ transition: 'stroke-dasharray .8s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="font-bold" style={{ fontSize: size / 4.5, color: 'var(--tx)' }}>{label}</span>
          {sublabel && <span className="mt-0.5" style={{ fontSize: size / 7.5, color: 'var(--tx-3)' }}>{sublabel}</span>}
        </div>
      )}
    </div>
  )
}
