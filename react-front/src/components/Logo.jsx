import { Package } from 'lucide-react'

export const Logo = ({ size = 28 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
    <span style={{
      width: size + 8, height: size + 8, borderRadius: 10,
      background: '#6366F1',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Package size={size - 6} color="#fff" />
    </span>
    <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', color: '#020617' }}>StockHub</span>
  </span>
)
