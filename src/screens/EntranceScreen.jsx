import { useState, useRef } from 'react'
import { books } from '../data/books'
import { t } from '../data/translations'

const SHELVES = [
  { labelKey: 'shelfFeatured', filter: () => true },
  { labelKey: 'shelfClassic', filter: b => b.era === 'Classic' },
  { labelKey: 'shelfVictorian', filter: b => b.era === 'Victorian' },
  { labelKey: 'shelfModern', filter: b => b.era === 'Modern' },
  { labelKey: 'shelfFrench', filter: b => b.language === 'French' },
  { labelKey: 'shelfRussian', filter: b => b.language === 'Russian' },
  { labelKey: 'shelfShort', filter: b => b.pages < 300 },
]

const CATEGORIES = [
  { id: 'all', icon: '✨', label: { en: 'All', fr: 'Tout', ar: 'الكل' } },
  { id: 'Romance & Passion', icon: '💔', label: { en: 'Romance', fr: 'Romance', ar: 'رومانسية' } },
  { id: 'Psychology & Mind', icon: '🧠', label: { en: 'Psychology', fr: 'Psychologie', ar: 'علم النفس' } },
  { id: 'Dark & Gothic', icon: '🖤', label: { en: 'Gothic', fr: 'Gothique', ar: 'قوطي' } },
  { id: 'Society & Politics', icon: '🌍', label: { en: 'Society', fr: 'Société', ar: 'المجتمع' } },
  { id: 'Power & Ambition', icon: '👑', label: { en: 'Ambition', fr: 'Ambition', ar: 'الطموح' } },
  { id: 'Mystery & Suspense', icon: '🕵️', label: { en: 'Mystery', fr: 'Mystère', ar: 'غموض' } },
  { id: 'Nature & Philosophy', icon: '🌿', label: { en: 'Philosophy', fr: 'Philosophie', ar: 'فلسفة' } },
  { id: 'War & History', icon: '⚔️', label: { en: 'History', fr: 'Histoire', ar: 'التاريخ' } },
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
        border: '1px solid ' + theme.border,
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

function Shelf({ labelKey, books, onBookClick, theme, lang }) {
  if (books.length === 0) return null
  return (
    <div style={{ marginBottom: 36 }}>
      <p style={{
        fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 500,
        color: '#8B6F47', letterSpacing: 2, textTransform: 'uppercase',
        padding: '0 24px', marginBottom: 16
      }}>{t(lang, labelKey)}</p>
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

export default function EntranceScreen({ navigate, theme, currentTheme, changeTheme, lang }) {
  const [selectedBook, setSelectedBook] = useState(null)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [savedBooks, setSavedBooks] = useState(
    JSON.parse(localStorage.getItem('lux_read_later') || '[]')
  )
  const [sheetY, setSheetY] = useState(0)
  const sheetTouchStart = useRef(null)
  const sheetRef = useRef(null)
  const isRTL = lang === 'ar'

  const hero = books[0]

  const getSummary = (book) => {
    if (typeof book.summary === 'object') return book.summary[lang] || book.summary.en
    return book.summary
  }

  const filtered = search
    ? books.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
      )
    : null

  const categoryBooks = activeCategory === 'all'
    ? null
    : books.filter(b => b.genres && b.genres.includes(activeCategory))

  const handleBookClick = (book) => {
    setSheetY(0)
    setSelectedBook(book)
  }
  const closeSheet = () => setSelectedBook(null)

  const toggleReadLater = (bookId) => {
    const saved = JSON.parse(localStorage.getItem('lux_read_later') || '[]')
    const updated = saved.includes(bookId)
      ? saved.filter(id => id !== bookId)
      : [...saved, bookId]
    localStorage.setItem('lux_read_later', JSON.stringify(updated))
    setSavedBooks(updated)
  }

  const isBookSaved = (bookId) => savedBooks.includes(bookId)

  const handleSheetTouchStart = (e) => {
    sheetTouchStart.current = e.touches[0].clientY
  }

  const handleSheetTouchMove = (e) => {
    if (sheetTouchStart.current === null) return
    const diff = e.touches[0].clientY - sheetTouchStart.current
    if (diff > 0) {
      e.preventDefault()
      e.stopPropagation()
      setSheetY(diff)
    }
  }

  const handleSheetTouchEnd = () => {
    if (sheetY > 120) {
      closeSheet()
    } else {
      setSheetY(0)
    }
    sheetTouchStart.current = null
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: 100, position: 'relative', transition: 'background 0.3s', direction: isRTL ? 'rtl' : 'ltr' }}>

      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, zIndex: 50,
        padding: '12px 24px 8px',
        background: 'linear-gradient(' + theme.bg + ' 60%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background 0.3s'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 24,
          color: '#8B6F47', letterSpacing: 1, fontWeight: 600
        }}>LuxLibrary</h1>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowThemePicker(!showThemePicker); setShowSearch(false) }}
              style={{
                background: 'none', border: '1px solid ' + theme.border,
                borderRadius: 20, padding: '6px 12px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                color: theme.textSecondary, fontSize: 16
              }}
            >
              {THEME_OPTIONS.find(t => t.key === currentTheme)?.icon}
            </button>

            {showThemePicker && (
              <div style={{
                position: 'absolute', top: 44, right: isRTL ? 'auto' : 0, left: isRTL ? 0 : 'auto',
                background: currentTheme === 'night' ? '#1A1410' : theme.bg,
                border: '1px solid ' + theme.border,
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
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13 }}>{t(lang, opt.key)}</span>
                    {currentTheme === opt.key && (
                      <span style={{ marginLeft: 'auto', color: '#8B6F47', fontSize: 12 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

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
          border: '1px solid ' + theme.border,
          borderRadius: 14, padding: '12px 16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
        }}>
          <input
            autoFocus
            placeholder={t(lang, 'searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', background: 'none', border: 'none',
              outline: 'none', color: theme.text, fontSize: 15,
              direction: isRTL ? 'rtl' : 'ltr'
            }}
          />
        </div>
      )}

      {/* Search Results */}
      {filtered && (
        <div style={{ padding: '160px 24px 0' }}>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: 11, color: '#8B6F47',
            letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16
          }}>{t(lang, 'searchResults')}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {filtered.map(book => (
              <BookCard key={book.id} book={book} onClick={handleBookClick} theme={theme} />
            ))}
            {filtered.length === 0 && (
              <p style={{ color: theme.textMuted, fontSize: 14 }}>{t(lang, 'noBooksFound')}</p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!filtered && (
        <>
          {/* Hero Banner */}
          <div style={{ height: 230, position: 'relative', overflow: 'hidden', marginBottom: 0 }}>
            <img
              src={hero.cover}
              alt={hero.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }}
            />
            {/* Warm glow overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at 30% 50%, rgba(201,169,110,0.08) 0%, transparent 70%)'
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, ' + theme.bg + ' 0%, transparent 45%, rgba(15,12,9,0.7) 100%)'
            }} />
            <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24 }}>
              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: 10, color: '#8B6F47',
                letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8
              }}>{t(lang, 'featuredToday')}</p>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 30,
                color: '#EDE8DF', marginBottom: 6, fontStyle: 'italic',
                lineHeight: 1.2
              }}>{hero.title}</h2>
              <p style={{ fontSize: 13, color: 'rgba(237,232,223,0.55)', marginBottom: 20 }}>
                {hero.author} · {hero.year}
              </p>
              <button
                onClick={() => handleBookClick(hero)}
                style={{
                  background: '#C9A96E', border: 'none', borderRadius: 10,
                  padding: '10px 24px', color: '#0F0C09', fontSize: 13,
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  boxShadow: '0 4px 20px rgba(201,169,110,0.3)'
                }}>{t(lang, 'viewBook')}</button>
            </div>
          </div>

          {/* Categories */}
          <div style={{
            padding: '20px 0 4px',
            background: theme.bg,
            zIndex: 40,
            borderBottom: '1px solid ' + theme.border,
            marginBottom: 28
          }}>
            <div style={{
              display: 'flex', gap: 8, overflowX: 'auto',
              padding: '0 24px 16px', scrollbarWidth: 'none'
            }}>
              {CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id
                const label = cat.label[lang] || cat.label.en
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      flexShrink: 0,
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 20,
                      background: isActive ? '#C9A96E' : theme.bgCard,
                      border: '1px solid ' + (isActive ? '#C9A96E' : theme.border),
                      color: isActive ? '#0F0C09' : theme.textSecondary,
                      fontSize: 12, fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer', fontFamily: 'var(--font-ui)',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}>
                    <span style={{ fontSize: 14 }}>{cat.icon}</span>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Category Results */}
          {categoryBooks && (
            <div style={{ padding: '0 24px' }}>
              {categoryBooks.length === 0 ? (
                <p style={{ color: theme.textMuted, fontSize: 14, fontFamily: 'var(--font-ui)' }}>
                  {lang === 'ar' ? 'لا توجد كتب في هذه الفئة بعد' : lang === 'fr' ? 'Aucun livre dans cette catégorie' : 'No books in this category yet.'}
                </p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {categoryBooks.map(book => (
                    <BookCard key={book.id} book={book} onClick={handleBookClick} theme={theme} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Shelves — only show when no category selected */}
          {!categoryBooks && (
            <div style={{ paddingTop: 8 }}>
              {SHELVES.map(shelf => (
                <Shelf
                  key={shelf.labelKey}
                  labelKey={shelf.labelKey}
                  books={books.filter(shelf.filter)}
                  onBookClick={handleBookClick}
                  theme={theme}
                  lang={lang}
                />
              ))}
            </div>
          )}
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

          <div
            ref={sheetRef}
            onTouchStart={handleSheetTouchStart}
            onTouchMove={handleSheetTouchMove}
            onTouchEnd={handleSheetTouchEnd}
            style={{
              position: 'fixed', bottom: 0, left: '50%',
              transform: 'translateX(-50%) translateY(' + sheetY + 'px)',
              width: '100%', maxWidth: 430, zIndex: 70,
              background: currentTheme === 'night' ? '#1A1410' : theme.bg,
              border: '1px solid ' + theme.border,
              borderRadius: '24px 24px 0 0',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
              animation: sheetY === 0 ? 'slideUp 0.3s ease' : 'none',
              maxHeight: '85vh',
              overflowY: sheetY > 0 ? 'hidden' : 'auto',
              transition: sheetY === 0 ? 'transform 0.3s ease' : 'none',
              touchAction: 'none',
              direction: isRTL ? 'rtl' : 'ltr'
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
                  border: '1px solid ' + theme.border, flexShrink: 0
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: 10, color: '#8B6F47', letterSpacing: 2,
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
            }}>{getSummary(selectedBook)}</p>

            <div style={{
              display: 'flex', justifyContent: 'space-around',
              background: theme.bgCard, border: '1px solid ' + theme.border,
              borderRadius: 14, margin: '0 24px 24px', padding: 16
            }}>
              {[[t(lang, 'pages'), selectedBook.pages], [t(lang, 'loan'), t(lang, 'loanDays')], [t(lang, 'cost'), t(lang, 'cost')]].map(([label, value]) => (
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

            <div style={{ padding: '0 24px 160px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => { navigate('bookcard', { book: selectedBook }); closeSheet() }}
                style={{
                  width: '100%', padding: '16px 0',
                  background: '#1a6bff', border: 'none', borderRadius: 14,
                  color: '#fff', fontSize: 16, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  boxShadow: '0 8px 24px rgba(26,107,255,0.3)'
                }}>{t(lang, 'borrowBtn')}</button>

              <button
                onClick={() => toggleReadLater(selectedBook.id)}
                style={{
                  width: '100%', padding: '14px 0',
                  background: isBookSaved(selectedBook.id) ? 'rgba(201,169,110,0.12)' : 'none',
                  border: '1px solid ' + (isBookSaved(selectedBook.id) ? '#C9A96E' : theme.border),
                  borderRadius: 14,
                  color: isBookSaved(selectedBook.id) ? '#C9A96E' : theme.textSecondary,
                  fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)'
                }}>
                {isBookSaved(selectedBook.id) ? '🔖 ' + t(lang, 'savedForLater') : '🔖 ' + t(lang, 'saveForLater')}
              </button>

              <p style={{
                textAlign: 'center', fontSize: 11,
                color: theme.textMuted, fontFamily: 'var(--font-ui)'
              }}>{t(lang, 'borrowNote')}</p>
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