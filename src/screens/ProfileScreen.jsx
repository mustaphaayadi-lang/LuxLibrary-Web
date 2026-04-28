import { useState, useEffect } from 'react'
import { t } from '../data/translations'
import { books } from '../data/books'

const AVATAR_LEVELS = [
  {
    level: 1,
    avatar: '🌱',
    name: { en: 'Seedling', fr: 'Graine', ar: 'بذرة' },
    desc: { en: 'Just joined', fr: 'Nouveau membre', ar: 'عضو جديد' },
    condition: () => true,
  },
  {
    level: 2,
    avatar: '📖',
    name: { en: 'Reader', fr: 'Lecteur', ar: 'قارئ' },
    desc: { en: 'Borrowed first book', fr: 'Premier emprunt', ar: 'أول استعارة' },
    condition: (stats) => stats.totalBorrowed >= 1,
  },
  {
    level: 3,
    avatar: '🕯️',
    name: { en: 'Scholar', fr: 'Érudit', ar: 'عالم' },
    desc: { en: '3 day streak or finished a book', fr: 'Série de 3 jours ou livre terminé', ar: '3 أيام متتالية أو كتاب مكتمل' },
    condition: (stats) => stats.streak >= 3 || stats.totalFinished >= 1,
  },
  {
    level: 4,
    avatar: '🦉',
    name: { en: 'Sage', fr: 'Sage', ar: 'حكيم' },
    desc: { en: '7 day streak and 3 books borrowed', fr: 'Série de 7 jours et 3 livres', ar: '7 أيام متتالية و3 كتب' },
    condition: (stats) => stats.streak >= 7 && stats.totalBorrowed >= 3,
  },
  {
    level: 5,
    avatar: '🏛️',
    name: { en: 'Curator', fr: 'Conservateur', ar: 'أمين المكتبة' },
    desc: { en: '30 days on app and 5 books borrowed', fr: '30 jours et 5 livres empruntés', ar: '30 يوماً و5 كتب مستعارة' },
    condition: (stats) => stats.daysOnApp >= 30 && stats.totalBorrowed >= 5,
  },
  {
    level: 6,
    avatar: '👑',
    name: { en: 'Luminary', fr: 'Lumière', ar: 'نجم' },
    desc: { en: '60 days on app and 3 books finished', fr: '60 jours et 3 livres terminés', ar: '60 يوماً و3 كتب مكتملة' },
    condition: (stats) => stats.daysOnApp >= 60 && stats.totalFinished >= 3,
  },
]

const BADGES = [
  { id: 'first', icon: '📖', label: 'First Borrow', condition: (s) => s.totalBorrowed >= 1 },
  { id: 'streak3', icon: '🔥', label: '3 Day Streak', condition: (s) => s.streak >= 3 },
  { id: 'streak7', icon: '⚡', label: '7 Day Streak', condition: (s) => s.streak >= 7 },
  { id: 'books3', icon: '🏆', label: 'Avid Reader', condition: (s) => s.totalBorrowed >= 3 },
  { id: 'finished', icon: '✨', label: 'Finisher', condition: (s) => s.totalFinished >= 1 },
  { id: 'streak30', icon: '🌟', label: '30 Day Streak', condition: (s) => s.streak >= 30 },
]

function updateStreak() {
  const today = new Date().toDateString()
  const lastOpen = localStorage.getItem('lux_last_open')
  const streak = parseInt(localStorage.getItem('lux_streak') || '0')

  if (!lastOpen) {
    localStorage.setItem('lux_last_open', today)
    localStorage.setItem('lux_streak', '1')
    return 1
  }

  const last = new Date(lastOpen)
  const now = new Date()
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return streak
  if (diffDays === 1) {
    const newStreak = streak + 1
    localStorage.setItem('lux_streak', String(newStreak))
    localStorage.setItem('lux_last_open', today)
    return newStreak
  }
  // Missed a day — reset
  localStorage.setItem('lux_streak', '1')
  localStorage.setItem('lux_last_open', today)
  return 1
}

function getStats() {
  const streak = updateStreak()
  let totalBorrowed = 0
  let totalFinished = 0
  let totalPages = 0

  for (const book of books) {
    const data = localStorage.getItem(`book_${book.id}`)
    if (data) {
      const parsed = JSON.parse(data)
      totalBorrowed++
      const progress = parsed.currentPage || 0
      totalPages += progress
      if (progress >= book.pages * 0.9) totalFinished++
    }
  }

  const joinDate = localStorage.getItem('lux_join_date')
  if (!joinDate) localStorage.setItem('lux_join_date', new Date().toISOString())
  const daysOnApp = joinDate
    ? Math.floor((new Date() - new Date(joinDate)) / (1000 * 60 * 60 * 24))
    : 0

  const points = totalBorrowed * 10 + totalFinished * 50 + streak * 5 + daysOnApp * 2

  return { streak, totalBorrowed, totalFinished, totalPages, daysOnApp, points }
}

function getCurrentAvatar(stats) {
  let current = AVATAR_LEVELS[0]
  for (const level of AVATAR_LEVELS) {
    if (level.condition(stats)) current = level
  }
  return current
}

function getNextAvatar(stats) {
  for (const level of AVATAR_LEVELS) {
    if (!level.condition(stats)) return level
  }
  return null
}

export default function ProfileScreen({ navigate, theme, lang }) {
  const isRTL = lang === 'ar'
  const [username, setUsername] = useState(localStorage.getItem('lux_username') || 'Reader')
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(username)
  const [stats] = useState(getStats)

  const currentAvatar = getCurrentAvatar(stats)
  const nextAvatar = getNextAvatar(stats)
  const earnedBadges = BADGES.filter(b => b.condition(stats))
  const lockedBadges = BADGES.filter(b => !b.condition(stats))

  const saveName = () => {
    setUsername(tempName)
    localStorage.setItem('lux_username', tempName)
    setEditingName(false)
  }

  const avatarName = currentAvatar.name[lang] || currentAvatar.name.en
  const avatarDesc = currentAvatar.desc[lang] || currentAvatar.desc.en
  const nextAvatarName = nextAvatar ? (nextAvatar.name[lang] || nextAvatar.name.en) : null

  return (
    <div style={{
      minHeight: '100vh', background: theme.bg,
      paddingBottom: 120, direction: isRTL ? 'rtl' : 'ltr'
    }}>

      {/* Header */}
      <div style={{ padding: '56px 24px 32px', textAlign: 'center' }}>

        {/* Avatar */}
        <div style={{
          width: 90, height: 90, borderRadius: '50%',
          background: 'rgba(201,169,110,0.12)',
          border: '2px solid #C9A96E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 42, margin: '0 auto 12px',
          boxShadow: '0 0 30px rgba(201,169,110,0.15)'
        }}>
          {currentAvatar.avatar}
        </div>

        {/* Avatar Level */}
        <p style={{
          fontSize: 11, color: '#C9A96E', letterSpacing: 2,
          textTransform: 'uppercase', fontFamily: 'var(--font-ui)', marginBottom: 4
        }}>{avatarName}</p>
        <p style={{
          fontSize: 11, color: theme.textMuted,
          fontFamily: 'var(--font-ui)', marginBottom: 16
        }}>{avatarDesc}</p>

        {/* Next level hint */}
        {nextAvatar && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: theme.bgCard, border: '1px solid ' + theme.border,
            borderRadius: 20, padding: '6px 14px', marginBottom: 16
          }}>
            <span style={{ fontSize: 14 }}>{nextAvatar.avatar}</span>
            <p style={{
              fontSize: 11, color: theme.textMuted,
              fontFamily: 'var(--font-ui)', margin: 0
            }}>
              {lang === 'ar' ? 'التالي: ' : lang === 'fr' ? 'Prochain: ' : 'Next: '}{nextAvatarName}
            </p>
          </div>
        )}

        {/* Username */}
        {editingName ? (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
            <input
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              style={{
                background: theme.bgCard, border: '1px solid ' + theme.border,
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
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

        <p style={{ fontSize: 12, color: '#C9A96E', fontFamily: 'var(--font-ui)', letterSpacing: 1 }}>
          ⭐ {stats.points} pts
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'flex', margin: '0 24px 32px',
        background: theme.bgCard, border: '1px solid ' + theme.border,
        borderRadius: 20, overflow: 'hidden'
      }}>
        {[
          ['🔥', stats.streak, lang === 'ar' ? 'تتالي' : lang === 'fr' ? 'Série' : 'Streak'],
          ['📚', stats.totalBorrowed, lang === 'ar' ? 'كتب' : lang === 'fr' ? 'Livres' : 'Books'],
          ['✅', stats.totalFinished, lang === 'ar' ? 'أتممت' : lang === 'fr' ? 'Finis' : 'Finished'],
          ['📅', stats.daysOnApp, lang === 'ar' ? 'أيام' : lang === 'fr' ? 'Jours' : 'Days'],
        ].map(([icon, value, label]) => (
          <div key={label} style={{
            flex: 1, padding: '20px 8px', textAlign: 'center',
            borderRight: '1px solid ' + theme.border
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {earnedBadges.map(badge => (
            <div key={badge.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(201,169,110,0.08)',
              border: '1px solid rgba(201,169,110,0.25)',
              borderRadius: 14, padding: '12px 16px'
            }}>
              <span style={{ fontSize: 22 }}>{badge.icon}</span>
              <p style={{ fontSize: 13, color: '#C9A96E', fontFamily: 'var(--font-ui)', fontWeight: 600, margin: 0 }}>{badge.label}</p>
              <span style={{ marginLeft: 'auto', color: '#C9A96E', fontSize: 12 }}>✓</span>
            </div>
          ))}
          {lockedBadges.map(badge => (
            <div key={badge.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: theme.bgCard, border: '1px solid ' + theme.border,
              borderRadius: 14, padding: '12px 16px', opacity: 0.4
            }}>
              <span style={{ fontSize: 22, filter: 'grayscale(1)' }}>{badge.icon}</span>
              <p style={{ fontSize: 13, color: theme.textMuted, fontFamily: 'var(--font-ui)', margin: 0 }}>🔒 {badge.label}</p>
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
                background: theme.bgCard, border: '1px solid ' + theme.border,
                borderRadius: 14, padding: 14, marginBottom: 10, cursor: 'pointer'
              }}>
                <img src={book.cover} alt={book.title} style={{
                  width: 44, height: 64, objectFit: 'cover', borderRadius: 6,
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: theme.text, fontStyle: 'italic', margin: '0 0 6px' }}>{book.title}</p>
                  <div style={{ height: 3, background: theme.border, borderRadius: 2, marginBottom: 4 }}>
                    <div style={{ height: '100%', width: progress + '%', background: '#C9A96E', borderRadius: 2 }} />
                  </div>
                  <p style={{ fontSize: 11, color: theme.textMuted, fontFamily: 'var(--font-ui)', margin: 0 }}>{progress}%</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}