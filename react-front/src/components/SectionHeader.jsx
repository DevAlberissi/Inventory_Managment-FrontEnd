export const SectionHeader = ({ label, title, subtitle, align = 'center', style }) => (
  <div style={{ textAlign: align, ...style }}>
    {label && (
      <div style={{
        display: 'inline-block', fontSize: 12, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        color: '#6366F1', marginBottom: 12,
      }}>
        {label}
      </div>
    )}
    {title && (
      <h2 style={{
        fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em',
        color: '#020617', margin: '0 0 16px',
      }}>
        {title}
      </h2>
    )}
    {subtitle && (
      <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.65, margin: 0 }}>
        {subtitle}
      </p>
    )}
  </div>
)
