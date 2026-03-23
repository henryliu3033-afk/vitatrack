import { useState } from 'react'
import { motion } from 'motion/react'
import { useHealthStore } from '../store/health.store'
import { MOOD_MAP } from '../lib/data'

function Section({ title, children }) {
  return (
    <div className="card p-4 md:p-5">
      <h2 className="font-semibold text-lg mb-4" style={{ color: 'var(--tx)' }}>{title}</h2>
      {children}
    </div>
  )
}

function LabelRow({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-base font-medium" style={{ color: 'var(--tx-2)' }}>{label}</label>
        {hint && <span className="text-[16px]" style={{ color: 'var(--tx-3)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export default function Log() {
  const getToday  = useHealthStore(s => s.getToday)
  const logToday  = useHealthStore(s => s.logToday)
  const existing  = getToday()

  const [form, setForm] = useState({
    steps:     existing?.steps     || '',
    calories:  existing?.calories  || '',
    water:     existing?.water     || 0,
    sleep:     existing?.sleep     || 7,
    bpSys:     existing?.bpSys     || '',
    bpDia:     existing?.bpDia     || '',
    heartRate: existing?.heartRate || '',
    weight:    existing?.weight    || '',
    mood:      existing?.mood      || 3,
    note:      existing?.note      || '',
  })
  const [saved, setSaved] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = e => {
    e.preventDefault()
    logToday({
      steps:     Number(form.steps)     || 0,
      calories:  Number(form.calories)  || 0,
      water:     Number(form.water)     || 0,
      sleep:     Number(form.sleep)     || 0,
      bpSys:     Number(form.bpSys)     || 0,
      bpDia:     Number(form.bpDia)     || 0,
      heartRate: Number(form.heartRate) || 0,
      weight:    Number(form.weight)    || 0,
      mood:      Number(form.mood)      || 3,
      note:      form.note,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="page-enter p-4 md:p-6 pb-24 lg:pb-6">
      <div className="hidden lg:block mb-6">
        <h1 className="font-bold text-4xl" style={{ color: 'var(--tx)' }}>健康記錄</h1>
        <p className="text-lg mt-1" style={{ color: 'var(--tx-3)' }}>記錄今日健康數據</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">

          {/* Activity */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.05 }}>
            <Section title="🏃 活動量">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LabelRow label="今日步數" hint={`目標 10,000 步`}>
                  <input type="number" placeholder="e.g. 8500" className="input"
                    value={form.steps} onChange={e => set('steps', e.target.value)} />
                </LabelRow>
                <LabelRow label="消耗熱量 (kcal)" hint="包含基礎代謝">
                  <input type="number" placeholder="e.g. 2000" className="input"
                    value={form.calories} onChange={e => set('calories', e.target.value)} />
                </LabelRow>
              </div>
            </Section>
          </motion.div>

          {/* Water */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}>
            <Section title="💧 飲水量">
              <LabelRow label={`今日飲水：${form.water} 杯（約 ${form.water * 240} ml）`}>
                <input type="range" min="0" max="12" step="1"
                  value={form.water} onChange={e => set('water', Number(e.target.value))}
                  style={{ accentColor: 'var(--tl)' }} />
                <div className="flex justify-between text-[16px]" style={{ color: 'var(--tx-3)' }}>
                  {Array.from({ length: 13 }, (_, i) => (
                    <span key={i} style={{ color: i <= form.water ? 'var(--tl)' : 'var(--tx-3)' }}>
                      {i === 0 || i === 4 || i === 8 || i === 12 ? i : '·'}
                    </span>
                  ))}
                </div>
              </LabelRow>
              <div className="flex flex-wrap gap-2 mt-3">
                {[1,2,3,4].map(n => (
                  <button key={n} type="button" onClick={() => set('water', Math.min(12, Number(form.water) + n))}
                    className="text-lg px-3 py-1.5 rounded-[var(--r)] border cursor-pointer transition-all"
                    style={{ borderColor: 'var(--tl)', color: 'var(--tl)', background: 'var(--tl-lt)' }}
                    onMouseEnter={e => { e.currentTarget.style.background='var(--tl)'; e.currentTarget.style.color='white' }}
                    onMouseLeave={e => { e.currentTarget.style.background='var(--tl-lt)'; e.currentTarget.style.color='var(--tl)' }}>
                    +{n} 杯
                  </button>
                ))}
              </div>
            </Section>
          </motion.div>

          {/* Sleep */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}>
            <Section title="😴 睡眠">
              <LabelRow label={`昨晚睡了 ${form.sleep} 小時`}>
                <input type="range" min="3" max="12" step="0.5"
                  value={form.sleep} onChange={e => set('sleep', Number(e.target.value))} />
                <div className="flex justify-between text-[16px] mt-1" style={{ color: 'var(--tx-3)' }}>
                  <span>3h</span><span>6h</span><span>8h</span><span>12h</span>
                </div>
              </LabelRow>
            </Section>
          </motion.div>

          {/* Vitals */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}>
            <Section title="❤️ 生理指標">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <LabelRow label="收縮壓" hint="mmHg">
                  <input type="number" placeholder="120" className="input"
                    value={form.bpSys} onChange={e => set('bpSys', e.target.value)} />
                </LabelRow>
                <LabelRow label="舒張壓" hint="mmHg">
                  <input type="number" placeholder="80" className="input"
                    value={form.bpDia} onChange={e => set('bpDia', e.target.value)} />
                </LabelRow>
                <LabelRow label="心率" hint="bpm">
                  <input type="number" placeholder="72" className="input"
                    value={form.heartRate} onChange={e => set('heartRate', e.target.value)} />
                </LabelRow>
                <LabelRow label="體重" hint="kg">
                  <input type="number" placeholder="68.5" step="0.1" className="input"
                    value={form.weight} onChange={e => set('weight', e.target.value)} />
                </LabelRow>
              </div>
            </Section>
          </motion.div>

          {/* Mood */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25 }}>
            <Section title="😊 今日心情">
              <div className="flex items-center justify-between px-4">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => set('mood', n)}
                    className="text-5xl md:text-5xl cursor-pointer transition-all"
                    style={{ opacity: form.mood === n ? 1 : 0.3, transform: form.mood === n ? 'scale(1.2)' : 'scale(1)' }}>
                    {MOOD_MAP[n]}
                  </button>
                ))}
              </div>
              <p className="text-center text-base mt-3" style={{ color: 'var(--tx-3)' }}>
                {['', '很差', '不好', '普通', '不錯', '很好'][form.mood]}
              </p>
            </Section>
          </motion.div>

          {/* Note */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}>
            <Section title="📝 日記備注">
              <textarea rows="3" placeholder="今天的感受、飲食內容、特別事項…"
                className="input resize-none"
                value={form.note} onChange={e => set('note', e.target.value)} />
            </Section>
          </motion.div>

          {/* Submit */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.35 }}>
            <button type="submit"
              className="w-full py-3.5 rounded-[var(--r-lg)] font-semibold text-lg text-white cursor-pointer transition-all"
              style={{
                background: saved
                  ? 'linear-gradient(135deg, var(--ok), #34D399)'
                  : 'linear-gradient(135deg, var(--in), var(--pk))',
                boxShadow: saved ? '0 4px 16px rgba(16,185,129,.3)' : '0 4px 16px rgba(99,102,241,.3)',
              }}>
              {saved ? '✓ 已儲存！' : '儲存今日記錄'}
            </button>
          </motion.div>
        </div>
      </form>
    </div>
  )
}
