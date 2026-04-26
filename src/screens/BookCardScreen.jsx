export default function BookCardScreen({ book, navigate }) {
  const handleBorrow = () => {
    const checkoutData = {
      bookId: book.id,
      checkoutDate: new Date().toISOString(),
      progress: 0,
    }
    localStorage.setItem(`book_${book.id}`, JSON.stringify(checkoutData))
    navigate('table')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 120 }}>

      <button onClick={() => navigate('entrance')} style={{
        position: 'fixed', top: 52, left: 24, zIndex: 10,
        background: 'none', border: 'none', color: 'var(--gold)',
        fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-ui)'
      }}>← Library</button>

      <div style={{ height: 380, position: 'relative', overflow: 'hidden' }}>
        <img src={book.cover} alt={book.title} style={{
          width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg) 0%, transparent 50%, rgba(15,12,9,0.7) 100%)'
        }} />
        <div style={{
          position: 'absolute', bottom: -50, left: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          borderRadius: 10, overflow: 'hidden',
          border: '1px solid var(--border)'
        }}>
          <img src={book.cover} alt={book.title} style={{ width: 100, height: 150, objectFit: 'cover', display: 'block' }} />
        </div>
      </div>

      <div style={{ padding: '64px 24px 0' }}>
        <p style={{
          fontSize: 10, color: 'var(--gold)', letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 10, fontFamily: 'var(--font-ui)'
        }}>{book.era} · {book.language}</p>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 30,
          color: 'var(--text-primary)', marginBottom: 8,
          lineHeight: 1.2, fontStyle: 'italic'
        }}>{book.title}</h1>

        <p style={{
          fontSize: 14, color: 'var(--text-secondary)',
          marginBottom: 28, fontFamily: 'var(--font-ui)'
        }}>{book.author} · {book.year}</p>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 28 }} />

        <p style={{
          fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2,
          textTransform: 'uppercase', marginBottom: 12, fontFamily: 'var(--font-ui)'
        }}>About this book</p>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 15,
          color: 'var(--text-secondary)', lineHeight: 1.8,
          marginBottom: 32, fontStyle: 'italic'
        }}>{book.summary}</p>

        <div style={{
          display: 'flex', justifyContent: 'space-around',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 20, marginBottom: 32
        }}>
          {[['Pages', book.pages], ['Loan Period', '21 Days'], ['Cost', 'Free']].map(([label, value]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)', marginBottom: 4 }}>{value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, padding: '16px 24px 36px',
        background: 'linear-gradient(transparent, var(--bg) 30%)', textAlign: 'center'
      }}>
        <button onClick={handleBorrow} style={{
          width: '100%', padding: '16px 0',
          background: 'var(--blue)', border: 'none', borderRadius: 14,
          color: '#fff', fontSize: 16, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'var(--font-ui)', marginBottom: 10,
          boxShadow: '0 8px 24px rgba(26,107,255,0.3)'
        }}>Borrow for 21 Days</button>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
          1 short ad · your progress saved for 21 days
        </p>
      </div>
    </div>
  )
}