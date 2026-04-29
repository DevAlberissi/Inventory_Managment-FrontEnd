import React from 'react'
import { tones as _tones } from '../styles/tokens'

export const IconBox = ({ icon, tone = 'accent', size = 48, radius = 14, style }) => {
  const t = _tones[tone] || _tones.accent
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: t.bg, border: `1px solid ${t.border}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, ...style,
    }}>
      {React.cloneElement(icon, { size: Math.round(size * 0.45), color: t.icon })}
    </div>
  )
}
