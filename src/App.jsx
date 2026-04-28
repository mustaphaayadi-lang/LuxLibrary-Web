import { useState } from 'react'
import EntranceScreen from './screens/EntranceScreen'
import BookCardScreen from './screens/BookCardScreen'
import TableScreen from './screens/TableScreen'
import ReaderScreen from './screens/ReaderScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import ReadLaterScreen from './screens/ReadLaterScreen'
import ProfileScreen from './screens/ProfileScreen'
import SettingsScreen from './screens/SettingsScreen'
import { t } from './data/translations'
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
  const [lang, setLang] = useState(
    localStorage.getItem('lux_lang') || 'en'
  )

  const tr = THEMES[theme]
  const isRTL = lang === 'ar'

  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('lux_theme', newTheme)
  }

  const changeLang = (newLang) => {
    setLang(newLang)
    localStorage.setItem('lux_lang', newLang)
  }

  const navigate = (to, params = {}) => {
    if (params.book) setSelectedBook(params.book)
    setScreen(to)
  }

  const handleOnboardingFinish = (prefs) => {
    if (prefs.appLang) changeLang(prefs.appLang)
    setScreen('entrance')
  }

  const hideTab = screen === 'reader' || screen === 'onboarding'

  const TABS = [
    { key: 'entrance', icon: '📖', label: t(lang, 'library') },
    { key: 'readlater', icon: '🔖', label: t(lang, 'readLater') },
    { key: 'table', icon: '🪑', label: t(lang, 'myTable') },
    { key: 'profile', icon: '👤', label: t(lang, 'profile') },
    { key: 'settings', icon: '⚙️', label: t(lang, 'settings') },
  ]

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto',
      minHeight: '100vh', background: tr.bg,
      position: 'relative', transition: 'background 0.3s',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      {screen === 'onboarding' && <OnboardingScreen onFinish={handleOnboardingFinish} lang={lang} changeLang={changeLang} />}
      {screen === 'entrance' && <EntranceScreen navigate={navigate} theme={tr} currentTheme={theme} changeTheme={changeTheme} lang={lang} />}
      {screen === 'bookcard' && <BookCardScreen navigate={navigate} book={selectedBook} theme={tr} lang={lang} />}
      {screen === 'table' && <TableScreen navigate={navigate} theme={tr} lang={lang} />}
      {screen === 'readlater' && <ReadLaterScreen navigate={navigate} theme={tr} lang={lang} />}
      {screen === 'reader' && <ReaderScreen navigate={navigate} book={selectedBook} globalTheme={theme} lang={lang} />}
      {screen === 'profile' && <ProfileScreen navigate={navigate} theme={tr} lang={lang} />}
      {screen === 'settings' && <SettingsScreen navigate={navigate} theme={tr} lang={lang} changeLang={changeLang} />}

      {!hideTab && (
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430, display: 'flex',
          backgroundColor: tr.navBg,
          borderTop: '1px solid ' + tr.border,
          paddingTop: 10, paddingBottom: 28,
          zIndex: 100, transition: 'background 0.3s',
        }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => navigate(tab.key)} style={{
              flex: 1, background: 'none', border: 'none', cursor: 'pointer',
              color: screen === tab.key ? '#C9A96E' : tr.textMuted,
              fontSize: 10, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, fontFamily: 'var(--font-ui)',
              padding: '4px 0'
            }}>
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}