import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import CadastroSeller from './pages/CadastroSeller'
import Login from './pages/Login'
import VerificacaoWhatsApp from './pages/VerificacaoWhatsApp'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastrar" element={<CadastroSeller />} />
          <Route path="/verificar" element={<VerificacaoWhatsApp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App