import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { t } from '../data/translations'

export default function AuthScreen({ onAuth, lang, theme }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const isRTL = lang === 'ar'

  const handleAuth = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username }
          }
        })
        if (error) throw error
        setSuccess('Account created! Please check your email to confirm.')
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
        onAuth(data.user)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0F0C09',
      display: 'flex', flexDirection: 'column',
      padding: '60px 24px 40px',
      maxWidth: 430, margin: '0 auto',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 32,
          color: '#C9A96E', letterSpacing: 1, fontStyle: 'italic', margin: 0
        }}>LuxLibrary</h1>
        <p style={{
          fontSize: 13, color: 'rgba(237,232,223,0.35)',
          fontFamily: 'var(--font-ui)', marginTop: 8
        }}>
          {lang === 'ar' ? 'غرفة قراءتك الخاصة' : lang === 'fr' ? 'Votre salle de lecture privée' : 'Your private reading room'}
        </p>
      </div>

      {/* Mode Toggle */}
      <div style={{
        display: 'flex', background: 'rgba(255,235,200,0.04)',
        border: '1px solid rgba(255,235,200,0.08)',
        borderRadius: 14, padding: 4, marginBottom: 32
      }}>
        {['login', 'register'].map(m => (
          <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{
            flex: 1, padding: '10px 0',
            background: mode === m ? '#C9A96E' : 'none',
            border: 'none', borderRadius: 10,
            color: mode === m ? '#0F0C09' : 'rgba(237,232,223,0.4)',
            fontSize: 13, fontWeight: mode === m ? 600 : 400,
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            transition: 'all 0.2s'
          }}>
            {m === 'login'
              ? (lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Connexion' : 'Sign In')
              : (lang === 'ar' ? 'إنشاء حساب' : lang === 'fr' ? 'Créer un compte' : 'Register')}
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>

        {mode === 'register' && (
          <div style={{
            background: 'rgba(255,235,200,0.04)',
            border: '1px solid rgba(255,235,200,0.08)',
            borderRadius: 12, padding: '12px 16px'
          }}>
            <p style={{ fontSize: 10, color: '#C9A96E', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'var(--font-ui)', marginBottom: 6 }}>
              {lang === 'ar' ? 'الاسم' : lang === 'fr' ? 'Nom' : 'Username'}
            </p>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={lang === 'ar' ? 'اسمك' : lang === 'fr' ? 'Votre nom' : 'Your name'}
              style={{
                width: '100%', background: 'none', border: 'none',
                outline: 'none', color: '#EDE8DF', fontSize: 15,
                fontFamily: 'var(--font-ui)'
              }}
            />
          </div>
        )}

        <div style={{
          background: 'rgba(255,235,200,0.04)',
          border: '1px solid rgba(255,235,200,0.08)',
          borderRadius: 12, padding: '12px 16px'
        }}>
          <p style={{ fontSize: 10, color: '#C9A96E', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'var(--font-ui)', marginBottom: 6 }}>
            {lang === 'ar' ? 'البريد الإلكتروني' : lang === 'fr' ? 'Email' : 'Email'}
          </p>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            style={{
              width: '100%', background: 'none', border: 'none',
              outline: 'none', color: '#EDE8DF', fontSize: 15,
              fontFamily: 'var(--font-ui)'
            }}
          />
        </div>

        <div style={{
          background: 'rgba(255,235,200,0.04)',
          border: '1px solid rgba(255,235,200,0.08)',
          borderRadius: 12, padding: '12px 16px'
        }}>
          <p style={{ fontSize: 10, color: '#C9A96E', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'var(--font-ui)', marginBottom: 6 }}>
            {lang === 'ar' ? 'كلمة المرور' : lang === 'fr' ? 'Mot de passe' : 'Password'}
          </p>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            style={{
              width: '100%', background: 'none', border: 'none',
              outline: 'none', color: '#EDE8DF', fontSize: 15,
              fontFamily: 'var(--font-ui)'
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: 13, color: '#ff6b6b', fontFamily: 'var(--font-ui)', textAlign: 'center' }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ fontSize: 13, color: '#C9A96E', fontFamily: 'var(--font-ui)', textAlign: 'center' }}>
            {success}
          </p>
        )}

        <button
          onClick={handleAuth}
          disabled={loading}
          style={{
            width: '100%', padding: '16px 0', marginTop: 8,
            background: loading ? 'rgba(201,169,110,0.3)' : '#C9A96E',
            border: 'none', borderRadius: 14,
            color: '#0F0C09', fontSize: 16, fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
            fontFamily: 'var(--font-ui)'
          }}>
          {loading
            ? '...'
            : mode === 'login'
              ? (lang === 'ar' ? 'دخول' : lang === 'fr' ? 'Se connecter' : 'Sign In')
              : (lang === 'ar' ? 'إنشاء الحساب' : lang === 'fr' ? 'Créer mon compte' : 'Create Account')}
        </button>

        {/* Skip for now */}
        <button
          onClick={() => onAuth(null)}
          style={{
            background: 'none', border: 'none',
            color: 'rgba(237,232,223,0.25)', fontSize: 12,
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            textAlign: 'center', marginTop: 8
          }}>
          {lang === 'ar' ? 'تخطي في الوقت الحالي' : lang === 'fr' ? 'Passer pour l\'instant' : 'Skip for now'}
        </button>
      </div>
    </div>
  )
}