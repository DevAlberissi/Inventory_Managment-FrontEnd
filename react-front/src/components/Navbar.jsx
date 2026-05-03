import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, LogOut, UserPen } from 'lucide-react'
import { AppHeader } from './AppHeader'
import { Button } from './Button'
import { useAuth } from '../contexts/AuthContext'
import { colors, radius, shadow, spacing } from '../styles/tokens'

function navLink(active) {
  return {
    fontSize: 14, fontWeight: 500, textDecoration: 'none',
    padding: `${spacing[8]}px ${spacing[12]}px`, borderRadius: radius.sm,
    background: active ? colors.primarySoft : 'none',
    color: active ? colors.primary : colors.textSecondary,
    border: 'none', cursor: 'pointer',
  }
}

function decodeTokenName(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.name || payload.email || 'Minha conta'
  } catch {
    return 'Minha conta'
  }
}

export const Navbar = ({ style }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, token, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const userName = isAuthenticated ? decodeTokenName(token) : null

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <AppHeader
      onLogoClick={() => navigate('/')}
      style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', zIndex: 10, ...style }}
      actions={
        <nav style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate('/')} style={navLink(location.pathname === '/')}>
                Dashboard
              </button>
              <button onClick={() => navigate('/produtos')} style={navLink(location.pathname.startsWith('/produtos'))}>
                Produtos
              </button>
            </>
          ) : (
            <>
              <a href="/#features" style={navLink(false)}>Recursos</a>
              <a href="/#workflow" style={navLink(false)}>Como funciona</a>
            </>
          )}

          <span style={{ width: spacing[8] }} />

          {isAuthenticated ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: spacing[8],
                  background: 'none', border: `1px solid ${colors.border}`, borderRadius: radius.md,
                  padding: `7px ${spacing[12]}px`, cursor: 'pointer',
                  fontSize: 14, fontWeight: 500, color: colors.text,
                }}
              >
                {userName}
                <ChevronDown size={15} style={{ color: colors.textMuted, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {open && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                  background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.md,
                  boxShadow: shadow.md, minWidth: 170, zIndex: 50,
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => { setOpen(false); navigate('/editar-perfil') }}
                    style={dropItemStyle}
                  >
                    <UserPen size={15} />
                    Editar perfil
                  </button>
                  <div style={{ height: 1, background: colors.bg, margin: `${spacing[4]}px 0` }} />
                  <button onClick={handleLogout} style={{ ...dropItemStyle, color: colors.error }}>
                    <LogOut size={15} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>Entrar</Button>
              <Button variant="primary" onClick={() => navigate('/cadastrar')}>Começar grátis</Button>
            </>
          )}
        </nav>
      }
    />
  )
}

const dropItemStyle = {
  display: 'flex', alignItems: 'center', gap: spacing[8],
  width: '100%', background: 'none', border: 'none',
  padding: `${spacing[8]}px ${spacing[12]}px`, cursor: 'pointer',
  fontSize: 14, fontWeight: 500, color: colors.text,
  textAlign: 'left',
}
