import { tones as _tones } from '../styles/tokens'

export const Alert = ({ tone = 'error', message }) => {
  if (!message) return null
  const t = _tones[tone] || _tones.error
  return (
    <div style={{
      background: t.bg, color: t.color, border: `1px solid ${t.border}`,
      borderRadius: 10, padding: '12px 14px', fontSize: 14, lineHeight: 1.5,
    }}>
      {message}
    </div>
  )
}
