import { useState, useRef } from 'react'
import { books } from '../data/books'

const SHELVES = [
  { label: 'Featured Today', filter: () => true },
  { label: 'Classic Literature', filter: b => b.era === 'Classic' },
  { label: 'Victorian Era', filter: b => b.era === 'Victorian' },
  { label: 'Modern Masterpieces', filter: b => b.era === 'Modern' },
  { label: 'French Masters', filter: b => b.language === 'French' },
  { label: 'Russian Giants', filter: b => b.language === 'Russian' },
  { label: 'Short Reads', filter: b => b.pages < 300 },
]

const THEME_OPTIONS = [
  { key: 'night', icon: '☽', label: 'Night' },
  { key: 'paper', icon: '❧', label: 'Paper' },
  { key: 'day', icon: '◎', label: 'Day' },
]

function BookCard({ book, onClick, theme }) {
  return (
    <div
      onClick={() => onClick(book)}
      style={{ flexShrink: 0, width: 110, cursor: 'pointer', transition: 'transform 0.2s ease' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        width: 110, height: 165, borderRadius: 8, overflow: 'hidden',
        border: `1px solid ${theme.border}`,
        background: theme.bgCard,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}>
        <img
          src={book.cover}
          alt={book.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>
      <p style={{
        fontFamily: 'var(--font-display)', fontSize: 11,
        color: theme.textSecondary, marginTop: 8,
        lineHeight: 1.4, overflow: 'hidden',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
      }}>{book.title}</p>
    </div>
  )
}

function Shelf({ label, books, onBookClick, theme }) {
  if (books.length === 0) return null
  return (
    <div style={{ marginBottom: 36 }}>
      <p style={{
        fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 500,
        color: '#C9A96E', letterSpacing: 2, textTransform: 'uppercase',
        padding: '0 24px', marginBottom: 16
      }}>{label}</p>
      <div style={{
        display: 'flex', gap: 14, overflowX: 'auto',
        padding: '4px 24px 8px', scrollbarWidth: 'none',
      }}>
        {books.map(book => (
          <BookCard key={book.id} book={book} onClick={onBookClick} theme={theme} />
        ))}
      </div>
    </div>
  )
}

export default function EntranceScreen({ navigate, theme, currentTheme, changeTheme }) {
  const [selectedBook, setSelectedBook] = useState(null)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showThemePicker, setShowThemePicker] = useState(false)

  const hero = books[0]

  const filtered = search
    ? books.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
      )
    : null

  const handleBookClick = (book) => setSelectedBook(book)
  const closeSheet = () => setSelectedBook(null)

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: 100, position: 'relative', transition: 'background 0.3s' }}>

      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, zIndex: 50,
        padding: '48px 24px 16px',
        background: `linear-gradient(${theme.bg} 60%, transparent)`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background 0.3s'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 24,
          color: '#C9A96E', letterSpacing: 1, fontWeight: 600
        }}>LuxLibrary</h1>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Theme Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowThemePicker(!showThemePicker); setShowSearch(false) }}
              style={{
                background: 'none', border: `1px solid ${theme.border}`,
                borderRadius: 20, padding: '6px 12px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                color: theme.textSecondary, fontSize: 16
              }}
            >
              {THEME_OPTIONS.find(t => t.key === currentTheme)?.icon}
            </button>

            {showThemePicker && (
              <div style={{
                position: 'absolute', top: 44, right: 0,
                background: currentTheme === 'night' ? '#1A1410' : theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: 16, padding: 8,
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                display: 'flex', flexDirection: 'column', gap: 4,
                minWidth: 130, zIndex: 100
              }}>
                {THEME_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { changeTheme(opt.key); setShowThemePicker(false) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', borderRadius: 10, border: 'none',
                      background: currentTheme === opt.key ? 'rgba(201,169,110,0.12)' : 'transparent',
                      cursor: 'pointer', textAlign: 'left',
                      color: currentTheme === opt.key ? '#C9A96E' : theme.textSecondary,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{opt.icon}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13 }}>{opt.label}</span>
                    {currentTheme === opt.key && (
                      <span style={{ marginLeft: 'auto', color: '#C9A96E', fontSize: 12 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <button onClick={() => { setShowSearch(!showSearch); setShowThemePicker(false) }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: showSearch ? '#C9A96E' : theme.textSecondary, fontSize: 20
          }}>🔍</button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div style={{
          position: 'fixed', top: 108, left: '50%', transform: 'translateX(-50%)',
          width: '90%', maxWidth: 390, zIndex: 50,
          background: currentTheme === 'night' ? '#1C1610' : theme.bg,
          border: `1px solid ${theme.border}`,
          borderRadius: 14, padding: '12px 16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
        }}>
          <input
            autoFocus
            placeholder="Search titles or authors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', background: 'none', border: 'none',
              outline: 'none', color: theme.text, fontSize: 15
            }}
          />
        </div>
      )}

      {/* Search Results */}
      {filtered && (
        <div style={{ padding: '160px 24px 0' }}>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: 11, color: '#C9A96E',
            letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16
          }}>Search Results</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {filtered.map(book => (
              <BookCard key={book.id} book={book} onClick={handleBookClick} theme={theme} />
            ))}
            {filtered.length === 0 && (
              <p style={{ color: theme.textMuted, fontSize: 14 }}>No books found.</p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!filtered && (
        <>
          {/* Hero Banner */}
          <div style={{ height: 380, position: 'relative', overflow: 'hidden', marginBottom: 32 }}>
            <img
              src={hero.cover}
              alt={hero.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(to top, ${theme.bg} 0%, transparent 50%, rgba(15,12,9,0.6) 100%)`
            }} />
            <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24 }}>
              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: 10, color: '#C9A96E',
                letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8
              }}>Featured Today</p>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 28,
                color: '#EDE8DF', marginBottom: 8, fontStyle: 'italic'
              }}>{hero.title}</h2>
              <p style={{ fontSize: 13, color: 'rgba(237,232,223,0.6)', marginBottom: 16 }}>
                {hero.author} · {hero.year}
              </p>
              <button
                onClick={() => handleBookClick(hero)}
                style={{
                  background: '#C9A96E', border: 'none', borderRadius: 10,
                  padding: '10px 24px', color: '#0F0C09', fontSize: 13,
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)'
                }}>View Book</button>
            </div>
          </div>

          {/* Shelves */}
          <div style={{ paddingTop: 8 }}>
            {SHELVES.map(shelf => (
              <Shelf
                key={shelf.label}
                label={shelf.label}
                books={books.filter(shelf.filter)}
                onBookClick={handleBookClick}
                theme={theme}
              />
            ))}
          </div>
        </>
      )}

      {/* Bottom Sheet */}
      {selectedBook && (
        <>
          <div
            onClick={closeSheet}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              zIndex: 60, backdropFilter: 'blur(4px)'
            }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430, zIndex: 70,
            background: currentTheme === 'night' ? '#1A1410' : theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: '24px 24px 0 0',
            padding: '0 0 40px',
            boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{
              width: 40, height: 4, background: theme.border,
              borderRadius: 2, margin: '12px auto 20px'
            }} />

            <div style={{ display: 'flex', gap: 16, padding: '0 24px 20px' }}>
              <img
                src={selectedBook.cover}
                alt={selectedBook.title}
                style={{
                  width: 90, height: 135, objectFit: 'cover',
                  borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  border: `1px solid ${theme.border}`
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: 10, color: '#C9A96E', letterSpacing: 2,
                  textTransform: 'uppercase', marginBottom: 8,
                  fontFamily: 'var(--font-ui)'
                }}>{selectedBook.era} · {selectedBook.language}</p>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 20,
                  color: theme.text, marginBottom: 6, lineHeight: 1.3,
                  fontStyle: 'italic'
                }}>{selectedBook.title}</h3>
                <p style={{
                  fontSize: 13, color: theme.textSecondary,
                  fontFamily: 'var(--font-ui)'
                }}>{selectedBook.author}, {selectedBook.year}</p>
              </div>
            </div>

            <div style={{ height: 1, background: theme.border, margin: '0 24px 20px' }} />

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 14,
              color: theme.textSecondary, lineHeight: 1.8,
              padding: '0 24px', marginBottom: 24, fontStyle: 'italic'
            }}>{selectedBook.summary}</p>

            <div style={{
              display: 'flex', justifyContent: 'space-around',
              background: theme.bgCard, border: `1px solid ${theme.border}`,
              borderRadius: 14, margin: '0 24px 24px', padding: 16
            }}>
              {[['Pages', selectedBook.pages], ['Loan', '21 Days'], ['Cost', 'Free']].map(([label, value]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: 18,
                    color: theme.text, marginBottom: 4
                  }}>{value}</p>
                  <p style={{
                    fontSize: 11, color: theme.textMuted,
                    fontFamily: 'var(--font-ui)'
                  }}>{label}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: '0 24px' }}>
              <button
                onClick={() => { navigate('bookcard', { book: selectedBook }); closeSheet() }}
                style={{
                  width: '100%', padding: '16px 0',
                  background: '#1a6bff', border: 'none', borderRadius: 14,
                  color: '#fff', fontSize: 16, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)', marginBottom: 10,
                  boxShadow: '0 8px 24px rgba(26,107,255,0.3)'
                }}>Borrow for 21 Days</button>
              <p style={{
                textAlign: 'center', fontSize: 11,
                color: theme.textMuted, fontFamily: 'var(--font-ui)'
              }}>1 short ad · your progress saved for 21 days</p>
            </div>
          </div>

          <style>{`
            @keyframes slideUp {
              from { transform: translateX(-50%) translateY(100%); }
              to { transform: translateX(-50%) translateY(0); }
            }
          `}</style>
        </>
      )}
    </div>
  )
}