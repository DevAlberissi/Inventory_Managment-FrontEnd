export const Button = ({ variant = 'primary', children, full, style, ...rest }) => {
  const base = {
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    transition: 'all .2s ease', display: 'inline-flex', alignItems: 'center',
    gap: 8, padding: '10px 18px', borderRadius: 10, justifyContent: 'center',
    width: full ? '100%' : 'auto', border: 'none',
  }
  const variants = {
    primary:     { background: '#6366F1', color: '#fff' },
    secondary:   { background: '#fff', color: '#020617', border: '1px solid #E2E8F0' },
    ghost:       { background: 'transparent', color: '#475569', padding: '10px 14px' },
    destructive: { background: '#fff', color: '#DC2626', border: '1px solid #FECACA' },
  }
  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {children}
    </button>
  )
}
