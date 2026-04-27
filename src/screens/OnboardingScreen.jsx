import { useState } from 'react'
import { t } from '../data/translations'

const APP_LANGUAGES = [
  { value: 'en', emoji: '🇬🇧', label: 'English' },
  { value: 'fr', emoji: '🇫🇷', label: 'Français' },
  { value: 'ar', emoji: '🇸🇦', label: 'العربية' },
]

export default function OnboardingScreen({ onFinish, lang, changeLang }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    appLang: lang || 'en',
    languages: [],
    eras: [],
    time: null
  })

  const currentLang = answers.appLang || 'en'

  const STEPS = [
    {
      id: 'appLang',
      question: 'Choose your language / Choisissez votre langue / اختر لغتك',
      subtitle: '',
      multi: false,
      options: APP_LANGUAGES
    },
    {
      id: 'languages',
      question: t(currentLang, 'langQuestion2'),
      subtitle: t(currentLang, 'langSubtitle2'),
      multi: true,
      options: [
        { value: 'English', emoji: '🇬🇧', label: t(currentLang, 'english') },
        { value: 'French', emoji: '🇫🇷', label: t(currentLang, 'french') },
        { value: 'Russian', emoji: '🇷🇺', label: t(currentLang, 'russian') },
        { value: 'All', emoji: '🌍', label: step === 0 ? 'All' : t(currentLang, 'english') },
      ]
    },
    {
      id: 'eras',
      question: t(currentLang, 'eraQuestion'),
      subtitle: t(currentLang, 'eraSubtitle'),
      multi: true,
      options: [
        { value: 'Classic', emoji: '🏛️', label: 'Classic' },
        { value: 'Victorian', emoji: '🎩', label: 'Victorian' },
        { value: 'Modern', emoji: '✨', label: 'Modern' },
        { value: 'All', emoji: '📚', label: 'All' },
      ]
    },
    {
      id: 'time',
      question: t(currentLang, 'timeQuestion'),
      subtitle: t(currentLang, 'timeSubtitle'),
      multi: false,
      options: [
        { value: '15', emoji: '⚡', label: '15 min' },
        { value: '30', emoji: '🕯️', label: '30 min' },
        { value: '60', emoji: '📖', label: '1 ' + (currentLang === 'ar' ? 'ساعة' : currentLang === 'fr' ? 'heure' : 'hour') },
        { value: '60+', emoji: '🌙', label: currentLang === 'ar' ? 'أكثر من ساعة' : currentLang === 'fr' ? 'Plus d\'1 heure' : 'More than 1 hour' },
      ]
    },
  ]

  const current = STEPS[step]
  const isRTL = currentLang === 'ar'

  const toggle = (value) => {
    if (current.id === 'appLang') {
      setAnswers(a => ({ ...a, appLang: value }))
      changeLang(value)
      return
    }
    if (current.multi) {
      const key = current.id
      const current_values = answers[key]
      if (value === 'All') {
        setAnswers(a => ({ ...a, [key]: ['All'] }))
      } else {
        const without_all = current_values.filter(v => v !== 'All')
        if (without_all.includes(value)) {
          setAnswers(a => ({ ...a, [key]: without_all.filter(v => v !== value) }))
        } else {
          setAnswers(a => ({ ...a, [key]: [...without_all, value] }))
        }
      }
    } else {
      setAnswers(a => ({ ...a, [current.id]: value }))
    }
  }

  const isSelected = (value) => {
    if (current.id === 'appLang') return answers.appLang === value
    if (current.multi) return answers[current.id].includes(value)
    return answers[current.id] === value
  }

  const canProceed = () => {
    if (current.id === 'appLang') return true
    if (current.multi) return answers[current.id].length > 0
    return answers[current.id] !== null
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      localStorage.setItem('lux_preferences', JSON.stringify(answers))
      localStorage.setItem('lux_onboarded', 'true')
      localStorage.setItem('lux_lang', answers.appLang)
      onFinish(answers)
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

      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 28,
        color: '#C9A96E', letterSpacing: 1,
        marginBottom: 48, fontStyle: 'italic'
      }}>LuxLibrary</h1>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            height: 3, flex: 1, borderRadius: 2,
            background: i <= step ? '#C9A96E' : 'rgba(255,235,200,0.1)',
            transition: 'background 0.3s'
          }} />
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: 10, color: '#C9A96E', letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 12,
          fontFamily: 'var(--font-ui)'
        }}>{t(currentLang, 'step')} {step + 1} {t(currentLang, 'of')} {STEPS.length}</p>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 24,
          color: '#EDE8DF', marginBottom: 10,
          lineHeight: 1.3, fontStyle: 'italic'
        }}>{current.question}</h2>

        {current.subtitle && (
          <p style={{
            fontSize: 14, color: 'rgba(237,232,223,0.35)',
            marginBottom: 40, fontFamily: 'var(--font-ui)'
          }}>{current.subtitle}</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: current.subtitle ? 0 : 40 }}>
          {current.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px', borderRadius: 16,
                background: isSelected(opt.value) ? 'rgba(201,169,110,0.12)' : 'rgba(255,235,200,0.04)',
                border: `1px solid ${isSelected(opt.value) ? '#C9A96E' : 'rgba(255,235,200,0.08)'}`,
                cursor: 'pointer', textAlign: isRTL ? 'right' : 'left',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: 24 }}>{opt.emoji}</span>
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: 15,
                color: isSelected(opt.value) ? '#C9A96E' : '#EDE8DF',
                fontWeight: isSelected(opt.value) ? 500 : 400
              }}>{opt.label}</span>
              {isSelected(opt.value) && (
                <span style={{ marginLeft: isRTL ? 0 : 'auto', marginRight: isRTL ? 'auto' : 0, color: '#C9A96E', fontSize: 16 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          style={{
            width: '100%', padding: '16px 0',
            background: canProceed() ? '#C9A96E' : 'rgba(201,169,110,0.15)',
            border: 'none', borderRadius: 14,
            color: canProceed() ? '#0F0C09' : 'rgba(237,232,223,0.3)',
            fontSize: 16, fontWeight: 600,
            cursor: canProceed() ? 'pointer' : 'default',
            fontFamily: 'var(--font-ui)', transition: 'all 0.2s'
          }}>
          {step < STEPS.length - 1 ? t(currentLang, 'continue') : t(currentLang, 'enterLibrary')}
        </button>

        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            width: '100%', padding: '12px 0', marginTop: 12,
            background: 'none', border: 'none',
            color: 'rgba(237,232,223,0.3)', fontSize: 14,
            cursor: 'pointer', fontFamily: 'var(--font-ui)'
          }}>{t(currentLang, 'back')}</button>
        )}
      </div>
    </div>
  )
}