import { useState } from 'react'
import { t } from '../data/translations'
import { books } from '../data/books'

const BADGES = [
  { id: 'first', icon: '📖', label: 'First Borrow', desc: 'Borrowed your first book', condition: (stats) => stats.totalBorrowed >= 1 },
  { id: 'streak3', icon: '🔥', label: '3 Day Streak', desc: 'Read 3 days in a row', condition: (stats) => stats.streak >= 3 },
  { id: 'streak7', icon: '⚡', label: '7 Day Streak', desc: 'Read 7 days in a row', condition: (stats) => stats.streak >= 7 },
  { id: 'books3', icon: '🏆', label: 'Avid Reader', desc: 'Borrowed 3 books', condition: (stats) => stats.totalBorrowed >= 3 },
  { id: 'finished', icon: '✨', label: 'Finisher', desc: 'Finished a book', condition: (stats) => stats.totalFinished >= 1 },
]

const AVATARS = ['📚', '🦉', '🕯️', '🖋️', '🌙', '🏛️', '🎭', '🌿']

export default function ProfileScreen({ navigate, theme, lang }) {
  const isRTL = lang === 'ar'

  const [username, setUsername] = useState(
    localStorage.getItem('lux_username') || 'Reader'
  )
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(username)
  const [avatar, setAvatar] = useState(
    localStorage.getItem('lux_avatar') || '📚'
  )
  const [showAvatars, setShowAvatars] = useState(false)

  // Calculate stats
  const getStats = () => {
    let totalBorrowed = 0
    let totalFinished = 0
    let totalPages = 0

    for (const book of books) {
      const data = localStorage.getItem(`book_${book.id}`)
      if (data) {
        const parsed = JSON.parse(data)
        totalBorrowed++
        if (parsed.currentPage) totalPages += parsed.currentPage
        if (parsed.currentPage && parsed.currentPage >= book.pages - 5) totalFinished++
      }
    }

    const streak = parseInt(localStorage.getItem('lux_streak') || '0')
    const points = totalBorrowed * 10 + totalFinished * 50 + streak * 5

    return { totalBorrowed, totalFinished, totalPages, streak, points }
  }

  const stats = getStats()
  const earnedBadges = BADGES.filter(b => b.condition(stats))
  const lockedBadges = BADGES.filter(b => !b.condition(stats))

  const saveName = () => {
    setUsername(tempName)
    localStorage.setItem('lux_username', tempName)
    setEditingName(false)
  }

  const selectAvatar = (a) => {
    setAvatar(a)
    localStorage.setItem('lux_avatar', a)
    setShowAvatars(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: theme.bg,
      paddingBottom: 120, direction: isRTL ? 'rtl' : 'ltr'
    }}>

      {/* Header */}
      <div style={{ padding: '56px 24px 32px', textAlign: 'center' }}>
        {/* Avatar */}
        <div
          onClick={() => setShowAvatars(!showAvatars)}
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(201,169,110,0.12)',
            border: '2px solid #C9A96E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto 16px', cursor: 'pointer'
          }}>
          {avatar}
        </div>

        {/* Avatar Picker */}
        {showAvatars && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 10,
            justifyContent: 'center', marginBottom: 16,
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            borderRadius: 16, padding: 16
          }}>
            {AVATARS.map(a => (
              <button key={a} onClick={() => selectAvatar(a)} style={{
                width: 44, height: 44, borderRadius: 10, fontSize: 24,
                background: avatar === a ? 'rgba(201,169,110,0.2)' : 'none',
                border: `1px solid ${avatar === a ? '#C9A96E' : theme.border}`,
                cursor: 'pointer'
              }}>{a}</button>
            ))}
          </div>
        )}

        {/* Username */}
        {editingName ? (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
            <input
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              style={{
                background: theme.bgCard, border: `1px solid ${theme.border}`,
                borderRadius: 10, padding: '8px 14px', color: theme.text,
                fontSize: 16, fontFamily: 'var(--font-ui)', outline: 'none',
                textAlign: 'center'
              }}
            />
            <button onClick={saveName} style={{
              background: '#C9A96E', border: 'none', borderRadius: 10,
              padding: '8px 16px', color: '#0F0C09', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-ui)'
            }}>✓</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 24,
              color: theme.text, fontStyle: 'italic', margin: 0
            }}>{username}</h2>
            <button onClick={() => { setEditingName(true); setTempName(username) }} style={{
              background: 'none', border: 'none', color: theme.textMuted,
              cursor: 'pointer', fontSize: 14
            }}>✏️</button>
          </div>
        )}

        <p style={{
          fontSize: 12, color: '#C9A96E',
          fontFamily: 'var(--font-ui)', letterSpacing: 2
        }}>⭐ {stats.points} pts</p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'flex', margin: '0 24px 32px',
        background: theme.bgCard, border: `1px solid ${theme.border}`,
        borderRadius: 20, overflow: 'hidden'
      }}>
        {[
          ['🔥', stats.streak, lang === 'ar' ? 'أيام متتالية' : lang === 'fr' ? 'Jours' : 'Day Streak'],
          ['📖', stats.totalBorrowed, lang === 'ar' ? 'كتب' : lang === 'fr' ? 'Livres' : 'Books'],
          ['✅', stats.totalFinished, lang === 'ar' ? 'أتممت' : lang === 'fr' ? 'Finis' : 'Finished'],
          ['📄', stats.totalPages, lang === 'ar' ? 'صفحات' : lang === 'fr' ? 'Pages' : 'Pages'],
        ].map(([icon, value, label]) => (
          <div key={label} style={{
            flex: 1, padding: '20px 8px', textAlign: 'center',
            borderRight: `1px solid ${theme.border}`
          }}>
            <p style={{ fontSize: 20, marginBottom: 4 }}>{icon}</p>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 20,
              color: theme.text, marginBottom: 2
            }}>{value}</p>
            <p style={{
              fontSize: 9, color: theme.textMuted,
              fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: 1
            }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div style={{ padding: '0 24px', marginBottom: 32 }}>
        <p style={{
          fontSize: 11, color: '#C9A96E', letterSpacing: 2,
          textTransform: 'uppercase', fontFamily: 'var(--font-ui)', marginBottom: 16
        }}>
          {lang === 'ar' ? 'الشارات' : lang === 'fr' ? 'Badges' : 'Badges'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {earnedBadges.map(badge => (
            <div key={badge.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(201,169,110,0.1)',
              border: '1px solid rgba(201,169,110,0.3)',
              borderRadius: 12, padding: '10px 14px'
            }}>
              <span style={{ fontSize: 20 }}>{badge.icon}</span>
              <div>
                <p style={{ fontSize: 12, color: '#C9A96E', fontFamily: 'var(--font-ui)', fontWeight: 600, margin: 0 }}>{badge.label}</p>
                <p style={{ fontSize: 10, color: theme.textMuted, fontFamily: 'var(--font-ui)', margin: 0 }}>{badge.desc}</p>
              </div>
            </div>
          ))}
          {lockedBadges.map(badge => (
            <div key={badge.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 12, padding: '10px 14px',
              opacity: 0.4
            }}>
              <span style={{ fontSize: 20, filter: 'grayscale(1)' }}>{badge.icon}</span>
              <div>
                <p style={{ fontSize: 12, color: theme.textMuted, fontFamily: 'var(--font-ui)', fontWeight: 600, margin: 0 }}>🔒 {badge.label}</p>
                <p style={{ fontSize: 10, color: theme.textMuted, fontFamily: 'var(--font-ui)', margin: 0 }}>{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Currently Reading */}
      <div style={{ padding: '0 24px', marginBottom: 32 }}>
        <p style={{
          fontSize: 11, color: '#C9A96E', letterSpacing: 2,
          textTransform: 'uppercase', fontFamily: 'var(--font-ui)', marginBottom: 16
        }}>
          {lang === 'ar' ? 'أقرأ الآن' : lang === 'fr' ? 'En cours' : 'Currently Reading'}
        </p>
        {books.filter(b => {
          const data = localStorage.getItem(`book_${b.id}`)
          if (!data) return false
          const parsed = JSON.parse(data)
          const daysLeft = 21 - Math.floor((new Date() - new Date(parsed.checkoutDate)) / (1000 * 60 * 60 * 24))
          return daysLeft > 0
        }).length === 0 ? (
          <p style={{ fontSize: 13, color: theme.textMuted, fontFamily: 'var(--font-ui)' }}>
            {lang === 'ar' ? 'لا توجد كتب نشطة' : lang === 'fr' ? 'Aucun livre actif' : 'No active books'}
          </p>
        ) : (
          books.filter(b => {
            const data = localStorage.getItem(`book_${b.id}`)
            if (!data) return false
            const parsed = JSON.parse(data)
            const daysLeft = 21 - Math.floor((new Date() - new Date(parsed.checkoutDate)) / (1000 * 60 * 60 * 24))
            return daysLeft > 0
          }).map(book => {
            const data = JSON.parse(localStorage.getItem(`book_${book.id}`))
            const progress = data.currentPage ? Math.round((data.currentPage / book.pages) * 100) : 0
            return (
              <div key={book.id} onClick={() => navigate('reader', { book })} style={{
                display: 'flex', gap: 12, alignItems: 'center',
                background: theme.bgCard, border: `1px solid ${theme.border}`,
                borderRadius: 14, padding: 14, marginBottom: 10, cursor: 'pointer'
              }}>
                <img src={book.cover} alt={book.title} style={{
                  width: 44, height: 64, objectFit: 'cover', borderRadius: 6
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: theme.text, fontStyle: 'italic', margin: '0 0 4px' }}>{book.title}</p>
                  <div style={{ height: 3, background: theme.border, borderRadius: 2, marginBottom: 4 }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: '#C9A96E', borderRadius: 2 }} />
                  </div>
                  <p style={{ fontSize: 11, color: theme.textMuted, fontFamily: 'var(--font-ui)', margin: 0 }}>{progress}%</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Go to Settings */}
      <div style={{ padding: '0 24px' }}>
        <button
          onClick={() => navigate('settings')}
          style={{
            width: '100%', padding: '14px 0',
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            borderRadius: 14, color: theme.textSecondary,
            fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-ui)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
          ⚙️ {lang === 'ar' ? 'الإعدادات' : lang === 'fr' ? 'Paramètres' : 'Settings'}
        </button>
      </div>
    </div>
  )
}