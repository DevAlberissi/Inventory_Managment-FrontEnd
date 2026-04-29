import { tones as _tones } from '../styles/tokens'

export const Badge = ({ tone = 'neutral', children, dot }) => {
  const t = _tones[tone] || _tones.neutral
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px',
      borderRadius: 9999, fontSize: 12, fontWeight: 600,
      background: t.bg, color: t.color, border: `1px solid ${t.border}`,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 9999, background: t.icon }} />}
      {children}
    </span>
  )
}
