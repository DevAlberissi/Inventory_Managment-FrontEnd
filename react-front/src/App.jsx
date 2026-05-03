import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import CadastroSeller from './pages/CadastroSeller'
import Login from './pages/Login'
import VerificacaoWhatsApp from './pages/VerificacaoWhatsApp'
import EditarPerfil from './pages/EditarPerfil'
import CadastroProduto from './pages/CadastroProduto'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastrar" element={<CadastroSeller />} />
          <Route path="/verificar" element={<VerificacaoWhatsApp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/editar-perfil" element={<EditarPerfil />} />
          <Route path="/produtos/novo" element={<CadastroProduto />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App