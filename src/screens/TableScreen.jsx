import { useState, useEffect } from 'react'
import { books } from '../data/books'

export default function TableScreen({ navigate }) {
  const [borrowedBooks, setBorrowedBooks] = useState([])

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
    if (confirm('Return this book to the library?')) {
      localStorage.removeItem(`book_${bookId}`)
      loadBorrowedBooks()
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '56px 24px 32px' }}>
        <p style={{
          fontSize: 10, color: 'var(--gold)', letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 10,
          fontFamily: 'var(--font-ui)'
        }}>Your Collection</p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 32,
          color: 'var(--text-primary)', fontStyle: 'italic', margin: 0
        }}>My Table</h1>
      </div>

      {borrowedBooks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 40px' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 32
          }}>📚</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 22,
            color: 'var(--text-primary)', marginBottom: 10, fontStyle: 'italic'
          }}>Your table is empty</h2>
          <p style={{
            fontSize: 14, color: 'var(--text-muted)',
            marginBottom: 32, fontFamily: 'var(--font-ui)', lineHeight: 1.6
          }}>Visit the library and borrow your first book. It will appear here.</p>
          <button onClick={() => navigate('entrance')} style={{
            background: 'var(--gold)', border: 'none', borderRadius: 12,
            padding: '14px 32px', color: '#0F0C09', fontSize: 14,
            fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)'
          }}>Browse Library</button>
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
                background: 'var(--bg-card)',
                border: `1px solid ${expired ? 'rgba(255,80,80,0.2)' : 'var(--border)'}`,
                borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}>
                <div style={{ display: 'flex', padding: 16, gap: 16 }}>
                  {/* Cover */}
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

                  {/* Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{
                        fontSize: 9, color: 'var(--gold)', letterSpacing: 2,
                        textTransform: 'uppercase', marginBottom: 6,
                        fontFamily: 'var(--font-ui)'
                      }}>{book.era} · {book.language}</p>
                      <h3 style={{
                        fontFamily: 'var(--font-display)', fontSize: 16,
                        color: 'var(--text-primary)', marginBottom: 4,
                        lineHeight: 1.3, fontStyle: 'italic'
                      }}>{book.title}</h3>
                      <p style={{
                        fontSize: 12, color: 'var(--text-muted)',
                        fontFamily: 'var(--font-ui)', marginBottom: 10
                      }}>{book.author}</p>

                      {expired ? (
                        <span style={{
                          fontSize: 11, color: '#ff6b6b',
                          background: 'rgba(255,80,80,0.12)',
                          borderRadius: 6, padding: '4px 10px',
                          fontFamily: 'var(--font-ui)'
                        }}>🔒 Loan Expired</span>
                      ) : (
                        <span style={{
                          fontSize: 11, color: 'var(--gold)',
                          background: 'rgba(201,169,110,0.1)',
                          borderRadius: 6, padding: '4px 10px',
                          fontFamily: 'var(--font-ui)'
                        }}>⏳ {book.daysLeft} day{book.daysLeft !== 1 ? 's' : ''} left</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {!expired && progress > 0 && (
                  <div style={{ padding: '0 16px 8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Reading progress</p>
                      <p style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'var(--font-ui)' }}>{progress}%</p>
                    </div>
                    <div style={{ height: 2, background: 'var(--border)', borderRadius: 2 }}>
                      <div style={{
                        height: '100%', width: `${progress}%`,
                        background: 'var(--gold)', borderRadius: 2,
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{
                  display: 'flex', gap: 10, padding: '12px 16px 16px',
                  borderTop: '1px solid var(--border)'
                }}>
                  {expired ? (
                    <button style={{
                      flex: 1, padding: '10px 0',
                      background: 'rgba(201,169,110,0.12)',
                      border: '1px solid rgba(201,169,110,0.2)',
                      borderRadius: 10, color: 'var(--gold)',
                      fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'var(--font-ui)'
                    }}>Watch Ad to Renew</button>
                  ) : (
                    <button
                      onClick={() => navigate('reader', { book })}
                      style={{
                        flex: 1, padding: '10px 0',
                        background: 'var(--blue)', border: 'none',
                        borderRadius: 10, color: '#fff',
                        fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'var(--font-ui)',
                        boxShadow: '0 4px 12px rgba(26,107,255,0.3)'
                      }}>Continue Reading</button>
                  )}
                  <button
                    onClick={() => handleReturn(book.id)}
                    style={{
                      padding: '10px 16px',
                      background: 'none',
                      border: '1px solid var(--border)',
                      borderRadius: 10, color: 'var(--text-muted)',
                      fontSize: 12, cursor: 'pointer',
                      fontFamily: 'var(--font-ui)'
                    }}>Return</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}