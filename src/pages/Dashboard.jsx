import { motion } from 'motion/react'
import { useHealthStore } from '../store/health.store'
import { pct, bpStatus, sleepQuality, MOOD_MAP, ACTIVITY_LOG } from '../lib/data'
import RingChart from '../components/charts/RingChart'
import SparkLine from '../components/charts/SparkLine'
import BarChart  from '../components/charts/BarChart'

/* ─── Metric card with ring ─────────────────────────────── */
function MetricRing({ label, value, unit, goal, color, sublabel, sparkValues, index }) {
  const p = pct(value, goal)
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * .07 }} className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-lg font-medium mb-0.5" style={{ color: 'var(--tx-3)' }}>{label}</p>
          <p className="font-bold text-4xl leading-none" style={{ color: 'var(--tx)' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
            <span className="text-lg font-normal ml-1" style={{ color: 'var(--tx-3)' }}>{unit}</span>
          </p>
          {sublabel && <p className="text-[16px] mt-1" style={{ color: 'var(--tx-3)' }}>{sublabel}</p>}
        </div>
        <RingChart pct={p} size={56} stroke={6} color={color}
          label={`${p}%`} />
      </div>
      {sparkValues && (
        <div className="mt-2">
          <SparkLine values={sparkValues} color={color} width={200} height={32} />
        </div>
      )}
      <div className="progress-track mt-2">
        <div className="progress-fill" style={{ width: `${p}%`, background: color }} />
      </div>
      <p className="text-[18px] mt-1.5" style={{ color: 'var(--tx-3)' }}>
        目標 {goal?.toLocaleString()} {unit}
      </p>
    </motion.div>
  )
}

/* ─── BP card ───────────────────────────────────────────── */
function BPCard({ sys, dia, hr, index }) {
  const status = bpStatus(sys, dia)
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * .07 }} className="card p-4">
      <p className="text-base font-medium mb-3" style={{ color: 'var(--tx-3)' }}>血壓 / 心率</p>
      <div className="flex items-end gap-1 mb-2">
        <span className="font-bold text-4xl leading-none" style={{ color: 'var(--tx)' }}>{sys}</span>
        <span className="font-bold text-2xl leading-none mb-0.5" style={{ color: 'var(--tx-3)' }}>/ {dia}</span>
        <span className="text-base mb-0.5 ml-1" style={{ color: 'var(--tx-3)' }}>mmHg</span>
      </div>
      <span className="badge text-[16px]" style={{ background: status.bg, color: status.color }}>
        {status.label}
      </span>
      <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid var(--bd)' }}>
        <span className="text-2xl pulse-anim" style={{ color: 'var(--pk)' }}>♥</span>
        <span className="font-bold text-xl" style={{ color: 'var(--tx)' }}>{hr}</span>
        <span className="text-base" style={{ color: 'var(--tx-3)' }}>bpm</span>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const getToday  = useHealthStore(s => s.getToday)
  const getLast7  = useHealthStore(s => s.getLast7)
  const getLast30 = useHealthStore(s => s.getLast30)
  const goals     = useHealthStore(s => s.goals)
  const profile   = useHealthStore(s => s.profile)

  const today  = getToday()
  const last7  = getLast7()
  const last30 = getLast30()

  const now    = new Date()
  const hour   = now.getHours()
  const greeting = hour < 12 ? '早安' : hour < 18 ? '午安' : '晚安'

  const sleepQ = sleepQuality(today.sleep)

  return (
    <div className="page-enter p-4 md:p-6 pb-24 lg:pb-6">

      {/* ── Greeting header ── */}
      <div className="mb-6 hidden lg:block">
        <p className="text-xl" style={{ color: 'var(--tx-3)' }}>
          {now.toLocaleDateString('zh-TW', { year:'numeric', month:'long', day:'numeric', weekday:'long' })}
        </p>
        <h1 className="font-bold text-4xl mt-0.5" style={{ color: 'var(--tx)' }}>
          {greeting}，{profile.name} 👋
        </h1>
      </div>

      {/* ── Hero summary strip ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: '今日步數',   val: today.steps?.toLocaleString(),  color: 'var(--in)', icon: '🚶', sub: `目標 ${goals.steps.toLocaleString()}` },
          { label: '消耗熱量',   val: `${today.calories} kcal`,        color: 'var(--pk)', icon: '🔥', sub: `目標 ${goals.calories} kcal` },
          { label: '飲水量',     val: `${today.water} 杯`,              color: 'var(--tl)', icon: '💧', sub: `目標 ${goals.water} 杯` },
          { label: '昨晚睡眠',  val: `${today.sleep} hr`,              color: sleepQ.color, icon: '😴', sub: sleepQ.label },
        ].map(({ label, val, color, icon, sub }, i) => (
          <motion.div key={label} initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay: i*.06 }}
            className="card p-3 flex items-center gap-3">
            <span className="text-4xl">{icon}</span>
            <div className="min-w-0">
              <p className="text-[18px]" style={{ color: 'var(--tx-3)' }}>{label}</p>
              <p className="font-bold text-2xl leading-tight truncate" style={{ color: 'var(--tx)' }}>{val}</p>
              <p className="text-[18px]" style={{ color }}>{sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        <MetricRing label="今日步數"  value={today.steps}    unit="步"  goal={goals.steps}    color="var(--in)" index={0}
          sparkValues={last7.map(r => r.steps)} />
        <MetricRing label="卡路里"    value={today.calories} unit="kcal" goal={goals.calories} color="var(--pk)" index={1}
          sparkValues={last7.map(r => r.calories)} />
        <MetricRing label="飲水量"    value={today.water}    unit="杯"   goal={goals.water}    color="var(--tl)" index={2}
          sparkValues={last7.map(r => r.water)} sublabel={`= ${today.water * 240} ml`} />
        <MetricRing label="睡眠時數"  value={today.sleep}    unit="hr"   goal={goals.sleep}    color={sleepQ.color} index={3}
          sparkValues={last7.map(r => r.sleep)} sublabel={sleepQ.label} />
        <BPCard sys={today.bpSys} dia={today.bpDia} hr={today.heartRate} index={4} />

        {/* Mood card */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay: .35 }} className="card p-4">
          <p className="text-base font-medium mb-3" style={{ color: 'var(--tx-3)' }}>今日心情</p>
          <div className="flex items-center justify-between">
            {[1,2,3,4,5].map(n => (
              <button key={n}
                className="text-5xl cursor-pointer transition-transform hover:scale-125"
                style={{ opacity: today.mood === n ? 1 : 0.35 }}
                onClick={() => {}}>
                {MOOD_MAP[n]}
              </button>
            ))}
          </div>
          <p className="text-base mt-3" style={{ color: 'var(--tx-3)' }}>
            今日評分：{MOOD_MAP[today.mood]} {['', '很差', '不好', '普通', '不錯', '很好'][today.mood]}
          </p>
        </motion.div>
      </div>

      {/* ── Steps 30-day bar chart ── */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4 }}
        className="card p-4 md:p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-xl" style={{ color: 'var(--tx)' }}>步數趨勢</h2>
            <p className="text-base" style={{ color: 'var(--tx-3)' }}>過去 30 天</p>
          </div>
          <span className="badge text-[16px]" style={{ background: 'var(--in-lt)', color: 'var(--in)' }}>
            均 {Math.round(last30.reduce((s,r) => s + r.steps,0)/last30.length).toLocaleString()} 步
          </span>
        </div>
        <BarChart data={last30} valueKey="steps" color="var(--in)" height={120} goal={goals.steps} />
      </motion.div>

      {/* ── Activity log ── */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.5 }}
        className="card p-4 md:p-5">
        <h2 className="font-semibold text-xl mb-4" style={{ color: 'var(--tx)' }}>今日活動記錄</h2>
        <div className="flex flex-col gap-0">
          {ACTIVITY_LOG.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: i < ACTIVITY_LOG.length-1 ? '1px solid var(--bd)' : 'none' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${item.color}18` }}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium" style={{ color: 'var(--tx)' }}>{item.type}</p>
                <p className="text-base" style={{ color: 'var(--tx-3)' }}>{item.time} · {item.duration}</p>
              </div>
              {item.cal > 0 && (
                <span className="text-base font-semibold flex-shrink-0" style={{ color: item.color }}>
                  -{item.cal} kcal
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
