export const Field = ({ label, error, helper, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && (
      <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
        {label}
      </label>
    )}
    {children}
    {error
      ? <div style={{ fontSize: 12, color: '#DC2626' }}>{error}</div>
      : helper && <div style={{ fontSize: 12, color: '#94A3B8' }}>{helper}</div>}
  </div>
)
