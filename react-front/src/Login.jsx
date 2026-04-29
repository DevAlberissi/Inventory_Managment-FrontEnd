import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || 'Erro ao fazer login');
      }

      // Armazena o token no localStorage
      localStorage.setItem('token', data.token);
      
      alert('Login realizado com sucesso!');
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoBox}>
          <img 
            src="https://img.icons8.com/color/96/box--v1.png" 
            alt="Logo" 
            style={styles.logoIcon} 
          />
        </div>
        
        <h1 style={styles.title}>Login</h1>
        <p style={styles.subtitle}>
          Acesse sua conta StockHub
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button onClick={() => navigate('/')} style={styles.backButton}>
          ← Voltar para Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', fontFamily: 'sans-serif' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  logoBox: { backgroundColor: '#007bff', width: '60px', height: '60px', borderRadius: '12px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' },
  logoIcon: { width: '35px', filter: 'brightness(0) invert(1)' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#0a1d37', margin: '0 0 8px 0' },
  subtitle: { color: '#6c757d', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { textAlign: 'left' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#0a1d37', marginBottom: '6px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '16px', boxSizing: 'border-box' },
  button: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  backButton: { backgroundColor: 'transparent', color: '#6c757d', border: 'none', padding: '12px', fontSize: '14px', cursor: 'pointer', marginTop: '16px' },
  error: { backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '8px', fontSize: '14px', border: '1px solid #f5c6cb' }
};

export default Login;