import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, UserPen } from 'lucide-react'
import { AppHeader } from './AppHeader'
import { Button } from './Button'
import { useAuth } from '../contexts/AuthContext'

const navLinkStyle = {
  fontSize: 14, fontWeight: 500, color: '#475569', textDecoration: 'none',
  padding: '8px 12px', borderRadius: 8,
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
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <a href="/#features" style={navLinkStyle}>Recursos</a>
          <a href="/#workflow" style={navLinkStyle}>Como funciona</a>
          <span style={{ width: 8 }} />

          {isAuthenticated ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: '1px solid #E2E8F0', borderRadius: 8,
                  padding: '7px 12px', cursor: 'pointer',
                  fontSize: 14, fontWeight: 500, color: '#020617',
                }}
              >
                {userName}
                <ChevronDown size={15} style={{ color: '#94A3B8', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {open && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                  background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,.08)', minWidth: 170, zIndex: 50,
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => { setOpen(false); navigate('/editar-perfil') }}
                    style={dropItemStyle}
                  >
                    <UserPen size={15} />
                    Editar perfil
                  </button>
                  <div style={{ height: 1, background: '#F1F5F9', margin: '2px 0' }} />
                  <button onClick={handleLogout} style={{ ...dropItemStyle, color: '#DC2626' }}>
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
  display: 'flex', alignItems: 'center', gap: 8,
  width: '100%', background: 'none', border: 'none',
  padding: '9px 14px', cursor: 'pointer',
  fontSize: 14, fontWeight: 500, color: '#020617',
  textAlign: 'left',
}
