import { useState, useEffect } from 'react'
import { books } from '../data/books'
import { t } from '../data/translations'

export default function TableScreen({ navigate, theme, lang }) {
  const [borrowedBooks, setBorrowedBooks] = useState([])
  const isRTL = lang === 'ar'

  useEffect(() => {
    loadBorrowedBooks()
  }, [])

  const loadBorrowedBooks = () => {
    const result = []
    for (const book of books) {
      const data = localStorage.getItem(`book_${book.id}`)
      if (data) {
        const parsed = JSON.parse(data)
        const checkout = new Date(parsed.checkoutDate)
        const now = new Date()
        const daysLeft = 21 - Math.floor((now - checkout) / (1000 * 60 * 60 * 24))
        result.push({ ...book, ...parsed, daysLeft })
      }
    }
    setBorrowedBooks(result)
  }

  const handleReturn = (bookId) => {
    if (confirm(t(lang, 'returnConfirm'))) {
      localStorage.removeItem(`book_${bookId}`)
      loadBorrowedBooks()
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: theme.bg,
      paddingBottom: 100, direction: isRTL ? 'rtl' : 'ltr'
    }}>

      {/* Header */}
      <div style={{ padding: '56px 24px 32px' }}>
        <p style={{
          fontSize: 10, color: '#C9A96E', letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 10,
          fontFamily: 'var(--font-ui)'
        }}>{t(lang, 'yourCollection')}</p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 32,
          color: theme.text, fontStyle: 'italic', margin: 0
        }}>{t(lang, 'myTableTitle')}</h1>
      </div>

      {borrowedBooks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 40px' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 32
          }}>📚</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 22,
            color: theme.text, marginBottom: 10, fontStyle: 'italic'
          }}>{t(lang, 'tableEmpty')}</h2>
          <p style={{
            fontSize: 14, color: theme.textMuted,
            marginBottom: 32, fontFamily: 'var(--font-ui)', lineHeight: 1.6
          }}>{t(lang, 'tableEmptyDesc')}</p>
          <button onClick={() => navigate('entrance')} style={{
            background: '#C9A96E', border: 'none', borderRadius: 12,
            padding: '14px 32px', color: '#0F0C09', fontSize: 14,
            fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)'
          }}>{t(lang, 'browseLibrary')}</button>
        </div>
      ) : (
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {borrowedBooks.map(book => {
            const expired = book.daysLeft <= 0
            const progress = book.currentPage && book.pages
              ? Math.round((book.currentPage / book.pages) * 100)
              : 0

            return (
              <div key={book.id} style={{
                background: theme.bgCard,
                border: `1px solid ${expired ? 'rgba(255,80,80,0.2)' : theme.border}`,
                borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}>
                <div style={{ display: 'flex', padding: 16, gap: 16 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={book.cover} alt={book.title} style={{
                      width: 80, height: 120, objectFit: 'cover',
                      borderRadius: 8, display: 'block',
                      filter: expired ? 'grayscale(100%)' : 'none',
                      opacity: expired ? 0.4 : 1,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                    }} />
                    {expired && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        borderRadius: 8, display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: 20 }}>🔒</span>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{
                        fontSize: 9, color: '#C9A96E', letterSpacing: 2,
                        textTransform: 'uppercase', marginBottom: 6,
                        fontFamily: 'var(--font-ui)'
                      }}>{book.era} · {book.language}</p>
                      <h3 style={{
                        fontFamily: 'var(--font-display)', fontSize: 16,
                        color: theme.text, marginBottom: 4,
                        lineHeight: 1.3, fontStyle: 'italic'
                      }}>{book.title}</h3>
                      <p style={{
                        fontSize: 12, color: theme.textMuted,
                        fontFamily: 'var(--font-ui)', marginBottom: 10
                      }}>{book.author}</p>

                      {expired ? (
                        <span style={{
                          fontSize: 11, color: '#ff6b6b',
                          background: 'rgba(255,80,80,0.12)',
                          borderRadius: 6, padding: '4px 10px',
                          fontFamily: 'var(--font-ui)'
                        }}>🔒 {t(lang, 'loanExpired')}</span>
                      ) : (
                        <span style={{
                          fontSize: 11, color: '#C9A96E',
                          background: 'rgba(201,169,110,0.1)',
                          borderRadius: 6, padding: '4px 10px',
                          fontFamily: 'var(--font-ui)'
                        }}>⏳ {book.daysLeft} {book.daysLeft !== 1 ? t(lang, 'daysLeft') : t(lang, 'dayLeft')}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {!expired && progress > 0 && (
                  <div style={{ padding: '0 16px 8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <p style={{ fontSize: 10, color: theme.textMuted, fontFamily: 'var(--font-ui)', margin: 0 }}>{t(lang, 'readingProgress')}</p>
                      <p style={{ fontSize: 10, color: '#C9A96E', fontFamily: 'var(--font-ui)', margin: 0 }}>{progress}%</p>
                    </div>
                    <div style={{ height: 2, background: theme.border, borderRadius: 2 }}>
                      <div style={{
                        height: '100%', width: `${progress}%`,
                        background: '#C9A96E', borderRadius: 2,
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{
                  display: 'flex', gap: 10, padding: '12px 16px 16px',
                  borderTop: `1px solid ${theme.border}`
                }}>
                  {expired ? (
                    <button style={{
                      flex: 1, padding: '10px 0',
                      background: 'rgba(201,169,110,0.12)',
                      border: '1px solid rgba(201,169,110,0.2)',
                      borderRadius: 10, color: '#C9A96E',
                      fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'var(--font-ui)'
                    }}>{t(lang, 'watchAdRenew')}</button>
                  ) : (
                    <button
                      onClick={() => navigate('reader', { book })}
                      style={{
                        flex: 1, padding: '10px 0',
                        background: '#1a6bff', border: 'none',
                        borderRadius: 10, color: '#fff',
                        fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'var(--font-ui)',
                        boxShadow: '0 4px 12px rgba(26,107,255,0.3)'
                      }}>{t(lang, 'continueReading')}</button>
                  )}
                  <button
                    onClick={() => handleReturn(book.id)}
                    style={{
                      padding: '10px 16px',
                      background: 'none',
                      border: `1px solid ${theme.border}`,
                      borderRadius: 10, color: theme.textMuted,
                      fontSize: 12, cursor: 'pointer',
                      fontFamily: 'var(--font-ui)'
                    }}>{t(lang, 'returnBook')}</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}