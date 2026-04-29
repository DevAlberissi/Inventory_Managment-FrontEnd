import { useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { Button, Card, AuthLayout, IconBox, Alert } from '../components'
import { authService } from '../services/auth.service'

const TOTAL_DIGITS = 4

const maskPhone = (phone) => {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 8) return phone
  return `(**) *****-${digits.slice(-4)}`
}

const VerificacaoWhatsApp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const phone = location.state?.phone ?? ''
  const email = location.state?.email ?? ''

  const [digits, setDigits] = useState(Array(TOTAL_DIGITS).fill(''))
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [error, setError] = useState('')
  const inputRefs = useRef([])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleChange = (index, value) => {
    const char = value.replace(/\D/g, '').slice(-1)
    setError('')
    setDigits(prev => {
      const next = [...prev]
      next[index] = char
      return next
    })
    if (char && index < TOTAL_DIGITS - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, TOTAL_DIGITS)
    setDigits(prev => {
      const next = [...prev]
      pasted.split('').forEach((char, i) => { next[i] = char })
      return next
    })
    inputRefs.current[Math.min(pasted.length, TOTAL_DIGITS - 1)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < TOTAL_DIGITS) return

    setIsLoading(true)
    setError('')
    try {
      await authService.activate(email, code)
      navigate('/login')
    } catch {
      setError('Código inválido. Verifique e tente novamente.')
      setDigits(Array(TOTAL_DIGITS).fill(''))
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return
    setCooldown(60)
    try {
      await authService.resendWhatsApp(phone)
    } catch {
      // silent — user can retry after cooldown
    }
  }

  const isComplete = digits.every(d => d !== '')

  return (
    <AuthLayout maxWidth={420}>
      <Card padding={36} style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <IconBox icon={<MessageCircle />} tone="accent" size={56} />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#020617', margin: '0 0 8px' }}>Verificação</h1>
        <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
          Enviamos um código de 4 dígitos via WhatsApp para
          {phone && (
            <>
              <br />
              <strong style={{ color: '#020617' }}>{maskPhone(phone)}</strong>
            </>
          )}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }} onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                autoFocus={i === 0}
                style={{
                  width: 56, height: 64, textAlign: 'center', fontSize: 26, fontWeight: 700,
                  borderRadius: 12,
                  border: `2px solid ${error ? '#DC2626' : d ? '#6366F1' : '#E2E8F0'}`,
                  background: error ? '#FEE2E2' : d ? '#EEF2FF' : '#F8FAFC',
                  outline: 'none', color: '#020617', transition: 'all .2s ease',
                }}
              />
            ))}
          </div>

          {error && (
            <div style={{ marginBottom: 16 }}>
              <Alert tone="error" message={error} />
            </div>
          )}

          <Button
            variant="primary"
            full
            disabled={!isComplete || isLoading}
            style={!isComplete || isLoading ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            {isLoading ? 'Verificando...' : 'Confirmar código'}
          </Button>
        </form>

        <div style={{ marginTop: 22, fontSize: 13, color: '#64748B' }}>
          Não recebeu?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: cooldown > 0 ? '#94A3B8' : '#6366F1',
              fontWeight: 600, fontSize: 13, cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar código'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate('/cadastrar')}
          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 13, marginTop: 14 }}
        >
          ← Voltar para o cadastro
        </button>
      </Card>
    </AuthLayout>
  )
}

export default VerificacaoWhatsApp
