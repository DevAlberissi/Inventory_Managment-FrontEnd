import { useParams } from 'react-router-dom'
import { Navbar, SectionHeader } from '../components'
import { colors, spacing } from '../styles/tokens'

const EditarProduto = () => {
  const { id } = useParams()

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: `${spacing[32]}px ${spacing[24]}px` }}>
        <SectionHeader
          title={`Editar Produto #${id}`}
          subtitle="Em construção — funcionalidade em breve."
        />
      </main>
    </div>
  )
}

export default EditarProduto
