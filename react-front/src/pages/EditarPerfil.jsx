import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { Button, Card, Field, Input, Navbar, IconBox } from '../components'

const EditarPerfil = () => {
  return (
    <div  style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <IconBox icon={<UserPlus />} tone="accent" size={48} radius={12} />
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#020617' }}>Edite seu perfil</h2>
          </div>
        </div>

        <Card padding={32}>
          <p style={{ margin: '0 0 24px', color: '#64748B', fontSize: 14 }}>Atualize as informações da sua conta para manter seu perfil sempre atualizado.</p>
        

        </Card>
      </main>
    </div>
  )
}

export default EditarPerfil
