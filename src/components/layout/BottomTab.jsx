import { Link, useLocation } from 'react-router'

const TABS = [
  { to: '/',        label: '總覽',  icon: HomeIcon },
  { to: '/log',     label: '記錄',  icon: LogIcon },
  { to: '/reports', label: '報告',  icon: ReportIcon },
  { to: '/profile', label: '我的',  icon: ProfileIcon },
]

function HomeIcon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }
function LogIcon()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
function ReportIcon()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function ProfileIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }

export default function BottomTab() {
  const { pathname } = useLocation()
  return (
    <nav className="bottom-tab">
      {TABS.map(({ to, label, icon: Icon }) => {
        const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
        return (
          <Link key={to} to={to}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-1 cursor-pointer transition-all"
            style={{ color: active ? 'var(--in)' : 'var(--tx-3)', textDecoration: 'none' }}>
            <div className={`w-6 h-6 transition-transform ${active ? 'scale-110' : ''}`}>
              <Icon />
            </div>
            <span className="text-[16px] font-medium">{label}</span>
            {active && (
              <span className="absolute top-1.5 w-1 h-1 rounded-full" style={{ background: 'var(--in)' }} />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
