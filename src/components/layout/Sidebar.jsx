import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useHealthStore } from '../../store/health.store'

const NAV = [
  { to: '/',        icon: HomeIcon,     label: '總覽' },
  { to: '/log',     icon: LogIcon,      label: '記錄' },
  { to: '/reports', icon: ReportIcon,   label: '報告' },
  { to: '/profile', icon: ProfileIcon,  label: '設定' },
]

function HomeIcon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }
function LogIcon()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
function ReportIcon()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function ProfileIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function CollapseIcon({ collapsed }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }}>
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location  = useLocation()
  const profile   = useHealthStore(s => s.profile)

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="flex flex-col h-full py-4">

        {/* Logo + collapse button */}
        <div className="flex items-center justify-between px-4 mb-6">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-base font-bold"
                style={{ background: 'linear-gradient(135deg, var(--in), var(--pk))' }}>V</div>
              <span className="font-bold text-2xl" style={{ color: 'var(--tx)' }}>VitaTrack</span>
            </div>
          )}
          {collapsed && (
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-base font-bold mx-auto"
              style={{ background: 'linear-gradient(135deg, var(--in), var(--pk))' }}>V</div>
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)}
              className="w-6 h-6 flex items-center justify-center rounded cursor-pointer transition-colors"
              style={{ color: 'var(--tx-3)' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--in)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--tx-3)'}>
              <CollapseIcon collapsed={false} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 flex-1">
          {NAV.map(({ to, icon: Icon, label }) => {
            const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
            return (
              <Link key={to} to={to}
                className={`nav-link tooltip ${active ? 'active' : ''}`}
                data-tip={collapsed ? label : undefined}
                style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
                <span className="icon"><Icon /></span>
                {!collapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User avatar + expand button */}
        <div className="px-3 mt-4 flex flex-col gap-2">
          {collapsed && (
            <button onClick={() => setCollapsed(false)}
              className="w-full flex items-center justify-center py-2 rounded-[var(--r)] transition-colors cursor-pointer"
              style={{ color: 'var(--tx-3)', background: 'var(--bg)' }}
              onMouseEnter={e => e.currentTarget.style.background='var(--in-lt)'}
              onMouseLeave={e => e.currentTarget.style.background='var(--bg)'}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          )}
          <div className={`flex items-center gap-3 p-2 rounded-[var(--r)] ${collapsed ? 'justify-center' : ''}`}
            style={{ background: 'var(--bg)' }}>
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-base font-bold"
              style={{ background: 'linear-gradient(135deg, var(--in), var(--pk))' }}>
              {profile.name?.[0] || 'V'}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-lg font-semibold truncate" style={{ color: 'var(--tx)' }}>{profile.name}</p>
                <p className="text-base" style={{ color: 'var(--tx-3)' }}>{profile.age} 歲</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
