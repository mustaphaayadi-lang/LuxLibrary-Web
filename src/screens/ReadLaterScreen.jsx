import { useState, useEffect } from 'react'
import { books } from '../data/books'

export default function ReadLaterScreen({ navigate, theme }) {
  const [readLater, setReadLater] = useState([])

  useEffect(() => {
    load()
  }, [])

  const load = () => {
    const saved = JSON.parse(localStorage.getItem('lux_read_later') || '[]')
    const result = books.filter(b => saved.includes(b.id))
    setReadLater(result)
  }

  const remove = (bookId) => {
    const saved = JSON.parse(localStorage.getItem('lux_read_later') || '[]')
    const updated = saved.filter(id => id !== bookId)
    localStorage.setItem('lux_read_later', JSON.stringify(updated))
    load()
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: 100, transition: 'background 0.3s' }}>

      {/* Header */}
      <div style={{ padding: '56px 24px 32px' }}>
        <p style={{
          fontSize: 10, color: '#C9A96E', letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 10,
          fontFamily: 'var(--font-ui)'
        }}>Your Wishlist</p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 32,
          color: theme.text, fontStyle: 'italic', margin: 0
        }}>Read Later</h1>
      </div>

      {readLater.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 40px' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 32
          }}>🔖</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 22,
            color: theme.text, marginBottom: 10, fontStyle: 'italic'
          }}>Nothing saved yet</h2>
          <p style={{
            fontSize: 14, color: theme.textMuted,
            marginBottom: 32, fontFamily: 'var(--font-ui)', lineHeight: 1.6
          }}>Browse the library and save books you want to read later.</p>
          <button onClick={() => navigate('entrance')} style={{
            background: '#C9A96E', border: 'none', borderRadius: 12,
            padding: '14px 32px', color: '#0F0C09', fontSize: 14,
            fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)'
          }}>Browse Library</button>
        </div>
      ) : (
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {readLater.map(book => (
            <div key={book.id} style={{
              display: 'flex', gap: 16,
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 20, padding: 16,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              <img src={book.cover} alt={book.title} style={{
                width: 80, height: 120, objectFit: 'cover',
                borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                flexShrink: 0
              }} />
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
                    fontFamily: 'var(--font-ui)', marginBottom: 8
                  }}>{book.author} · {book.pages}p</p>
                  <p style={{
                    fontSize: 12, color: theme.textSecondary,
                    fontFamily: 'var(--font-body)', fontStyle: 'italic',
                    lineHeight: 1.6,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                  }}>{book.summary}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => navigate('bookcard', { book })}
                    style={{
                      flex: 1, padding: '10px 0',
                      background: '#1a6bff', border: 'none',
                      borderRadius: 10, color: '#fff',
                      fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'var(--font-ui)'
                    }}>Borrow Now</button>
                  <button
                    onClick={() => remove(book.id)}
                    style={{
                      padding: '10px 16px',
                      background: 'none',
                      border: `1px solid ${theme.border}`,
                      borderRadius: 10, color: theme.textMuted,
                      fontSize: 12, cursor: 'pointer',
                      fontFamily: 'var(--font-ui)'
                    }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}