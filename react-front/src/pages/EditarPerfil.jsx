import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { Button, Card, Field, Input, Navbar, Alert, IconBox } from '../components'
import { colors, radius, spacing } from '../styles/tokens'
import { usersService } from '../services/users.service'

const EditarPerfil = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', celular: '', cnpj: '' })
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    let cancelled = false

    usersService.getMe()
      .then(res => {
        if (cancelled) return
        const user = res.usuario || res.usuarios || res
        setForm({
          name: user.name ?? '',
          email: user.email ?? '',
          celular: user.celular ?? '',
          cnpj: user.cnpj ?? '',
        })
      })
      .catch(err => {
        if (!cancelled) setLoadError(err.message || 'Erro ao carregar perfil')
      })
      .finally(() => {
        if (!cancelled) setLoadingProfile(false)
      })

    return () => { cancelled = true }
  }, [])

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nome é obrigatório'
    if (!form.email.trim()) errs.email = 'Email é obrigatório'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      await usersService.updateMe({
        name: form.name.trim(),
        email: form.email.trim(),
        celular: form.celular.trim(),
        cnpj: form.cnpj.trim(),
      })

      setFeedback({ tone: 'success', title: 'Perfil atualizado com sucesso.' })
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      setFeedback({ tone: 'error', title: err.message || 'Erro ao atualizar perfil' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <IconBox icon={<UserPlus />} tone="accent" size={48} radius={12} />
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#020617' }}>Edite seu perfil</h2>
            <p style={{ margin: '8px 0 0', color: '#64748B', fontSize: 14 }}>
              Atualize as informações da sua conta para manter seu perfil sempre atualizado.
            </p>
          </div>
        </div>

        <Card padding={32}>
          {loadingProfile && (
            <div style={{ marginBottom: spacing[16] }}>
              <Alert tone="info" title="Carregando seus dados..." />
            </div>
          )}

          {loadError && (
            <div style={{ marginBottom: spacing[16] }}>
              <Alert tone="error" title={`Erro ao carregar perfil: ${loadError}`} />
            </div>
          )}

          {feedback && (
            <div style={{ marginBottom: spacing[16] }}>
              <Alert tone={feedback.tone} title={feedback.title} />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[16] }}>
              <Field label="Nome *" error={errors.name}>
                <Input
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  error={!!errors.name}
                  disabled={loadingProfile}
                />
              </Field>

              <Field label="Email *" error={errors.email}>
                <Input
                  placeholder="seu@email.com"
                  type="email"
                  value={form.email}
                  onChange={e => setField('email', e.target.value)}
                  error={!!errors.email}
                  disabled={loadingProfile}
                />
              </Field>

              <Field label="Telefone">
                <Input
                  placeholder="(00) 00000-0000"
                  value={form.celular}
                  onChange={e => setField('celular', e.target.value)}
                  disabled={loadingProfile}
                />
              </Field>

              <Field label="CNPJ">
                <Input
                  placeholder="00.000.000/0000-00"
                  value={form.cnpj}
                  onChange={e => setField('cnpj', e.target.value)}
                  disabled={loadingProfile}
                />
              </Field>
            </div>

            <div style={{ marginTop: spacing[24], display: 'flex', gap: spacing[12], justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => navigate('/')}>Cancelar</Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || loadingProfile}
                style={{ opacity: (loading || loadingProfile) ? 0.6 : 1 }}
              >
                {loading ? 'Salvando...' : 'Salvar perfil'}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}

export default EditarPerfil
