import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Plus, ArrowLeft } from 'lucide-react'
import { Button, Card, Badge, Navbar, Alert, IconBox, ProductDetailModal } from '../components'
import { colors, radius, shadow, spacing, tones } from '../styles/tokens'
import { dashboardService } from '../services/dashboard.service'
import { api } from '../services/api'

const LOW_STOCK = 5
const PLACEHOLDER_TONES = ['accent', 'success', 'info', 'warning', 'neutral']

const ProductCard = ({ product, onOpen }) => {
  const [imgSrc, setImgSrc] = useState(null)
  const isLowStock = product.quantity < LOW_STOCK
  const placeholderTone = PLACEHOLDER_TONES[product.id % PLACEHOLDER_TONES.length]
  const firstImage = product.imagens?.[0]

  useEffect(() => {
    if (!firstImage) return
    let objectUrl
    api.getBlob(firstImage.url)
      .then(blob => {
        objectUrl = URL.createObjectURL(blob)
        setImgSrc(objectUrl)
      })
      .catch(() => setImgSrc(null))
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [firstImage?.url])

  return (
    <div
      onClick={() => onOpen(product)}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = shadow.md
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = shadow.sm
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        boxShadow: shadow.sm,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow .15s ease, transform .15s ease',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div style={{ height: 190, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: tones[placeholderTone].bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Package size={52} color={tones[placeholderTone].icon} />
          </div>
        )}

        {isLowStock && (
          <div style={{ position: 'absolute', top: spacing[8], left: spacing[8] }}>
            <Badge tone="warning" dot>Estoque baixo</Badge>
          </div>
        )}

        <div style={{ position: 'absolute', top: spacing[8], right: spacing[8] }}>
          <Badge tone={product.status ? 'success' : 'neutral'} dot>
            {product.status ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: spacing[16], display: 'flex', flexDirection: 'column', gap: spacing[8], flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text, lineHeight: 1.3 }}>
          {product.name}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: 18, fontWeight: 700, color: colors.primary,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
          }}>
            {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          <span style={{
            fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
            color: isLowStock ? colors.warning : colors.textSecondary,
          }}>
            {product.quantity} un.
          </span>
        </div>
      </div>
    </div>
  )
}

const ListarProdutos = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    dashboardService.getProducts()
      .then(res => setProducts(res.produtos || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDeactivated = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: false } : p))
  }

  const totalProdutos = products.length
  const lowStockCount = products.filter(p => p.quantity < LOW_STOCK).length

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
              Meus Produtos
            </div>
            <div style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
              {totalProdutos} produto{totalProdutos !== 1 ? 's' : ''} cadastrado{totalProdutos !== 1 ? 's' : ''}
              {lowStockCount > 0 && (
                <span style={{ color: colors.warning, fontWeight: 600 }}> · {lowStockCount} com estoque baixo</span>
              )}
            </div>
          </div>
          <Button variant="primary" onClick={() => navigate('/produtos/novo')}>
            <Plus size={14} /> Novo Produto
          </Button>
        </div>

        {loading && <Alert tone="info" message="Carregando produtos..." />}
        {error && <Alert tone="error" message={`Erro ao carregar produtos: ${error}`} />}

        {!loading && !error && products.length === 0 && (
          <Card padding={spacing[48]}>
            <div style={{ textAlign: 'center' }}>
              <IconBox icon={<Package size={24} />} tone="neutral" size={56} radius={radius.lg} />
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: spacing[16], color: colors.text }}>
                Nenhum produto cadastrado ainda.
              </div>
              <div style={{ fontSize: 14, color: colors.textMuted, marginTop: spacing[4], marginBottom: spacing[24] }}>
                Adicione seu primeiro produto para começar a vender.
              </div>
              <Button variant="primary" onClick={() => navigate('/produtos/novo')}>
                <Plus size={14} /> Cadastrar primeiro produto
              </Button>
            </div>
          </Card>
        )}

        {!loading && !error && products.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: spacing[16],
          }}>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </main>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onDeactivated={handleDeactivated}
        />
      )}
    </div>
  )
}

export default ListarProdutos
