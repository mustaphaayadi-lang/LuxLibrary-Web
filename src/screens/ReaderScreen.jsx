import { useState, useEffect, useRef } from 'react'

const CHARS_PER_PAGE = 2000

const THEMES = {
  night: {
    bg: '#0F0C09',
    text: 'rgba(237, 232, 223, 0.85)',
    ui: 'rgba(237, 232, 223, 0.4)',
    border: 'rgba(255,235,200,0.08)',
    label: '🌙 Night',
  },
  paper: {
    bg: '#F5F0E8',
    text: '#2C2416',
    ui: '#8B7355',
    border: 'rgba(44,36,22,0.1)',
    label: '📄 Paper',
  },
  day: {
    bg: '#FFFFFF',
    text: '#1A1A1A',
    ui: '#888888',
    border: 'rgba(0,0,0,0.08)',
    label: '☀️ Day',
  },
}

function paginateText(text) {
  const pages = []
  let i = 0
  while (i < text.length) {
    let end = i + CHARS_PER_PAGE
    if (end < text.length) {
      const nextSpace = text.indexOf(' ', end)
      if (nextSpace !== -1) end = nextSpace
    }
    pages.push(text.slice(i, end).trim())
    i = end
  }
  return pages
}

function cleanText(raw) {
  const start = raw.indexOf('*** START OF')
  const end = raw.indexOf('*** END OF')
  let cleaned = start !== -1 && end !== -1
    ? raw.slice(raw.indexOf('\n', start) + 1, end).trim()
    : raw.trim()

  const chapterMarkers = [
    'Chapter I\n', 'CHAPTER I\n', 'Chapter 1\n', 'CHAPTER 1\n',
    'CHAPTER ONE\n', 'Chapter One\n', 'PART I\n', 'Part I\n',
    'Chapter I\r', 'CHAPTER I\r', 'I.\n\n', 'CHAPTER I.',
  ]
  for (const marker of chapterMarkers) {
    const chapterStart = cleaned.indexOf(marker)
    if (chapterStart !== -1) {
      cleaned = cleaned.slice(chapterStart).trim()
      break
    }
  }
  return cleaned
}

export default function ReaderScreen({ book, navigate, globalTheme }) {
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showUI, setShowUI] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [theme, setTheme] = useState(globalTheme || 'night')
  const [fontSize, setFontSize] = useState(17)
  const [brightness, setBrightness] = useState(100)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
  const scrollContainerRef = useRef(null)
  const t = THEMES[theme]

  useEffect(() => { fetchBook() }, [])

  useEffect(() => {
    if (pages.length > 0) {
      const data = JSON.parse(localStorage.getItem(`book_${book.id}`) || '{}')
      localStorage.setItem(`book_${book.id}`, JSON.stringify({ ...data, currentPage }))
    }
  }, [currentPage])

  const fetchBook = async () => {
    try {
      setLoading(true)
      const res = await fetch(book.textUrl)
      if (!res.ok) throw new Error()
      const raw = await res.text()
      const cleaned = cleanText(raw)
      const paginated = paginateText(cleaned)
      setPages(paginated)
      const saved = JSON.parse(localStorage.getItem(`book_${book.id}`) || '{}')
      if (saved.currentPage && saved.currentPage < paginated.length) {
        setCurrentPage(saved.currentPage)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const goToPage = (dir) => {
    if (animating) return
    if (dir === 'next' && currentPage >= pages.length - 1) return
    if (dir === 'prev' && currentPage <= 0) return
    setAnimating(true)
    setCurrentPage(p => dir === 'next' ? p + 1 : p - 1)
    setTimeout(() => setAnimating(false), 100)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    const diffY = Math.abs(touchStartY.current - e.changedTouches[0].clientY)

    // Only swipe if horizontal movement is dominant
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
      goToPage(diffX > 0 ? 'next' : 'prev')
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  const isExpired = () => {
    const data = localStorage.getItem(`book_${book.id}`)
    if (!data) return true
    const { checkoutDate } = JSON.parse(data)
    const daysLeft = 21 - Math.floor((new Date() - new Date(checkoutDate)) / (1000 * 60 * 60 * 24))
    return daysLeft <= 0
  }

  const expired = isExpired()
  const progress = pages.length > 0 ? Math.round(((currentPage + 1) / pages.length) * 100) : 0

  return (
    <div style={{
      height: '100vh', width: '100%',
      background: t.bg, position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      filter: `brightness(${brightness}%)`,
      overflow: 'hidden'
    }}>

      {/* Top Bar */}
      {showUI && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '48px 20px 12px',
          background: `linear-gradient(${t.bg} 70%, transparent)`,
          zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button onClick={() => navigate('table')} style={{
            background: 'none', border: 'none', color: '#C9A96E',
            fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-ui)'
          }}>← Back</button>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 13, color: t.ui,
            margin: 0, fontStyle: 'italic', maxWidth: 160, textAlign: 'center',
            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
          }}>{book.title}</p>
          <button onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings) }} style={{
            background: 'none', border: 'none', color: t.ui, fontSize: 16, cursor: 'pointer'
          }}>⚙️</button>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div style={{
          position: 'absolute', top: 110, left: '50%', transform: 'translateX(-50%)',
          width: '90%', maxWidth: 390, zIndex: 20,
          background: theme === 'night' ? '#1A1410' : t.bg,
          border: `1px solid ${t.border}`, borderRadius: 16, padding: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
        }}>
          <p style={{ fontSize: 10, color: '#C9A96E', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, fontFamily: 'var(--font-ui)' }}>Reading Mode</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {Object.entries(THEMES).map(([key, val]) => (
              <button key={key} onClick={() => setTheme(key)} style={{
                flex: 1, padding: '10px 4px',
                background: theme === key ? '#C9A96E' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${theme === key ? '#C9A96E' : t.border}`,
                borderRadius: 10, color: theme === key ? '#0F0C09' : t.text,
                fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-ui)',
                fontWeight: theme === key ? 600 : 400
              }}>{val.label}</button>
            ))}
          </div>

          <p style={{ fontSize: 10, color: '#C9A96E', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, fontFamily: 'var(--font-ui)' }}>Font Size</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button onClick={() => setFontSize(f => Math.max(13, f - 1))} style={{
              width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.border}`,
              background: 'none', color: t.text, fontSize: 18, cursor: 'pointer'
            }}>−</button>
            <div style={{ flex: 1, height: 2, background: t.border, borderRadius: 2, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${((fontSize - 13) / 12) * 100}%`,
                background: '#C9A96E', borderRadius: 2
              }} />
            </div>
            <button onClick={() => setFontSize(f => Math.min(25, f + 1))} style={{
              width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.border}`,
              background: 'none', color: t.text, fontSize: 18, cursor: 'pointer'
            }}>+</button>
            <span style={{ fontSize: 12, color: t.ui, fontFamily: 'var(--font-ui)', minWidth: 30 }}>{fontSize}px</span>
          </div>

          <p style={{ fontSize: 10, color: '#C9A96E', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, fontFamily: 'var(--font-ui)' }}>Brightness</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14 }}>🌑</span>
            <input type="range" min="40" max="100" value={brightness}
              onChange={e => setBrightness(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#C9A96E' }} />
            <span style={{ fontSize: 14 }}>☀️</span>
          </div>
        </div>
      )}

      {/* Page Content — key forces full remount on page change = instant scroll reset */}
      <div
        key={currentPage}
        ref={scrollContainerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => { if (!showSettings) setShowUI(!showUI) }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          overflowY: 'auto',
          padding: '110px 28px 80px',
          cursor: 'pointer',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {loading && (
          <div style={{ textAlign: 'center', paddingTop: 150 }}>
            <p style={{ color: t.ui, fontSize: 14, fontFamily: 'var(--font-ui)' }}>Opening your book...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', paddingTop: 150 }}>
            <p style={{ color: t.ui, fontSize: 14, fontFamily: 'var(--font-ui)' }}>Could not load this book. Try again later.</p>
          </div>
        )}

        {!loading && !error && expired && (
          <div style={{ textAlign: 'center', paddingTop: 150 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: t.text, marginBottom: 12, fontStyle: 'italic' }}>Your loan has expired</p>
            <p style={{ fontSize: 14, color: t.ui, marginBottom: 24, fontFamily: 'var(--font-ui)' }}>Watch 2 ads to renew access instantly</p>
            <button onClick={() => navigate('table')} style={{
              background: '#C9A96E', border: 'none', borderRadius: 12,
              padding: '12px 28px', color: '#0F0C09', fontSize: 14,
              fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)'
            }}>Renew Access</button>
          </div>
        )}

        {!loading && !error && !expired && pages.length > 0 && (
          <div style={{
            fontSize: fontSize, lineHeight: 1.95, color: t.text,
            fontFamily: 'var(--font-body)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {pages[currentPage]}
          </div>
        )}
      </div>

      {/* Bottom Progress Bar — always visible, minimal */}
      {!loading && !error && pages.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '8px 24px 16px',
          background: `linear-gradient(transparent, ${t.bg} 60%)`,
          zIndex: 10, pointerEvents: 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
            <p style={{ fontSize: 11, color: t.ui, margin: 0, fontFamily: 'var(--font-ui)' }}>
              {currentPage + 1} / {pages.length} · {progress}%
            </p>
          </div>
          <div style={{ height: 1, background: t.border, borderRadius: 1 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#C9A96E', borderRadius: 1, transition: 'width 0.3s' }} />
          </div>
        </div>
      )}
    </div>
  )
}