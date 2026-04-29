export const AuthLayout = ({ children, maxWidth = 400 }) => (
  <div style={{
    minHeight: '100vh', background: '#F9FAFB',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  }}>
    <div style={{ width: '100%', maxWidth }}>
      {children}
    </div>
  </div>
)
