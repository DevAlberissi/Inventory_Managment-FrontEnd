import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Mail, Lock } from 'lucide-react'
import { Button, Card, Field, AuthLayout, IconBox, Alert, IconInput, Navbar } from '../components'
import { authService } from '../services/auth.service'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authService.login(email, password)
      login(data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <AuthLayout>
      <Card padding={36} style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <IconBox icon={<Package />} tone="accent" size={56} />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#020617', margin: '0 0 6px' }}>Login</h1>
        <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 24px' }}>Acesse sua conta StockHub</p>

        <Alert tone="error" message={error} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left', marginTop: error ? 16 : 0 }}>
          <Field label="Email">
            <IconInput
              icon={<Mail />}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field label="Senha">
            <IconInput
              icon={<Lock />}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </Field>

          <Button variant="primary" full style={{ marginTop: 4 }} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 13, marginTop: 18 }}
        >
          ← Voltar para Home
        </button>
      </Card>
    </AuthLayout>
    </>
  )
}

export default Login
