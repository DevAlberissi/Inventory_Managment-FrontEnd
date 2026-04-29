export const Input = ({ error, style, ...rest }) => (
  <input
    style={{
      fontSize: 14, padding: '10px 12px', borderRadius: 10,
      border: `1px solid ${error ? '#DC2626' : '#E2E8F0'}`,
      background: '#F8FAFC', outline: 'none', color: '#020617',
      transition: 'all .2s ease', width: '100%', ...style,
    }}
    onFocus={e => {
      e.target.style.borderColor = '#6366F1'
      e.target.style.background = '#fff'
      e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,.18)'
    }}
    onBlur={e => {
      e.target.style.borderColor = error ? '#DC2626' : '#E2E8F0'
      e.target.style.background = '#F8FAFC'
      e.target.style.boxShadow = 'none'
    }}
    {...rest}
  />
)
