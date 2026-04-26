import { useState } from 'react'

const STEPS = [
  {
    id: 'languages',
    question: 'Which languages do you enjoy?',
    subtitle: 'We will curate your shelves accordingly',
    multi: true,
    options: [
      { value: 'English', emoji: '🇬🇧', label: 'English' },
      { value: 'French', emoji: '🇫🇷', label: 'French' },
      { value: 'Russian', emoji: '🇷🇺', label: 'Russian' },
      { value: 'All', emoji: '🌍', label: 'All Languages' },
    ]
  },
  {
    id: 'eras',
    question: 'Which eras interest you?',
    subtitle: 'Your taste in time defines your shelf',
    multi: true,
    options: [
      { value: 'Classic', emoji: '🏛️', label: 'Classic' },
      { value: 'Victorian', emoji: '🎩', label: 'Victorian' },
      { value: 'Modern', emoji: '✨', label: 'Modern' },
      { value: 'All', emoji: '📚', label: 'All Eras' },
    ]
  },
  {
    id: 'time',
    question: 'How long do you read per day?',
    subtitle: 'We will suggest the right book length',
    multi: false,
    options: [
      { value: '15', emoji: '⚡', label: '15 minutes' },
      { value: '30', emoji: '🕯️', label: '30 minutes' },
      { value: '60', emoji: '📖', label: '1 hour' },
      { value: '60+', emoji: '🌙', label: 'More than 1 hour' },
    ]
  },
]

export default function OnboardingScreen({ onFinish }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ languages: [], eras: [], time: null })

  const current = STEPS[step]

  const toggle = (value) => {
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
    if (current.multi) return answers[current.id].includes(value)
    return answers[current.id] === value
  }

  const canProceed = () => {
    if (current.multi) return answers[current.id].length > 0
    return answers[current.id] !== null
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      localStorage.setItem('lux_preferences', JSON.stringify(answers))
      localStorage.setItem('lux_onboarded', 'true')
      onFinish(answers)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      padding: '60px 24px 40px',
      maxWidth: 430, margin: '0 auto'
    }}>

      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 28,
        color: 'var(--gold)', letterSpacing: 1,
        marginBottom: 48, fontStyle: 'italic'
      }}>LuxLibrary</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            height: 3, flex: 1, borderRadius: 2,
            background: i <= step ? 'var(--gold)' : 'rgba(255,235,200,0.1)',
            transition: 'background 0.3s'
          }} />
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: 10, color: 'var(--gold)', letterSpacing: 3,
          textTransform: 'uppercase', marginBottom: 12,
          fontFamily: 'var(--font-ui)'
        }}>Step {step + 1} of {STEPS.length}</p>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 26,
          color: 'var(--text-primary)', marginBottom: 10,
          lineHeight: 1.3, fontStyle: 'italic'
        }}>{current.question}</h2>

        <p style={{
          fontSize: 14, color: 'var(--text-muted)',
          marginBottom: 40, fontFamily: 'var(--font-ui)'
        }}>{current.subtitle}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {current.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px', borderRadius: 16,
                background: isSelected(opt.value) ? 'rgba(201,169,110,0.12)' : 'var(--bg-card)',
                border: `1px solid ${isSelected(opt.value) ? 'var(--gold)' : 'var(--border)'}`,
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: 24 }}>{opt.emoji}</span>
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: 15,
                color: isSelected(opt.value) ? 'var(--gold)' : 'var(--text-primary)',
                fontWeight: isSelected(opt.value) ? 500 : 400
              }}>{opt.label}</span>
              {isSelected(opt.value) && (
                <span style={{ marginLeft: 'auto', color: 'var(--gold)', fontSize: 16 }}>✓</span>
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
            background: canProceed() ? 'var(--gold)' : 'rgba(201,169,110,0.15)',
            border: 'none', borderRadius: 14,
            color: canProceed() ? '#0F0C09' : 'var(--text-muted)',
            fontSize: 16, fontWeight: 600,
            cursor: canProceed() ? 'pointer' : 'default',
            fontFamily: 'var(--font-ui)', transition: 'all 0.2s'
          }}>
          {step < STEPS.length - 1 ? 'Continue →' : 'Enter the Library →'}
        </button>

        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            width: '100%', padding: '12px 0', marginTop: 12,
            background: 'none', border: 'none',
            color: 'var(--text-muted)', fontSize: 14,
            cursor: 'pointer', fontFamily: 'var(--font-ui)'
          }}>← Back</button>
        )}
      </div>
    </div>
  )
}