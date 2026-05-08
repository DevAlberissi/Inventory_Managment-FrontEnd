import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Hash, ArrowLeft, Package } from 'lucide-react'
import { Button, Card, Field, IconInput, Navbar, Alert, IconBox, Badge } from '../components'
import { colors, radius, spacing, tones } from '../styles/tokens'
import { dashboardService } from '../services/dashboard.service'
import { salesService } from '../services/sales.service'

const CadastroVendas = () => {
  const navigate = useNavigate()

  const [produtos, setProdutos] = useState([])
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [form, setForm] = useState({ produto_id: '', quantidade: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [loadingProdutos, setLoadingProdutos] = useState(true)

  useEffect(() => {
    dashboardService.getProducts()
      .then(res => setProdutos((res.produtos || []).filter(p => p.status)))
      .catch(err => setFeedback({ tone: 'error', title: 'Erro ao carregar produtos: ' + err.message }))
      .finally(() => setLoadingProdutos(false))
  }, [])

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))

    if (key === 'produto_id') {
      const found = produtos.find(p => p.id === parseInt(value))
      setProdutoSelecionado(found || null)
    }
  }

  const total = produtoSelecionado && form.quantidade
    ? (produtoSelecionado.price * parseInt(form.quantidade || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : null

  const validate = () => {
    const errs = {}
    if (!form.produto_id) errs.produto_id = 'Selecione um produto'
    if (!form.quantidade) errs.quantidade = 'Quantidade é obrigatória'
    else if (!Number.isInteger(Number(form.quantidade)) || Number(form.quantidade) <= 0)
      errs.quantidade = 'Deve ser um número inteiro positivo'
    else if (produtoSelecionado && Number(form.quantidade) > produtoSelecionado.quantity)
      errs.quantidade = `Estoque disponível: ${produtoSelecionado.quantity} un.`
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setFeedback(null)
    try {
      await salesService.create({
        produto_id: parseInt(form.produto_id),
        quantidade: parseInt(form.quantidade),
      })
      setFeedback({ tone: 'success', title: 'Venda registrada com sucesso! Redirecionando...' })
      setTimeout(() => navigate('/vendas'), 1500)
    } catch (err) {
      setFeedback({ tone: 'error', title: err.message || 'Erro ao registrar venda' })
    } finally {
      setLoading(false)
    }
  }

  const fmtBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: 640, margin: '0 auto', padding: `${spacing[32]}px ${spacing[24]}px` }}>

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
          <IconBox icon={<ShoppingBag />} tone="success" size={48} radius={radius.md} />
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.text }}>Registrar Venda</h2>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: colors.textSecondary }}>
              Selecione o produto e a quantidade vendida.
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

              <Field label="Produto *" error={errors.produto_id}>
                <select
                  value={form.produto_id}
                  onChange={e => set('produto_id', e.target.value)}
                  disabled={loadingProdutos}
                  style={{
                    width: '100%',
                    padding: `${spacing[8]}px ${spacing[12]}px`,
                    borderRadius: radius.md,
                    border: `1px solid ${errors.produto_id ? '#FCA5A5' : colors.border}`,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    backgroundColor: colors.surface,
                    color: form.produto_id ? colors.text : colors.textMuted,
                    cursor: loadingProdutos ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    appearance: 'auto',
                  }}
                >
                  <option value="">
                    {loadingProdutos ? 'Carregando produtos...' : 'Selecione um produto'}
                  </option>
                  {produtos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {fmtBRL(p.price)} · {p.quantity} em estoque
                    </option>
                  ))}
                </select>
              </Field>

              {/* Product info preview */}
              {produtoSelecionado && (
                <div style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radius.md,
                  padding: spacing[12],
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', gap: spacing[10], alignItems: 'center' }}>
                    <IconBox icon={<Package size={14} />} tone="accent" size={32} radius={radius.sm} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{produtoSelecionado.name}</div>
                      <div style={{ fontSize: 12, color: colors.textMuted }}>
                        Preço unitário: {fmtBRL(produtoSelecionado.price)}
                      </div>
                    </div>
                  </div>
                  <Badge tone={produtoSelecionado.quantity < 5 ? 'warning' : 'success'} dot>
                    {produtoSelecionado.quantity} em estoque
                  </Badge>
                </div>
              )}

              <Field label="Quantidade *" error={errors.quantidade}>
                <IconInput
                  icon={<Hash size={15} color={colors.textMuted} />}
                  placeholder="1"
                  type="number"
                  min="1"
                  value={form.quantidade}
                  onChange={e => set('quantidade', e.target.value)}
                  error={!!errors.quantidade}
                  inputMode="numeric"
                />
              </Field>

              {/* Total preview */}
              {total && (
                <div style={{
                  background: tones.success.bg,
                  border: `1px solid ${tones.success.border}`,
                  borderRadius: radius.md,
                  padding: `${spacing[10]}px ${spacing[12]}px`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 13, color: tones.success.text, fontWeight: 600 }}>Total da venda</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: tones.success.icon, fontVariantNumeric: 'tabular-nums' }}>
                    {total}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', gap: spacing[12], justifyContent: 'flex-end', marginTop: spacing[8] }}>
                <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Registrando...' : 'Registrar Venda'}
                </Button>
              </div>

            </div>
          </Card>
        </form>

      </main>
    </div>
  )
}

export default CadastroVendas
