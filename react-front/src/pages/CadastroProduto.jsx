import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, DollarSign, Hash, ArrowLeft, Upload } from 'lucide-react'
import { Button, Card, Field, Input, IconInput, Navbar, Alert, IconBox } from '../components'
import { colors, radius, spacing, tones } from '../styles/tokens'
import { API_BASE_URL } from '../config/constants'

const CadastroProduto = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({ name: '', price: '', quantity: '', status: true })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nome é obrigatório'
    if (!form.price) errs.price = 'Preço é obrigatório'
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Preço deve ser um número positivo'
    if (form.quantity && (isNaN(Number(form.quantity)) || Number(form.quantity) < 0)) errs.quantity = 'Quantidade deve ser um número inteiro positivo'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setFeedback(null)

    try {
      const formData = new FormData()
      formData.append('name', form.name.trim())
      formData.append('price', form.price)
      if (form.quantity) formData.append('quantity', form.quantity)
      formData.append('status', form.status)
      if (imageFile) formData.append('image', imageFile)

      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.mensagem || 'Erro ao cadastrar produto')
      }

      setFeedback({ tone: 'success', title: 'Produto cadastrado com sucesso! Redirecionando...' })
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setFeedback({ tone: 'error', title: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: `${spacing[32]}px ${spacing[24]}px` }}>

        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: colors.textSecondary, fontSize: 14, fontWeight: 500,
            padding: 0, marginBottom: spacing[24],
          }}
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[16], marginBottom: spacing[24] }}>
          <IconBox icon={<Package />} tone="accent" size={48} radius={radius.md} />
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.text }}>Novo Produto</h2>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: colors.textSecondary }}>
              Preencha as informações abaixo para adicionar o produto ao seu catálogo.
            </p>
          </div>
        </div>

        {feedback && (
          <div style={{ marginBottom: spacing[16] }}>
            <Alert tone={feedback.tone} title={feedback.title} />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card padding={spacing[24]}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>

              <Field label="Nome do produto *" error={errors.name}>
                <Input
                  placeholder="Ex: Caixa organizadora 30L"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  error={!!errors.name}
                />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[16] }}>
                <Field label="Preço *" error={errors.price} helper="Em reais, ex: 49.90">
                  <IconInput
                    icon={<DollarSign size={15} color={colors.textMuted} />}
                    placeholder="0,00"
                    value={form.price}
                    onChange={e => set('price', e.target.value)}
                    error={!!errors.price}
                    inputMode="decimal"
                  />
                </Field>

                <Field label="Quantidade inicial" error={errors.quantity} helper="Padrão: 0">
                  <IconInput
                    icon={<Hash size={15} color={colors.textMuted} />}
                    placeholder="0"
                    value={form.quantity}
                    onChange={e => set('quantity', e.target.value)}
                    error={!!errors.quantity}
                    inputMode="numeric"
                  />
                </Field>
              </div>

              <Field label="Status">
                <div style={{ display: 'flex', gap: spacing[8] }}>
                  {[
                    { value: true,  label: 'Ativo',   tone: 'success' },
                    { value: false, label: 'Inativo', tone: 'neutral' },
                  ].map(opt => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => set('status', opt.value)}
                      style={{
                        padding: `${spacing[8]}px ${spacing[16]}px`,
                        borderRadius: radius.md,
                        border: `1px solid ${form.status === opt.value ? tones[opt.tone].border : colors.border}`,
                        background: form.status === opt.value ? tones[opt.tone].bg : colors.surface,
                        color: form.status === opt.value ? tones[opt.tone].color : colors.textSecondary,
                        fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all .15s ease',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Imagem do produto" helper="Formatos aceitos: PNG, JPG, JPEG, GIF, WEBP">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                  onChange={handleImage}
                  style={{ display: 'none' }}
                />
                {imagePreview ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[16] }}>
                    <img
                      src={imagePreview}
                      alt="Preview do produto"
                      style={{
                        width: 80, height: 80, borderRadius: radius.md,
                        objectFit: 'cover', border: `1px solid ${colors.border}`,
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
                      <span style={{ fontSize: 13, color: colors.textSecondary, wordBreak: 'break-all' }}>
                        {imageFile?.name}
                      </span>
                      <Button variant="ghost" type="button" onClick={removeImage}>
                        Remover imagem
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', gap: spacing[8], padding: spacing[24],
                      border: `2px dashed ${colors.border}`, borderRadius: radius.md,
                      background: colors.bg, cursor: 'pointer', color: colors.textMuted,
                      width: '100%', boxSizing: 'border-box',
                    }}
                  >
                    <Upload size={24} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Clique para selecionar uma imagem</span>
                    <span style={{ fontSize: 12 }}>PNG, JPG, JPEG, GIF ou WEBP</span>
                  </button>
                )}
              </Field>

            </div>
          </Card>

          <div style={{ display: 'flex', gap: spacing[12], marginTop: spacing[16], justifyContent: 'flex-end' }}>
            <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
            </Button>
          </div>
        </form>

      </main>
    </div>
  )
}

export default CadastroProduto
