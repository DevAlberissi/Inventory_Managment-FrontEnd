import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Plus, ArrowLeft, DollarSign, Calendar, User } from 'lucide-react'
import { Button, Card, Badge, Navbar, Alert, IconBox } from '../components'
import { colors, radius, shadow, spacing } from '../styles/tokens'
import { salesService } from '../services/sales.service'

const normalizeCurrency = (value) => {
  if (value == null || value === '') return null
  if (typeof value === 'number') return value
  const normalized = String(value)
    .replace(/\s/g, '')
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .replace(/[^0-9.\-]/g, '')
  const parsed = Number(normalized)
  return Number.isNaN(parsed) ? null : parsed
}

const formatSaleDate = (value) => {
  if (!value) return '—'
  if (typeof value === 'string' && value.includes('/')) {
    const [day, month, year] = value.split('/')
    const parsed = new Date(`${year}-${month}-${day}`)
    return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString('pt-BR')
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString('pt-BR')
}

const formatSaleValue = (value) => {
  const parsed = normalizeCurrency(value)
  if (parsed === null) return '—'
  return parsed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const getSaleProductName = (sale) => {
  if (typeof sale.produto === 'string') return sale.produto
  if (sale.produto?.name) return sale.produto.name
  if (typeof sale.product === 'string') return sale.product
  if (sale.product?.name) return sale.product.name
  if (sale.product_name) return sale.product_name
  return sale.produto ?? sale.product ?? 'Produto'
}

const getSaleCustomerName = (sale) => {
  if (typeof sale.cliente === 'string') return sale.cliente
  if (sale.cliente?.name) return sale.cliente.name
  if (typeof sale.customer === 'string') return sale.customer
  if (sale.customer?.name) return sale.customer.name
  if (sale.nome_cliente) return sale.nome_cliente
  if (sale.client) return sale.client
  if (sale.customer_name) return sale.customer_name
  return '—'
}

const getSaleQuantity = (sale) => {
  return sale.quantidade ?? sale.quantity ?? sale.qty ?? '—'
}

const getSaleValue = (sale) => {
  return sale.preco_total ?? sale.valor_total ?? sale.valor ?? sale.total ?? sale.price ?? sale.amount ?? null
}

const getSaleStatus = (sale) => {
  if (sale.status === true || sale.status === false) return sale.status
  if (sale.status === 'concluida' || sale.status === 'concluída' || sale.status === 'completed') return true
  return false
}

const SalesCard = ({ sale, isDeleteRequested, onEdit, onDeleteRequest, onCancelDelete, onConfirmDelete }) => {
  const productName = getSaleProductName(sale)
  const formattedDate = formatSaleDate(sale.data_venda ?? sale.data ?? sale.created_at ?? sale.date)
  const formattedValue = formatSaleValue(getSaleValue(sale))
  const clientName = getSaleCustomerName(sale)
  const quantity = getSaleQuantity(sale)
  const status = getSaleStatus(sale)

  return (
    <Card
      padding={spacing[20]}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[16],
        minHeight: 260,
      }}
    >
      <div style={{ display: 'flex', gap: spacing[12], alignItems: 'center' }}>
        <IconBox icon={<ShoppingBag size={18} />} tone="accent" size={48} radius={radius.md} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {productName}
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>
            {formattedDate} · {quantity} un.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: spacing[12] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing[12], alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>Cliente</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{clientName}</div>
          </div>
          <Badge tone="neutral">Venda</Badge>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing[12], alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>Valor</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.success, fontVariantNumeric: 'tabular-nums' }}>{formattedValue}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>Status</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.primary }}>{status ? 'Concluída' : 'Pendente'}</div>
          </div>
        </div>
      </div>

      {isDeleteRequested ? (
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
          <div style={{ padding: spacing[14], borderRadius: radius.sm, background: '#FEF2F2', border: '1px solid #FECACA' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#B91C1C' }}>Confirmar exclusão</div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 6 }}>Tem certeza que deseja excluir esta venda? Essa ação não pode ser desfeita.</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing[8] }}>
            <Button
              variant="ghost"
              style={{ padding: `${spacing[6]}px ${spacing[12]}px`, fontSize: 12 }}
              onClick={onCancelDelete}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              style={{ padding: `${spacing[6]}px ${spacing[12]}px`, fontSize: 12 }}
              onClick={() => onConfirmDelete(sale)}
            >
              Excluir agora
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: spacing[8] }}>
          <Button
            variant="secondary"
            style={{ padding: `${spacing[6]}px ${spacing[12]}px`, fontSize: 12 }}
            onClick={() => onEdit(sale)}
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            style={{ padding: `${spacing[6]}px ${spacing[12]}px`, fontSize: 12 }}
            onClick={() => onDeleteRequest(sale)}
          >
            Excluir
          </Button>
        </div>
      )}
    </Card>
  )
}

const ListarVendas = () => {
  const navigate = useNavigate()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [deleteInProgress, setDeleteInProgress] = useState(false)

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      setLoading(true)
      const result = await salesService.list()
      console.log('Vendas carregadas:', result)
      setSales(Array.isArray(result.vendas) ? result.vendas : Array.isArray(result) ? result : [])
    } catch (err) {
      console.error('Erro ao carregar vendas:', err)
      setError(err.message)
      setFeedback({ tone: 'error', title: err.message })
    } finally {
      setLoading(false)
    }
  }

  const totalVendas = sales.length
  const valorTotal = sales.reduce((sum, s) => {
    const parsed = normalizeCurrency(getSaleValue(s))
    return sum + (parsed || 0)
  }, 0)
  const ticketMedio = totalVendas > 0 ? valorTotal / totalVendas : 0

  const handleEdit = (sale) => {
    navigate(`/vendas/editar/${sale.id}`)
  }

  const handleDeleteRequest = (sale) => {
    setPendingDeleteId(sale.id)
  }

  const handleCancelDelete = () => {
    setPendingDeleteId(null)
  }

  const handleConfirmDelete = async (sale) => {
    setDeleteInProgress(true)
    setFeedback(null)
    try {
      await salesService.delete(sale.id)
      setSales(prev => prev.filter(item => item.id !== sale.id))
      setFeedback({ tone: 'success', title: 'Venda excluída com sucesso.' })
      setPendingDeleteId(null)
    } catch (err) {
      setFeedback({ tone: 'error', title: err.message || 'Erro ao excluir venda' })
    } finally {
      setDeleteInProgress(false)
    }
  }

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: `${spacing[32]}px ${spacing[24]}px` }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[24] }}>
          <div>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: colors.textSecondary, fontSize: 13, fontWeight: 500,
                padding: 0, marginBottom: spacing[8],
              }}
            >
              <ArrowLeft size={14} /> Voltar ao dashboard
            </button>
            <div style={{ fontSize: 24, fontWeight: 700, color: colors.text, letterSpacing: '-0.01em' }}>
              Minhas Vendas
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/vendas/novo')}
          >
            <Plus size={16} /> Registrar Venda
          </Button>
        </div>

        {feedback && (
          <div style={{ marginBottom: spacing[16] }}>
            <Alert tone={feedback.tone} title={feedback.title} />
          </div>
        )}

        {/* Metrics */}
        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing[16], marginBottom: spacing[24] }}>
            <Card padding={spacing[16]}>
              <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                Total de Vendas
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.text, fontVariantNumeric: 'tabular-nums' }}>
                {totalVendas}
              </div>
            </Card>

            <Card padding={spacing[16]}>
              <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                Valor Total
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.success, fontVariantNumeric: 'tabular-nums' }}>
                {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </Card>

            <Card padding={spacing[16]}>
              <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                Ticket Médio
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.primary, fontVariantNumeric: 'tabular-nums' }}>
                {ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </Card>
          </div>
        )}

        {loading && (
          <Alert tone="info" title="Carregando vendas..." />
        )}

        {error && !loading && (
          <Alert tone="error" title={`Erro ao carregar vendas: ${error}`} />
        )}

        {!loading && !error && totalVendas === 0 && (
          <Card padding={spacing[32]} style={{ textAlign: 'center' }}>
            <IconBox icon={<ShoppingBag size={32} />} tone="neutral" size={64} radius={radius.lg} style={{ margin: '0 auto 16px' }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>
              Nenhuma venda registrada
            </div>
            <div style={{ fontSize: 14, color: colors.textMuted, marginBottom: spacing[16] }}>
              Comece registrando sua primeira venda
            </div>
            <Button variant="primary" onClick={() => navigate('/vendas/novo')}>
              <Plus size={14} /> Registrar Venda
            </Button>
          </Card>
        )}

        {!loading && !error && totalVendas > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: spacing[16],
          }}>
            {sales.map((sale) => (
              <SalesCard key={sale.id} sale={sale} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

export default ListarVendas
