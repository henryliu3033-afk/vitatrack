import { BrowserRouter, Routes, Route } from 'react-router'
import Sidebar   from './components/layout/Sidebar'
import BottomTab from './components/layout/BottomTab'
import TopBar    from './components/layout/TopBar'
import Dashboard from './pages/Dashboard'
import Log       from './pages/Log'
import Reports   from './pages/Reports'
import Profile   from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      {/* Root layout: sidebar (desktop) + main area */}
      <div style={{ display: 'flex', height: '100svh', overflow: 'hidden', background: 'var(--bg)' }}>

        {/* Left sidebar — hidden on mobile via CSS */}
        <Sidebar />

        {/* Right: top bar + scrollable content + bottom tab */}
        <div className="main-area flex flex-col">
          <TopBar />

          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/"        element={<Dashboard />} />
              <Route path="/log"     element={<Log />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*"        element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* Bottom tab bar — visible on mobile only via CSS */}
      <BottomTab />
    </BrowserRouter>
  )
}
