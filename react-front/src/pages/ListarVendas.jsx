import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Plus, ArrowLeft, Trash2 } from 'lucide-react'
import { Button, Card, Badge, Navbar, Alert, IconBox } from '../components'
import { colors, radius, spacing, tones } from '../styles/tokens'
import { salesService } from '../services/sales.service'

const fmtBRL = (v) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtDate = (iso) => new Date(iso).toLocaleDateString('pt-BR')

const SaleRow = ({ sale, onCancel }) => {
  const total = sale.quantidade * sale.preco_unitario

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
        gap: spacing[16],
        alignItems: 'center',
        padding: `${spacing[12]}px ${spacing[16]}px`,
      }}
    >
      <div style={{ display: 'flex', gap: spacing[12], alignItems: 'center', minWidth: 0 }}>
        <IconBox icon={<ShoppingBag size={14} />} tone="success" size={36} radius={radius.sm} />
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: colors.text,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {sale.produto?.name ?? `Produto #${sale.produto_id}`}
          </div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
            #{sale.id}
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>Qtd.</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, fontVariantNumeric: 'tabular-nums' }}>
          {sale.quantidade} un.
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>Un.</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, fontVariantNumeric: 'tabular-nums' }}>
          {fmtBRL(sale.preco_unitario)}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>Data</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, fontVariantNumeric: 'tabular-nums' }}>
          {fmtDate(sale.created_at)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: spacing[8], alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: tones.success.icon, fontVariantNumeric: 'tabular-nums', minWidth: 72, textAlign: 'right' }}>
          {fmtBRL(total)}
        </span>
        <button
          title="Cancelar venda"
          onClick={() => onCancel(sale)}
          style={{
            background: 'none', border: `1px solid ${colors.border}`, cursor: 'pointer',
            padding: `${spacing[6]}px`, borderRadius: radius.sm,
            display: 'inline-flex', alignItems: 'center', color: colors.textMuted,
            transition: 'color .15s, border-color .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = tones.error.icon; e.currentTarget.style.borderColor = tones.error.border }}
          onMouseLeave={e => { e.currentTarget.style.color = colors.textMuted; e.currentTarget.style.borderColor = colors.border }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

const ListarVendas = () => {
  const navigate = useNavigate()

  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelFeedback, setCancelFeedback] = useState(null)

  useEffect(() => { fetchSales() }, [])

  const fetchSales = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await salesService.list()
      setSales(result.vendas || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (sale) => {
    if (!window.confirm(`Cancelar venda #${sale.id} de "${sale.produto?.name}"? O estoque será devolvido.`)) return
    try {
      setDeleteInProgress(true)

      await salesService.delete(sale.id)
      setSales(prev => prev.filter(s => s.id !== sale.id))
      setCancelFeedback({ tone: 'success', title: `Venda #${sale.id} cancelada. Estoque restaurado.` })
      setTimeout(() => setCancelFeedback(null), 3000)
    } catch (err) {
      setCancelFeedback({ tone: 'error', title: `Erro ao cancelar: ${err.message}` })
    }
  }

  const totalVendas = sales.length
  const valorTotal = sales.reduce((sum, s) => sum + s.quantidade * s.preco_unitario, 0)
  const ticketMedio = totalVendas > 0 ? valorTotal / totalVendas : 0

  return (
    <div
      style={{
        background: colors.bg,
        minHeight: '100vh',
      }}
    >
      <Navbar />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: `${spacing[32]}px ${spacing[24]}px` }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[24] }}>
          <div>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: colors.textSecondary,
                fontSize: 13,
                fontWeight: 500,
                padding: 0,
                marginBottom: spacing[8],
              }}
            >
              <ArrowLeft size={14} />
              Voltar ao dashboard
            </button>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: colors.text,
              }}
            >
              Minhas Vendas
            </div>
            <div style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
              Histórico de transações registradas
            </div>
          </div>
          <Button variant="primary" onClick={() => navigate('/vendas/novo')}>
            <Plus size={16} /> Registrar Venda
          </Button>
        </div>

        {cancelFeedback && (
          <div style={{ marginBottom: spacing[16] }}>
            <Alert tone={cancelFeedback.tone} title={cancelFeedback.title} />
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: spacing[16],
              marginBottom: spacing[24],
            }}
          >
            <Card padding={spacing[16]}>
              <div
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  marginBottom: 8,
                }}
              >
                Total de Vendas
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                {totalVendas}
              </div>
            </Card>

            <Card padding={spacing[16]}>
              <div
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  marginBottom: 8,
                }}
              >
                Valor Total
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: tones.success.icon, fontVariantNumeric: 'tabular-nums' }}>
                {fmtBRL(valorTotal)}
              </div>
            </Card>

            <Card padding={spacing[16]}>
              <div
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  marginBottom: 8,
                }}
              >
                Ticket Médio
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.text, fontVariantNumeric: 'tabular-nums' }}>
                {fmtBRL(ticketMedio)}
              </div>
            </Card>
          </div>
        )}

        {loading && <Alert tone="info" title="Carregando vendas..." />}
        {error && !loading && <Alert tone="error" title={`Erro ao carregar vendas: ${error}`} />}

        {!loading && !error && totalVendas === 0 && (
          <Card
            padding={spacing[32]}
            style={{ textAlign: 'center' }}
          >
            <IconBox
              icon={<ShoppingBag size={32} />}
              tone="neutral"
              size={64}
              radius={radius.lg}
              style={{ margin: '0 auto 16px' }}
            />

            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Nenhuma venda registrada
            </div>

            <Button
              variant="primary"
              onClick={() => navigate('/vendas/novo')}
            >
              <Plus size={14} />
              Registrar Venda
            </Button>
          </Card>
        )}

        {!loading && !error && totalVendas > 0 && (
          <div style={{ borderRadius: radius.lg, border: `1px solid ${colors.border}`, overflow: 'hidden', background: colors.surface }}>
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                gap: spacing[16],
                padding: `${spacing[10]}px ${spacing[16]}px`,
                background: colors.bg,
                borderBottom: `1px solid ${colors.border}`,
                fontWeight: 600,
                fontSize: 11,
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '.06em',
              }}
            >
              <div>Produto</div>
              <div>Qtd.</div>
              <div>Preço Un.</div>
              <div>Data</div>
              <div style={{ textAlign: 'right', paddingRight: 32 }}>Total</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', divide: `1px solid ${colors.border}` }}>
              {sales.map((sale, i) => (
                <div key={sale.id} style={{ borderBottom: i < sales.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                  <SaleRow sale={sale} onCancel={handleCancel} />
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