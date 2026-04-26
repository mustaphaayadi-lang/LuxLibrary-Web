import { useState } from 'react'
import EntranceScreen from './screens/EntranceScreen'
import BookCardScreen from './screens/BookCardScreen'
import TableScreen from './screens/TableScreen'
import ReaderScreen from './screens/ReaderScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import './index.css'

export const THEMES = {
  night: {
    bg: '#0F0C09',
    bgCard: 'rgba(255,235,200,0.04)',
    border: 'rgba(255,235,200,0.08)',
    text: '#EDE8DF',
    textSecondary: 'rgba(237,232,223,0.5)',
    textMuted: 'rgba(237,232,223,0.3)',
    navBg: '#0F0C09',
  },
  paper: {
    bg: '#F5F0E8',
    bgCard: 'rgba(44,36,22,0.05)',
    border: 'rgba(44,36,22,0.1)',
    text: '#2C2416',
    textSecondary: 'rgba(44,36,22,0.6)',
    textMuted: 'rgba(44,36,22,0.35)',
    navBg: '#F5F0E8',
  },
  day: {
    bg: '#FFFFFF',
    bgCard: 'rgba(0,0,0,0.03)',
    border: 'rgba(0,0,0,0.08)',
    text: '#1A1A1A',
    textSecondary: 'rgba(26,26,26,0.55)',
    textMuted: 'rgba(26,26,26,0.35)',
    navBg: '#FFFFFF',
  },
}

export default function App() {
  const [screen, setScreen] = useState(
    localStorage.getItem('lux_onboarded') ? 'entrance' : 'onboarding'
  )
  const [selectedBook, setSelectedBook] = useState(null)
  const [theme, setTheme] = useState(
    localStorage.getItem('lux_theme') || 'night'
  )

  const t = THEMES[theme]

  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('lux_theme', newTheme)
  }

  const navigate = (to, params = {}) => {
    if (params.book) setSelectedBook(params.book)
    setScreen(to)
  }

  const handleOnboardingFinish = () => setScreen('entrance')
  const hideTab = screen === 'reader' || screen === 'onboarding'

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto',
      minHeight: '100vh',
      background: t.bg,
      position: 'relative',
      transition: 'background 0.3s'
    }}>
      {screen === 'onboarding' && <OnboardingScreen onFinish={handleOnboardingFinish} />}
      {screen === 'entrance' && <EntranceScreen navigate={navigate} theme={t} currentTheme={theme} changeTheme={changeTheme} />}
      {screen === 'bookcard' && <BookCardScreen navigate={navigate} book={selectedBook} theme={t} />}
      {screen === 'table' && <TableScreen navigate={navigate} theme={t} />}
      {screen === 'reader' && <ReaderScreen navigate={navigate} book={selectedBook} globalTheme={theme} />}

      {!hideTab && (
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430, display: 'flex',
          backgroundColor: t.navBg,
          borderTop: `1px solid ${t.border}`,
          padding: '10px 0 24px', zIndex: 100,
          transition: 'background 0.3s'
        }}>
          <button onClick={() => navigate('entrance')} style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            color: screen === 'entrance' ? '#C9A96E' : t.textMuted,
            fontSize: 11, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4, fontFamily: 'var(--font-ui)'
          }}>
            <span style={{ fontSize: 20 }}>📖</span>Library
          </button>
          <button onClick={() => navigate('table')} style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            color: screen === 'table' ? '#C9A96E' : t.textMuted,
            fontSize: 11, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4, fontFamily: 'var(--font-ui)'
          }}>
            <span style={{ fontSize: 20 }}>🪑</span>My Table
          </button>
        </div>
      )}
    </div>
  )
}