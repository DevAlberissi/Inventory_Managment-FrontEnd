import React from 'react'
import { Input } from './Input'

export const IconInput = ({ icon, error, style, ...rest }) => (
  <div style={{ position: 'relative' }}>
    <div style={{
      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
      pointerEvents: 'none', display: 'flex', alignItems: 'center',
      color: '#94A3B8',
    }}>
      {React.cloneElement(icon, { size: 16 })}
    </div>
    <Input error={error} style={{ paddingLeft: 36, ...style }} {...rest} />
  </div>
)
