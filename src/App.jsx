import { useState, useEffect } from 'react'
import EntranceScreen from './screens/EntranceScreen'
import BookCardScreen from './screens/BookCardScreen'
import TableScreen from './screens/TableScreen'
import ReaderScreen from './screens/ReaderScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import ReadLaterScreen from './screens/ReadLaterScreen'
import ProfileScreen from './screens/ProfileScreen'
import SettingsScreen from './screens/SettingsScreen'
import AuthScreen from './screens/AuthScreen'
import { t } from './data/translations'
import { supabase } from './lib/supabase'
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
  const [screen, setScreen] = useState('loading')
  const [user, setUser] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [theme, setTheme] = useState(localStorage.getItem('lux_theme') || 'night')
  const [lang, setLang] = useState(localStorage.getItem('lux_lang') || 'en')

  const tr = THEMES[theme]
  const isRTL = lang === 'ar'

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        setScreen(localStorage.getItem('lux_onboarded') ? 'entrance' : 'onboarding')
      } else {
        setScreen('auth')
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
        setScreen('auth')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

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

  const handleAuth = (user) => {
    if (user) {
      setUser(user)
      setScreen(localStorage.getItem('lux_onboarded') ? 'entrance' : 'onboarding')
    } else {
      // Skipped auth
      setScreen(localStorage.getItem('lux_onboarded') ? 'entrance' : 'onboarding')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setScreen('auth')
  }

  const hideTab = screen === 'reader' || screen === 'onboarding' || screen === 'auth' || screen === 'loading'

  const TABS = [
    { key: 'entrance', icon: '📖', label: t(lang, 'library') },
    { key: 'readlater', icon: '🔖', label: t(lang, 'readLater') },
    { key: 'table', icon: '🪑', label: t(lang, 'myTable') },
    { key: 'profile', icon: '👤', label: t(lang, 'profile') },
  ]

  if (screen === 'loading') {
    return (
      <div style={{
        minHeight: '100vh', background: '#0F0C09',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 32,
          color: '#C9A96E', fontStyle: 'italic'
        }}>LuxLibrary</h1>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto',
      minHeight: '100vh', background: tr.bg,
      position: 'relative', transition: 'background 0.3s',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      {screen === 'auth' && <AuthScreen onAuth={handleAuth} lang={lang} theme={tr} />}
      {screen === 'onboarding' && <OnboardingScreen onFinish={handleOnboardingFinish} lang={lang} changeLang={changeLang} />}
      {screen === 'entrance' && <EntranceScreen navigate={navigate} theme={tr} currentTheme={theme} changeTheme={changeTheme} lang={lang} />}
      {screen === 'bookcard' && <BookCardScreen navigate={navigate} book={selectedBook} theme={tr} lang={lang} />}
      {screen === 'table' && <TableScreen navigate={navigate} theme={tr} lang={lang} />}
      {screen === 'readlater' && <ReadLaterScreen navigate={navigate} theme={tr} lang={lang} />}
      {screen === 'reader' && <ReaderScreen navigate={navigate} book={selectedBook} globalTheme={theme} lang={lang} />}
      {screen === 'profile' && <ProfileScreen navigate={navigate} theme={tr} lang={lang} user={user} onSignOut={handleSignOut} />}
      {screen === 'settings' && <SettingsScreen navigate={navigate} theme={tr} lang={lang} changeLang={changeLang} />}

      {!hideTab && (
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430, display: 'flex',
          backgroundColor: tr.navBg,
          borderTop: '1px solid ' + tr.border,
          paddingTop: 4, paddingBottom: 8, height: 52,
          zIndex: 100, transition: 'background 0.3s',
        }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => navigate(tab.key)} style={{
              flex: 1, background: 'none', border: 'none', cursor: 'pointer',
              color: screen === tab.key ? '#C9A96E' : tr.textMuted,
              fontSize: 8, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 1, fontFamily: 'var(--font-ui)',
              padding: '1px 0'
            }}>
              <span style={{ fontSize: 17 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}