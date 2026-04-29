import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { Button, Card, Field, Input, Navbar, IconBox } from '../components'
import { usersService } from '../services/users.service'

const EMPTY_FORM = { nome: '', email: '', telefone: '', cpfCnpj: '', senha: '' }

const CadastroSeller = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(EMPTY_FORM)

  const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.nome || !formData.email || !formData.cpfCnpj || !formData.senha) {
      alert('Por favor, preencha os campos obrigatórios.')
      return
    }

    try {
      await usersService.create({
        name: formData.nome,
        email: formData.email,
        cnpj: formData.cpfCnpj,
        celular: formData.telefone,
        password: formData.senha,
      })
      navigate('/verificar', { state: { phone: formData.telefone, email: formData.email } })
    } catch {
      alert('Erro ao cadastrar seller.')
    }
  }

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <IconBox icon={<UserPlus />} tone="accent" size={48} radius={12} />
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#020617' }}>Cadastrar novo Seller</h2>
            <p style={{ margin: '2px 0 0', color: '#64748B', fontSize: 14 }}>Preencha os dados do parceiro vendedor que terá acesso ao estoque.</p>
          </div>
        </div>

        <Card padding={32}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <Field label="Nome completo">
                <Input placeholder="João da Silva" value={formData.nome} onChange={set('nome')} />
              </Field>
              <Field label="E-mail">
                <Input type="email" placeholder="joao@empresa.com" value={formData.email} onChange={set('email')} />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <Field label="CNPJ *">
                <Input placeholder="00.000.000/0001-00" value={formData.cpfCnpj} onChange={set('cpfCnpj')} />
              </Field>
              <Field label="Celular (opcional)">
                <Input placeholder="(11) 98765-4321" value={formData.telefone} onChange={set('telefone')} />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <Field label="Senha *">
                <Input type="password" placeholder="Digite uma senha" value={formData.senha} onChange={set('senha')} />
              </Field>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
              <Button variant="secondary" type="button" onClick={() => setFormData(EMPTY_FORM)}>Limpar</Button>
              <Button variant="primary" type="submit">Cadastrar Seller</Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}

export default CadastroSeller
