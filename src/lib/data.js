// ─── Helpers ────────────────────────────────────────────────
export const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', weekday: 'short' })

export const fmtDateShort = (iso) =>
  new Date(iso).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })

// ─── Generate past N days of data ───────────────────────────
function pastDays(n) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`)
  }
  return days
}

const rand = (min, max) => Math.round(Math.random() * (max - min) + min)
const seed = (str) => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  return Math.abs(h)
}
const seeded = (str, min, max) => {
  const s = seed(str) % (max - min + 1) + min
  return Math.max(min, Math.min(max, s))
}

export const DAYS_30 = pastDays(30)
export const DAYS_7  = pastDays(7)

// ─── Historical records ──────────────────────────────────────
export const RECORDS = DAYS_30.map(date => ({
  date,
  steps:    seeded(date+'s', 4200, 12000),
  calories: seeded(date+'c', 1600, 2800),
  water:    seeded(date+'w', 3,    10),     // glasses (8oz each)
  sleep:    +(seeded(date+'sl', 55, 85) / 10).toFixed(1), // hours
  bpSys:    seeded(date+'bps', 108, 128),
  bpDia:    seeded(date+'bpd', 68,  82),
  heartRate:seeded(date+'hr', 58, 88),
  weight:   +(seeded(date+'wt', 680, 720) / 10).toFixed(1), // kg
  mood:     seeded(date+'m', 2, 5),
}))

// ─── Today's snapshot ────────────────────────────────────────
export const TODAY = RECORDS[RECORDS.length - 1]

// ─── Goals ──────────────────────────────────────────────────
export const GOALS = {
  steps:    10000,
  calories: 2200,
  water:    8,
  sleep:    8,
  weight:   68.0,
}

export const pct = (val, goal) => Math.min(Math.round((val / goal) * 100), 100)

// ─── Weekly average ──────────────────────────────────────────
export const weekAvg = (key) => {
  const vals = DAYS_7.map(d => RECORDS.find(r => r.date === d)?.[key] || 0)
  return +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
}

// ─── BP status ───────────────────────────────────────────────
export const bpStatus = (sys, dia) => {
  if (sys < 120 && dia < 80)  return { label: '正常', color: 'var(--ok)',   bg: 'var(--ok-lt)' }
  if (sys < 130 && dia < 80)  return { label: '偏高', color: 'var(--warn)', bg: 'var(--warn-lt)' }
  return                              { label: '高血壓', color: 'var(--danger)', bg: 'var(--danger-lt)' }
}

// ─── Sleep quality ───────────────────────────────────────────
export const sleepQuality = (h) => {
  if (h >= 7)  return { label: '優質', color: 'var(--ok)' }
  if (h >= 6)  return { label: '良好', color: 'var(--warn)' }
  return               { label: '不足', color: 'var(--danger)' }
}

// ─── Mood labels ─────────────────────────────────────────────
export const MOOD_MAP = { 1:'😢', 2:'😔', 3:'😐', 4:'🙂', 5:'😄' }

// ─── Activity log ────────────────────────────────────────────
export const ACTIVITY_LOG = [
  { time: '07:30', type: '晨跑',   icon: '🏃', duration: '32 分鐘', cal: 284, color: 'var(--in)' },
  { time: '12:15', type: '午餐',   icon: '🥗', duration: '沙拉套餐',  cal: 480, color: 'var(--ok)' },
  { time: '15:00', type: '飲水',   icon: '💧', duration: '500ml',     cal: 0,   color: 'var(--tl)' },
  { time: '18:30', type: '重訓',   icon: '🏋️', duration: '45 分鐘', cal: 320, color: 'var(--pk)' },
  { time: '22:00', type: '就寢',   icon: '😴', duration: '7.5 hr',    cal: 0,   color: 'var(--in)' },
]

// ─── Trend: last 7 days sparkline ───────────────────────────
export const sparkline = (key, width = 120, height = 40) => {
  const vals = DAYS_7.map(d => RECORDS.find(r => r.date === d)?.[key] || 0)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  const step = width / (vals.length - 1)
  const points = vals.map((v, i) => {
    const x = i * step
    const y = height - ((v - min) / range) * (height - 8) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return points.join(' ')
}
