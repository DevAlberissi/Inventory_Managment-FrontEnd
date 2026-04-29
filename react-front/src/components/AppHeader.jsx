import { Logo } from './Logo'

export const AppHeader = ({ actions, sticky = true, style }) => (
  <header style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 32px', background: '#fff', borderBottom: '1px solid #E2E8F0',
    position: sticky ? 'sticky' : 'static', top: 0, zIndex: 100,
    ...style,
  }}>
    <Logo />
    {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{actions}</div>}
  </header>
)
