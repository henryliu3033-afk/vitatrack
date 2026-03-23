import { useState } from 'react'
import { motion } from 'motion/react'
import { useHealthStore } from '../store/health.store'
import { fmtDate, bpStatus, sleepQuality } from '../lib/data'
import BarChart  from '../components/charts/BarChart'
import SparkLine from '../components/charts/SparkLine'

const TABS = ['步數', '睡眠', '血壓', '體重']

function StatCard({ label, value, unit, trend, color, index }) {
  const up = trend >= 0
  return (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
      transition={{ delay: index * .06 }}
      className="card p-4">
      <p className="text-base mb-1" style={{ color: 'var(--tx-3)' }}>{label}</p>
      <p className="font-bold text-3xl leading-none" style={{ color: 'var(--tx)' }}>
        {value}<span className="text-base font-normal ml-1" style={{ color: 'var(--tx-3)' }}>{unit}</span>
      </p>
      <p className="text-base mt-1.5 font-medium" style={{ color: up ? 'var(--ok)' : 'var(--danger)' }}>
        {up ? '↑' : '↓'} {Math.abs(trend)}% 較上週
      </p>
    </motion.div>
  )
}

export default function Reports() {
  const [tab,  setTab]  = useState('步數')
  const [range, setRange] = useState(7)

  const getLast7  = useHealthStore(s => s.getLast7)
  const getLast30 = useHealthStore(s => s.getLast30)
  const goals     = useHealthStore(s => s.goals)

  const last7  = getLast7()
  const last30 = getLast30()
  const data   = range === 7 ? last7 : last30

  const avg = (key) => +(data.reduce((s,r) => s + (r[key]||0), 0) / data.length).toFixed(1)

  // Compute simple weekly trend
  const trend = (key) => {
    if (last7.length < 2) return 0
    const thisW = last7.slice(-3).reduce((s,r) => s+(r[key]||0),0)/3
    const prevW = last7.slice(0,3).reduce((s,r) => s+(r[key]||0),0)/3
    if (!prevW) return 0
    return +((thisW - prevW) / prevW * 100).toFixed(1)
  }

  const CHART_CONFIG = {
    '步數': { key:'steps',    color:'var(--in)', unit:'步',   goal: goals.steps   },
    '睡眠': { key:'sleep',    color:'var(--tl)', unit:'hr',   goal: goals.sleep   },
    '血壓': { key:'bpSys',   color:'var(--pk)', unit:'mmHg', goal: 120            },
    '體重': { key:'weight',   color:'var(--ok)', unit:'kg',   goal: goals.weight  },
  }
  const { key, color, unit, goal } = CHART_CONFIG[tab]

  return (
    <div className="page-enter p-4 md:p-6 pb-24 lg:pb-6">
      <div className="hidden lg:block mb-6">
        <h1 className="font-bold text-4xl" style={{ color: 'var(--tx)' }}>數據報告</h1>
        <p className="text-lg mt-1" style={{ color: 'var(--tx-3)' }}>分析您的健康趨勢</p>
      </div>

      {/* Summary stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="平均步數"  value={avg('steps').toLocaleString()}  unit="步"  trend={trend('steps')}    color="var(--in)" index={0} />
        <StatCard label="平均睡眠"  value={avg('sleep')}   unit="hr"  trend={trend('sleep')}    color="var(--tl)" index={1} />
        <StatCard label="平均心率"  value={avg('heartRate')} unit="bpm" trend={trend('heartRate')} color="var(--pk)" index={2} />
        <StatCard label="體重趨勢"  value={avg('weight')}  unit="kg"  trend={trend('weight')}   color="var(--ok)" index={3} />
      </div>

      {/* Main chart card */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
        className="card p-4 md:p-5 mb-4">

        {/* Chart tabs + range toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex gap-1 p-1 rounded-[var(--r-lg)]" style={{ background: 'var(--bg-2)' }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-3 py-1.5 text-base font-semibold rounded-[var(--r)] transition-all cursor-pointer"
                style={{
                  background: tab === t ? 'var(--white)' : 'transparent',
                  color:      tab === t ? 'var(--in)' : 'var(--tx-3)',
                  boxShadow:  tab === t ? 'var(--shadow)' : 'none',
                }}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex gap-1 p-1 rounded-[var(--r-lg)]" style={{ background: 'var(--bg-2)' }}>
            {[7, 30].map(r => (
              <button key={r} onClick={() => setRange(r)}
                className="px-3 py-1.5 text-base font-semibold rounded-[var(--r)] transition-all cursor-pointer"
                style={{
                  background: range === r ? 'var(--white)' : 'transparent',
                  color:      range === r ? 'var(--in)'    : 'var(--tx-3)',
                  boxShadow:  range === r ? 'var(--shadow)' : 'none',
                }}>
                {r === 7 ? '7天' : '30天'}
              </button>
            ))}
          </div>
        </div>

        {/* Average badge */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-bold text-4xl" style={{ color: 'var(--tx)' }}>{avg(key)}</span>
            <span className="text-lg ml-1" style={{ color: 'var(--tx-3)' }}>{unit}</span>
            <p className="text-base mt-0.5" style={{ color: 'var(--tx-3)' }}>{range} 天平均</p>
          </div>
          <span className="badge text-[16px] px-3 py-1"
            style={{ background: `${color}18`, color }}>
            目標 {goal} {unit}
          </span>
        </div>

        <BarChart data={data} valueKey={key} color={color} height={150} goal={goal} />
      </motion.div>

      {/* BP & Sleep detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Blood pressure table */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
          className="card p-4 md:p-5">
          <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--tx)' }}>血壓記錄</h3>
          <div className="flex flex-col gap-0">
            {last7.slice().reverse().map((r, i) => {
              const st = bpStatus(r.bpSys, r.bpDia)
              return (
                <div key={r.date} className="flex items-center gap-3 py-2.5"
                  style={{ borderBottom: i < last7.length-1 ? '1px solid var(--bd)' : 'none' }}>
                  <span className="text-base flex-shrink-0 w-20" style={{ color: 'var(--tx-3)' }}>
                    {fmtDate(r.date).slice(0,6)}
                  </span>
                  <span className="font-semibold text-lg flex-1" style={{ color: 'var(--tx)' }}>
                    {r.bpSys}/{r.bpDia}
                  </span>
                  <span className="badge text-[14px] px-2 py-0.5" style={{ background: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Sleep quality */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.35 }}
          className="card p-4 md:p-5">
          <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--tx)' }}>睡眠品質</h3>
          <div className="mb-4">
            <SparkLine values={last7.map(r => r.sleep)} color="var(--tl)" width={280} height={60} />
          </div>
          <div className="flex flex-col gap-0">
            {last7.slice().reverse().map((r, i) => {
              const q = sleepQuality(r.sleep)
              return (
                <div key={r.date} className="flex items-center gap-3 py-2.5"
                  style={{ borderBottom: i < last7.length-1 ? '1px solid var(--bd)' : 'none' }}>
                  <span className="text-base flex-shrink-0 w-20" style={{ color: 'var(--tx-3)' }}>
                    {fmtDate(r.date).slice(0,6)}
                  </span>
                  <div className="flex-1 progress-track">
                    <div className="progress-fill" style={{ width: `${Math.min((r.sleep/10)*100,100)}%`, background: q.color }} />
                  </div>
                  <span className="text-base font-semibold flex-shrink-0 w-10 text-right" style={{ color: q.color }}>
                    {r.sleep}h
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
