import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Package, Pencil, PowerOff, FileText, Image } from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'
import { Alert } from './Alert'
import { IconBox } from './IconBox'
import { colors, radius, shadow, spacing, tones } from '../styles/tokens'
import { api } from '../services/api'
import { dashboardService } from '../services/dashboard.service'

const LOW_STOCK = 5
const PLACEHOLDER_TONES = ['accent', 'success', 'info', 'warning', 'neutral']

export const ProductDetailModal = ({ product, onClose, onDeactivated }) => {
  const navigate = useNavigate()
  const [imgSrc, setImgSrc] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const [deactivating, setDeactivating] = useState(false)
  const [actionError, setActionError] = useState(null)

  const placeholderTone = PLACEHOLDER_TONES[product.id % PLACEHOLDER_TONES.length]
  const firstImage = product.imagens?.[0]
  const isLowStock = product.quantity < LOW_STOCK

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

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleDeactivate = async () => {
    setDeactivating(true)
    setActionError(null)
    try {
      await dashboardService.deactivateProduct(product.id)
      onDeactivated(product.id)
      onClose()
    } catch (e) {
      setActionError(e.message)
      setDeactivating(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: spacing[16],
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: colors.surface,
        borderRadius: radius.lg,
        boxShadow: shadow.lg,
        width: '100%',
        maxWidth: 480,
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Image header */}
        <div style={{ height: 220, position: 'relative', flexShrink: 0 }}>
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
              <Package size={64} color={tones[placeholderTone].icon} />
            </div>
          )}

          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: spacing[12], right: spacing[12],
              background: 'rgba(2,6,23,0.50)', border: 'none', borderRadius: radius.full,
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: colors.surface,
            }}
          >
            <X size={16} />
          </button>

          <div style={{ position: 'absolute', bottom: spacing[8], left: spacing[12], display: 'flex', gap: spacing[8] }}>
            <Badge tone={product.status ? 'success' : 'neutral'} dot>
              {product.status ? 'Ativo' : 'Inativo'}
            </Badge>
            {isLowStock && <Badge tone="warning" dot>Estoque baixo</Badge>}
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{
          padding: spacing[24], overflowY: 'auto', flex: 1,
          display: 'flex', flexDirection: 'column', gap: spacing[16],
        }}>
          {/* Name + price */}
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: spacing[8] }}>
              {product.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: 22, fontWeight: 700, color: colors.primary,
                fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
              }}>
                {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <span style={{
                fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                color: isLowStock ? colors.warning : colors.textSecondary,
              }}>
                {product.quantity} un. em estoque
              </span>
            </div>
          </div>

          {/* Documents */}
          {product.documentos?.length > 0 && (
            <div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: colors.textMuted,
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: spacing[8],
              }}>
                Documentos ({product.documentos.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
                {product.documentos.map(doc => {
                  const isImg = doc.mime_type?.startsWith('image/')
                  return (
                    <div key={doc.id} style={{
                      display: 'flex', alignItems: 'center', gap: spacing[12],
                      padding: `${spacing[8]}px ${spacing[12]}px`,
                      background: colors.bg, borderRadius: radius.md,
                      border: `1px solid ${colors.border}`,
                    }}>
                      <IconBox
                        icon={isImg ? <Image size={14} /> : <FileText size={14} />}
                        tone={isImg ? 'accent' : 'neutral'}
                        size={32}
                        radius={radius.md}
                      />
                      <span style={{
                        flex: 1, fontSize: 13, color: colors.text,
                        fontWeight: 500, wordBreak: 'break-all',
                      }}>
                        {doc.nome_arquivo}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {actionError && <Alert tone="error" message={actionError} />}

          {/* Actions */}
          {product.status && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
              {confirming && (
                <Alert
                  tone="warning"
                  message={`Desativar "${product.name}"? Ele ficará inativo e não aparecerá no catálogo. Essa ação não pode ser desfeita aqui.`}
                />
              )}
              <div style={{ display: 'flex', gap: spacing[8] }}>
                {confirming ? (
                  <>
                    <Button
                      variant="secondary"
                      style={{ flex: 1 }}
                      onClick={() => { setConfirming(false); setActionError(null) }}
                      disabled={deactivating}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      style={{ flex: 1 }}
                      onClick={handleDeactivate}
                      disabled={deactivating}
                    >
                      <PowerOff size={14} />
                      {deactivating ? 'Desativando...' : 'Confirmar desativação'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      style={{ flex: 1 }}
                      onClick={() => navigate(`/produtos/editar/${product.id}`)}
                    >
                      <Pencil size={14} /> Editar
                    </Button>
                    <Button
                      variant="destructive"
                      style={{ flex: 1 }}
                      onClick={() => setConfirming(true)}
                    >
                      <PowerOff size={14} /> Desativar
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
