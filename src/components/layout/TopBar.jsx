import { useLocation } from 'react-router'
import { useHealthStore } from '../../store/health.store'

const TITLES = { '/': '今日總覽', '/log': '健康記錄', '/reports': '數據報告', '/profile': '個人設定' }

export default function TopBar() {
  const { pathname } = useLocation()
  const profile = useHealthStore(s => s.profile)
  const title   = TITLES[pathname] || '健康管理'

  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40"
      style={{ background: 'rgba(250,250,254,.96)', borderBottom: '1px solid var(--bd)', backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-base font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--in), var(--pk))' }}>V</div>
        <h1 className="font-bold text-lg" style={{ color: 'var(--tx)' }}>{title}</h1>
      </div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, var(--in), var(--pk))' }}>
        {profile.name?.[0] || 'V'}
      </div>
    </header>
  )
}
