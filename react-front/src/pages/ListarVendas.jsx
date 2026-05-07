import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Plus, ArrowLeft, DollarSign, Calendar, User } from 'lucide-react'
import { Button, Card, Badge, Navbar, Alert, IconBox } from '../components'
import { colors, radius, shadow, spacing } from '../styles/tokens'
import { salesService } from '../services/sales.service'

const SalesCard = ({ sale, onEdit }) => {
  const formattedDate = new Date(sale.data_venda).toLocaleDateString('pt-BR')
  const formattedValue = parseFloat(sale.preco_total).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <Card
      padding={spacing[16]}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
        gap: spacing[16],
        alignItems: 'center',
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div style={{ display: 'flex', gap: spacing[12], alignItems: 'center', minWidth: 0 }}>
        <IconBox icon={<ShoppingBag size={14} />} tone="accent" size={36} radius={radius.sm} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {sale.produto || 'Produto'}
          </div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
            Qtd: {sale.quantidade} un.
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>Cliente</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{sale.cliente}</div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>Data</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, fontVariantNumeric: 'tabular-nums' }}>
          {formattedDate}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>Valor Total</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.success, fontVariantNumeric: 'tabular-nums' }}>
          {formattedValue}
        </div>
      </div>

      <div style={{ display: 'flex', gap: spacing[8] }}>
        <Button
          variant="secondary"
          style={{ padding: `${spacing[6]}px ${spacing[12]}px`, fontSize: 12 }}
          onClick={() => onEdit(sale)}
        >
          Editar
        </Button>
      </div>
    </Card>
  )
}

const ListarVendas = () => {
  const navigate = useNavigate()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      setLoading(true)
      const result = await salesService.list()
      console.log('Vendas carregadas:', result)
      setSales(result.vendas || [])
    } catch (err) {
      console.error('Erro ao carregar vendas:', err)
      setError(err.message)
      setFeedback({ tone: 'error', title: err.message })
    } finally {
      setLoading(false)
    }
  }

  const totalVendas = sales.length
  const valorTotal = sales.reduce((sum, s) => sum + parseFloat(s.preco_total || 0), 0)
  const ticketMedio = totalVendas > 0 ? valorTotal / totalVendas : 0

  const handleEdit = (sale) => {
    // TODO: Implementar página de edição de vendas
    alert(`Editar venda #${sale.id} - Funcionalidade em desenvolvimento`)
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
          <div style={{ borderRadius: radius.lg, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                gap: spacing[16],
                padding: spacing[16],
                background: colors.bg,
                borderBottom: `1px solid ${colors.border}`,
                fontWeight: 600,
                fontSize: 12,
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '.06em',
              }}
            >
              <div>Produto</div>
              <div>Cliente</div>
              <div>Data</div>
              <div>Valor</div>
              <div>Ações</div>
            </div>

            {/* Table rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {sales.map((sale, index) => (
                <div key={sale.id} style={{ borderBottom: index < sales.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                  <SalesCard sale={sale} onEdit={handleEdit} />
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default ListarVendas
