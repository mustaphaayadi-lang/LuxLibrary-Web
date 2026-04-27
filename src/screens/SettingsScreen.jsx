import { useState } from 'react'
import { t } from '../data/translations'

const APP_LANGUAGES = [
  { value: 'en', emoji: '🇬🇧', label: 'English' },
  { value: 'fr', emoji: '🇫🇷', label: 'Français' },
  { value: 'ar', emoji: '🇸🇦', label: 'العربية' },
]

export default function SettingsScreen({ navigate, theme, lang, changeLang }) {
  const isRTL = lang === 'ar'
  const [requestText, setRequestText] = useState('')
  const [requestSent, setRequestSent] = useState(false)

  const handleClearHistory = () => {
    if (confirm(t(lang, 'clearHistoryConfirm'))) {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('book_'))
      keys.forEach(k => localStorage.removeItem(k))
      localStorage.removeItem('lux_read_later')
      alert(lang === 'ar' ? 'تم المسح' : lang === 'fr' ? 'Effacé !' : 'Cleared!')
    }
  }

  const handleSendRequest = () => {
    if (!requestText.trim()) return
    setRequestSent(true)
    setRequestText('')
    setTimeout(() => setRequestSent(false), 3000)
  }

  return (
    <div style={{
      minHeight: '100vh', background: theme.bg,
      paddingBottom: 120, direction: isRTL ? 'rtl' : 'ltr'
    }}>

      {/* Header */}
      <div style={{ padding: '56px 24px 32px' }}>
        <p style={{
          fontSize: 10, color: '#C9A96E', letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 10,
          fontFamily: 'var(--font-ui)'
        }}>LuxLibrary</p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 32,
          color: theme.text, fontStyle: 'italic', margin: 0
        }}>{t(lang, 'settingsTitle')}</h1>
      </div>

      {/* App Language */}
      <div style={{ padding: '0 24px', marginBottom: 32 }}>
        <p style={{
          fontSize: 11, color: '#C9A96E', letterSpacing: 2,
          textTransform: 'uppercase', fontFamily: 'var(--font-ui)', marginBottom: 16
        }}>{t(lang, 'appLanguage')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {APP_LANGUAGES.map(l => (
            <button key={l.value} onClick={() => changeLang(l.value)} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px', borderRadius: 14,
              background: lang === l.value ? 'rgba(201,169,110,0.12)' : theme.bgCard,
              border: `1px solid ${lang === l.value ? '#C9A96E' : theme.border}`,
              cursor: 'pointer', textAlign: isRTL ? 'right' : 'left'
            }}>
              <span style={{ fontSize: 22 }}>{l.emoji}</span>
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: 15,
                color: lang === l.value ? '#C9A96E' : theme.text,
                fontWeight: lang === l.value ? 600 : 400, flex: 1
              }}>{l.label}</span>
              {lang === l.value && <span style={{ color: '#C9A96E' }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Request a Book */}
      <div style={{ padding: '0 24px', marginBottom: 32 }}>
        <p style={{
          fontSize: 11, color: '#C9A96E', letterSpacing: 2,
          textTransform: 'uppercase', fontFamily: 'var(--font-ui)', marginBottom: 8
        }}>{t(lang, 'requestBook')}</p>
        <p style={{
          fontSize: 13, color: theme.textMuted,
          fontFamily: 'var(--font-ui)', marginBottom: 16
        }}>{t(lang, 'requestBookDesc')}</p>
        <div style={{
          background: theme.bgCard, border: `1px solid ${theme.border}`,
          borderRadius: 14, padding: '12px 16px', marginBottom: 10
        }}>
          <textarea
            placeholder={t(lang, 'requestPlaceholder')}
            value={requestText}
            onChange={e => setRequestText(e.target.value)}
            rows={3}
            style={{
              width: '100%', background: 'none', border: 'none',
              outline: 'none', color: theme.text, fontSize: 14,
              fontFamily: 'var(--font-ui)', resize: 'none',
              direction: isRTL ? 'rtl' : 'ltr'
            }}
          />
        </div>
        {requestSent ? (
          <p style={{ fontSize: 13, color: '#C9A96E', fontFamily: 'var(--font-ui)', textAlign: 'center' }}>
            ✓ {t(lang, 'requestSent')}
          </p>
        ) : (
          <button onClick={handleSendRequest} style={{
            width: '100%', padding: '14px 0',
            background: requestText.trim() ? '#1a6bff' : theme.bgCard,
            border: `1px solid ${requestText.trim() ? '#1a6bff' : theme.border}`,
            borderRadius: 14, color: requestText.trim() ? '#fff' : theme.textMuted,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-ui)'
          }}>{t(lang, 'sendRequest')}</button>
        )}
      </div>

      {/* Clear History */}
      <div style={{ padding: '0 24px', marginBottom: 32 }}>
        <p style={{
          fontSize: 11, color: '#C9A96E', letterSpacing: 2,
          textTransform: 'uppercase', fontFamily: 'var(--font-ui)', marginBottom: 16
        }}>{t(lang, 'clearHistory')}</p>
        <button onClick={handleClearHistory} style={{
          width: '100%', padding: '14px 0',
          background: 'rgba(255,80,80,0.08)',
          border: '1px solid rgba(255,80,80,0.2)',
          borderRadius: 14, color: '#ff6b6b',
          fontSize: 14, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'var(--font-ui)'
        }}>🗑️ {t(lang, 'clearHistory')}</button>
      </div>

      {/* About */}
      <div style={{ padding: '0 24px', marginBottom: 32 }}>
        <div style={{
          background: theme.bgCard, border: `1px solid ${theme.border}`,
          borderRadius: 16, padding: 20, textAlign: 'center'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 20,
            color: '#C9A96E', fontStyle: 'italic', marginBottom: 8
          }}>LuxLibrary</h2>
          <p style={{ fontSize: 13, color: theme.textMuted, fontFamily: 'var(--font-ui)', marginBottom: 4 }}>
            {t(lang, 'aboutDesc')}
          </p>
          <p style={{ fontSize: 11, color: theme.textMuted, fontFamily: 'var(--font-ui)' }}>
            {t(lang, 'version')}
          </p>
        </div>
      </div>
    </div>
  )
}