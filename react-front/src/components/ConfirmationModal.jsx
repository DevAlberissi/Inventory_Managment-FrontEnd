import { AlertTriangle } from 'lucide-react'
import { colors, radius, shadow, spacing, tones } from '../styles/tokens'

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  tone = 'error',
}) => {
  if (!isOpen) return null

  const t = tones[tone] || tones.error

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2,6,23,0.50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: spacing[16],
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel()
      }}
    >
      <div
        style={{
          background: colors.surface,
          borderRadius: radius.lg,
          boxShadow: shadow.lg,
          width: '100%',
          maxWidth: 420,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: spacing[12],
            padding: spacing[24],
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: radius.md,
              background: t.bg,
              color: t.icon,
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: colors.text,
                marginBottom: 4,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 14,
                color: colors.textMuted,
                lineHeight: 1.5,
              }}
            >
              {message}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: spacing[12],
            padding: spacing[24],
            justifyContent: 'flex-end',
            background: colors.bg,
          }}
        >
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              fontSize: 14,
              fontWeight: 600,
              padding: '10px 18px',
              borderRadius: 10,
              border: `1px solid ${colors.border}`,
              background: 'transparent',
              color: colors.textMuted,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all .2s ease',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.color = colors.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.textMuted)}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              fontSize: 14,
              fontWeight: 600,
              padding: '10px 18px',
              borderRadius: 10,
              border: 'none',
              background: tones.error.bg,
              color: tones.error.color,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all .2s ease',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = tones.error.hover || tones.error.bg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = tones.error.bg)}
          >
            {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </div>
  )
}
