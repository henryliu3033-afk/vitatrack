import { useState } from 'react'
import { motion } from 'motion/react'
import { useHealthStore } from '../store/health.store'

function Section({ title, children }) {
  return (
    <div className="card p-4 md:p-5">
      <h2 className="font-semibold text-lg mb-4" style={{ color: 'var(--tx)' }}>{title}</h2>
      {children}
    </div>
  )
}

export default function Profile() {
  const profile      = useHealthStore(s => s.profile)
  const goals        = useHealthStore(s => s.goals)
  const updateProfile = useHealthStore(s => s.updateProfile)
  const updateGoals   = useHealthStore(s => s.updateGoals)

  const [pForm, setPForm] = useState({ ...profile })
  const [gForm, setGForm] = useState({ ...goals })
  const [pSaved, setPSaved] = useState(false)
  const [gSaved, setGSaved] = useState(false)

  const saveProfile = e => {
    e.preventDefault()
    updateProfile(pForm)
    setPSaved(true)
    setTimeout(() => setPSaved(false), 2000)
  }

  const saveGoals = e => {
    e.preventDefault()
    updateGoals({ ...gForm, steps: Number(gForm.steps), calories: Number(gForm.calories), water: Number(gForm.water), sleep: Number(gForm.sleep), weight: Number(gForm.weight) })
    setGSaved(true)
    setTimeout(() => setGSaved(false), 2000)
  }

  const BMI = +(pForm.weight_ref / ((pForm.height / 100) ** 2)).toFixed(1) || null

  return (
    <div className="page-enter p-4 md:p-6 pb-24 lg:pb-6">
      <div className="hidden lg:block mb-6">
        <h1 className="font-bold text-4xl" style={{ color: 'var(--tx)' }}>個人設定</h1>
        <p className="text-lg mt-1" style={{ color: 'var(--tx-3)' }}>管理您的個人資料與健康目標</p>
      </div>

      <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">

        {/* Profile form */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.05 }}>
          <Section title="👤 個人資料">
            <form onSubmit={saveProfile} className="flex flex-col gap-4">
              {/* Avatar placeholder */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--in), var(--pk))' }}>
                  {pForm.name?.[0] || 'V'}
                </div>
                <div>
                  <p className="font-semibold text-lg" style={{ color: 'var(--tx)' }}>{pForm.name}</p>
                  <p className="text-base" style={{ color: 'var(--tx-3)' }}>
                    {pForm.age} 歲 · {pForm.height} cm · {pForm.gender === 'male' ? '男' : '女'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-base font-medium block mb-1.5" style={{ color: 'var(--tx-2)' }}>姓名</label>
                  <input className="input" value={pForm.name} onChange={e => setPForm(p=>({...p,name:e.target.value}))} />
                </div>
                <div>
                  <label className="text-base font-medium block mb-1.5" style={{ color: 'var(--tx-2)' }}>年齡</label>
                  <input type="number" className="input" value={pForm.age} onChange={e => setPForm(p=>({...p,age:Number(e.target.value)}))} />
                </div>
                <div>
                  <label className="text-base font-medium block mb-1.5" style={{ color: 'var(--tx-2)' }}>身高 (cm)</label>
                  <input type="number" className="input" value={pForm.height} onChange={e => setPForm(p=>({...p,height:Number(e.target.value)}))} />
                </div>
                <div>
                  <label className="text-base font-medium block mb-1.5" style={{ color: 'var(--tx-2)' }}>性別</label>
                  <select className="input cursor-pointer" value={pForm.gender} onChange={e => setPForm(p=>({...p,gender:e.target.value}))}>
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>
              </div>
              <button type="submit"
                className="py-3 rounded-[var(--r-lg)] font-semibold text-lg text-white cursor-pointer transition-all"
                style={{ background: pSaved ? 'linear-gradient(135deg,var(--ok),#34D399)' : 'linear-gradient(135deg,var(--in),#818CF8)', boxShadow: '0 4px 16px rgba(99,102,241,.25)' }}>
                {pSaved ? '✓ 已儲存' : '儲存個人資料'}
              </button>
            </form>
          </Section>
        </motion.div>

        {/* Goals form */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}>
          <Section title="🎯 健康目標">
            <form onSubmit={saveGoals} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key:'steps',    label:'每日步數目標',   unit:'步',  type:'number' },
                  { key:'calories', label:'每日熱量目標',   unit:'kcal',type:'number' },
                  { key:'water',    label:'每日飲水目標',   unit:'杯',  type:'number' },
                  { key:'sleep',    label:'每日睡眠目標',   unit:'小時',type:'number' },
                  { key:'weight',   label:'目標體重',       unit:'kg',  type:'number', step:'0.1' },
                ].map(({ key, label, unit, type, step }) => (
                  <div key={key}>
                    <label className="text-base font-medium block mb-1.5" style={{ color: 'var(--tx-2)' }}>
                      {label} <span style={{ color: 'var(--tx-3)' }}>({unit})</span>
                    </label>
                    <input type={type} step={step} className="input"
                      value={gForm[key]} onChange={e => setGForm(p => ({...p,[key]:e.target.value}))} />
                  </div>
                ))}
              </div>
              <button type="submit"
                className="py-3 rounded-[var(--r-lg)] font-semibold text-lg text-white cursor-pointer transition-all"
                style={{ background: gSaved ? 'linear-gradient(135deg,var(--ok),#34D399)' : 'linear-gradient(135deg,var(--pk),var(--in))', boxShadow: '0 4px 16px rgba(236,72,153,.25)' }}>
                {gSaved ? '✓ 已儲存' : '儲存健康目標'}
              </button>
            </form>
          </Section>
        </motion.div>

        {/* App info */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}>
          <Section title="ℹ️ 關於 VitaTrack">
            <div className="flex flex-col gap-3">
              {[
                ['版本', 'v1.0.0'],
                ['資料儲存', 'Local Storage（本機）'],
                ['數據來源', '用戶自行記錄'],
                ['隱私政策', '所有數據僅存於您的裝置'],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--bd)' }}>
                  <span className="text-base" style={{ color: 'var(--tx-3)' }}>{k}</span>
                  <span className="text-base font-medium" style={{ color: 'var(--tx)' }}>{v}</span>
                </div>
              ))}
            </div>
          </Section>
        </motion.div>

      </div>
    </div>
  )
}
