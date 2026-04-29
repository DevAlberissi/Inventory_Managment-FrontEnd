export const Card = ({ children, padding = 24, style }) => (
  <div style={{
    background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16,
    boxShadow: '0 1px 2px rgba(0,0,0,.05)', padding, ...style,
  }}>
    {children}
  </div>
)
