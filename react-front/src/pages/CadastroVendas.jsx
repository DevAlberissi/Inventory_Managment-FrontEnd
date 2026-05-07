import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, DollarSign, Hash, ArrowLeft, Calendar, User } from 'lucide-react'
import { Button, Card, Field, Input, IconInput, Navbar, Alert, IconBox } from '../components'
import { colors, radius, spacing, tones } from '../styles/tokens'
import { dashboardService } from '../services/dashboard.service'
import { salesService } from '../services/sales.service'

const CadastroVendas = () => {
  const navigate = useNavigate()

  const [produtos, setProdutos] = useState([])
  const [form, setForm] = useState({
    produto_id: '',
    quantidade: '',
    preco_unitario: '',
    cliente: '',
    data_venda: new Date().toISOString().split('T')[0],
    observacoes: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [loadingProdutos, setLoadingProdutos] = useState(true)

  // Buscar lista de produtos
  useEffect(() => {
    fetchProdutos()
  }, [])

  const fetchProdutos = async () => {
    try {
      const res = await dashboardService.getProducts()
      setProdutos(res.produtos || [])
    } catch (err) {
      console.error('Erro ao carregar produtos:', err)
      setFeedback({ tone: 'error', title: 'Erro ao carregar produtos: ' + err.message })
    } finally {
      setLoadingProdutos(false)
    }
  }

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))

    // Atualizar preço unitário quando produto muda
    if (key === 'produto_id' && value) {
      const produtoSelecionado = produtos.find(p => p.id === parseInt(value))
      if (produtoSelecionado) {
        setForm(prev => ({
          ...prev,
          preco_unitario: produtoSelecionado.price.toString(),
        }))
      }
    }
  }

  // Calcular preço total
  const precoTotal = form.quantidade && form.preco_unitario
    ? (parseFloat(form.quantidade) * parseFloat(form.preco_unitario)).toFixed(2)
    : '0.00'

  const validate = () => {
    const errs = {}
    if (!form.produto_id) errs.produto_id = 'Selecione um produto'
    if (!form.quantidade) errs.quantidade = 'Quantidade é obrigatória'
    else if (isNaN(Number(form.quantidade)) || Number(form.quantidade) <= 0)
      errs.quantidade = 'Quantidade deve ser um número positivo'
    if (!form.preco_unitario) errs.preco_unitario = 'Preço unitário é obrigatório'
    else if (isNaN(Number(form.preco_unitario)) || Number(form.preco_unitario) <= 0)
      errs.preco_unitario = 'Preço deve ser um número positivo'
    if (!form.cliente.trim()) errs.cliente = 'Nome do cliente é obrigatório'
    if (!form.data_venda) errs.data_venda = 'Data da venda é obrigatória'
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
      const vendaData = {
        produto_id: parseInt(form.produto_id),
        quantidade: parseInt(form.quantidade),
        preco_unitario: parseFloat(form.preco_unitario),
        preco_total: parseFloat(precoTotal),
        cliente: form.cliente.trim(),
        data_venda: form.data_venda,
        observacoes: form.observacoes.trim(),
      }

      console.log('Enviando venda:', vendaData)
      const result = await salesService.create(vendaData)
      console.log('Venda criada com sucesso:', result)

      setFeedback({ tone: 'success', title: 'Venda registrada com sucesso! Redirecionando...' })
      setTimeout(() => navigate('/vendas'), 1500)
    } catch (err) {
      console.error('Erro ao registrar venda:', err)
      setFeedback({ tone: 'error', title: err.message || 'Erro desconhecido ao registrar venda' })
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
          <IconBox icon={<ShoppingBag />} tone="accent" size={48} radius={radius.md} />
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.text }}>Registrar Venda</h2>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: colors.textSecondary }}>
              Preencha os dados abaixo para registrar uma nova venda.
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
                    opacity: loadingProdutos ? 0.6 : 1,
                  }}
                >
                  <option value="">
                    {loadingProdutos ? 'Carregando produtos...' : 'Selecione um produto'}
                  </option>
                  {produtos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - R$ {p.price.toFixed(2)} (Estoque: {p.quantity})
                    </option>
                  ))}
                </select>
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[16] }}>
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

                <Field label="Preço Unitário *" error={errors.preco_unitario}>
                  <IconInput
                    icon={<DollarSign size={15} color={colors.textMuted} />}
                    placeholder="0,00"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.preco_unitario}
                    onChange={e => set('preco_unitario', e.target.value)}
                    error={!!errors.preco_unitario}
                    inputMode="decimal"
                  />
                </Field>
              </div>

              <Field label="Preço Total" helper="Calculado automaticamente">
                <div
                  style={{
                    padding: `${spacing[8]}px ${spacing[12]}px`,
                    borderRadius: radius.md,
                    border: `1px solid ${colors.border}`,
                    background: colors.surface,
                    fontSize: 14,
                    color: colors.text,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <DollarSign size={15} color={colors.textMuted} />
                  R$ {precoTotal}
                </div>
              </Field>

              <Field label="Nome do Cliente *" error={errors.cliente}>
                <IconInput
                  icon={<User size={15} color={colors.textMuted} />}
                  placeholder="Ex: João Silva"
                  value={form.cliente}
                  onChange={e => set('cliente', e.target.value)}
                  error={!!errors.cliente}
                />
              </Field>

              <Field label="Data da Venda *" error={errors.data_venda}>
                <IconInput
                  icon={<Calendar size={15} color={colors.textMuted} />}
                  type="date"
                  value={form.data_venda}
                  onChange={e => set('data_venda', e.target.value)}
                  error={!!errors.data_venda}
                />
              </Field>

              <Field label="Observações" helper="Campo opcional">
                <textarea
                  placeholder="Adicione notas sobre esta venda..."
                  value={form.observacoes}
                  onChange={e => set('observacoes', e.target.value)}
                  style={{
                    width: '100%',
                    padding: `${spacing[8]}px ${spacing[12]}px`,
                    borderRadius: radius.md,
                    border: `1px solid ${colors.border}`,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    backgroundColor: colors.surface,
                    color: colors.text,
                    resize: 'vertical',
                    minHeight: 80,
                  }}
                />
              </Field>

              <div style={{ display: 'flex', gap: spacing[12], justifyContent: 'flex-end', marginTop: spacing[8] }}>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => navigate(-1)}
                >
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
