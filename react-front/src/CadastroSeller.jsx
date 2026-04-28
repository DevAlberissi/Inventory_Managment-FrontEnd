import React from 'react';
import { useNavigate } from 'react-router-dom';

const CadastroSeller = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    nome: '',
    email: '',
    telefone: '',
    cpfCnpj: '',
    empresa: '',
    categoria: '',
    endereco: '',
    observacoes: '',
    senha: ''  // ← NOVO CAMPO ADICIONADO
  });

  async function handleSubmit(e) {
    e.preventDefault(); 
    
    if (!formData.nome || !formData.email || !formData.telefone || !formData.cpfCnpj || !formData.empresa || !formData.endereco || !formData.senha) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    // Mapear campos do frontend para o formato do backend
    const payload = {
      name: formData.nome,
      email: formData.email,
      cnpj: formData.cpfCnpj,
      celular: formData.telefone,
      password: formData.senha
    };

    let req = await fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!req.ok) {
      alert('Erro ao cadastrar seller.');
      return;
    }

    alert('Seller cadastrado com sucesso!');
    navigate('/');
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logoBrand}>
          <div style={styles.miniLogo}>📦</div>
          <span style={styles.brandName}>StockHub</span>
        </div>
        <button onClick={() => navigate('/')} style={styles.backButton}>← Voltar</button>
      </header>

      <main style={styles.container}>
        <div style={styles.titleSection}>
          <div style={styles.iconCircle}>👤+</div>
          <div>
            <h2 style={styles.formTitle}>Cadastrar novo Seller</h2>
            <p style={styles.formSubtitle}>Preencha os dados do parceiro vendedor que terá acesso ao estoque.</p>
          </div>
        </div>

        <div style={styles.card}>
          <form style={styles.form}>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>👤 Nome completo</label>
                <input style={styles.input} type="text" placeholder="João da Silva" name="nome" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>✉️ E-mail</label>
                <input style={styles.input} type="email" placeholder="joao@empresa.com" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>📞 Telefone</label>
                <input style={styles.input} type="text" placeholder="(11) 98765-4321" name="telefone" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}># CPF / CNPJ</label>
                <input style={styles.input} type="text" placeholder="000.000.000-00" name="cpfCnpj" value={formData.cpfCnpj} onChange={(e) => setFormData({...formData, cpfCnpj: e.target.value})} />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>🏢 Empresa</label>
                <input style={styles.input} type="text" placeholder="Nome da empresa" name="empresa" value={formData.empresa} onChange={(e) => setFormData({...formData, empresa: e.target.value})} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>🔒 Senha</label>
                <input style={styles.input} type="password" placeholder="Digite uma senha" name="senha" value={formData.senha} onChange={(e) => setFormData({...formData, senha: e.target.value})} />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>🛍️ Categoria</label>
                <select style={styles.input} name="categoria" value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})}>
                  <option value="">Selecione</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>📍 Endereço</label>
                <input style={styles.input} type="text" placeholder="Rua, número, bairro, cidade - UF" name="endereco" value={formData.endereco} onChange={(e) => setFormData({...formData, endereco: e.target.value})} />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Observações</label>
              <textarea style={{...styles.input, height: '100px'}} placeholder="Informações adicionais sobre o seller (opcional)" name="observacoes" value={formData.observacoes} onChange={(e) => setFormData({...formData, observacoes: e.target.value})} />
            </div>

            <div style={styles.buttonRow}>
              <button type="button" onClick={() => setFormData({nome: '', email: '', telefone: '', cpfCnpj: '', empresa: '', categoria: '', endereco: '', observacoes: '', senha: ''})} style={styles.btnClean}>Limpar</button>
              <button type="button" onClick={handleSubmit} style={styles.btnSubmit}>Cadastrar Seller</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', backgroundColor: 'white', borderBottom: '1px solid #edf2f7' },
  logoBrand: { display: 'flex', alignItems: 'center', gap: '8px' },
  miniLogo: { backgroundColor: '#007bff', color: 'white', padding: '4px', borderRadius: '4px' },
  brandName: { fontWeight: 'bold', color: '#0a1d37' },
  backButton: { background: 'none', border: 'none', color: '#6c757d', cursor: 'pointer' },
  container: { maxWidth: '900px', margin: '40px auto', padding: '0 20px' },
  titleSection: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' },
  iconCircle: { backgroundColor: '#d1e7ff', color: '#007bff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' },
  formTitle: { margin: 0, color: '#0a1d37' },
  formSubtitle: { margin: '4px 0 0 0', color: '#6c757d', fontSize: '14px' },
  card: { backgroundColor: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row: { display: 'flex', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  label: { fontSize: '14px', fontWeight: '600', color: '#4a5568' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', outline: 'none' },
  buttonRow: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' },
  btnClean: { padding: '12px 24px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' },
  btnSubmit: { padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#007bff', color: 'white', fontWeight: 'bold', cursor: 'pointer' }
};

export default CadastroSeller;