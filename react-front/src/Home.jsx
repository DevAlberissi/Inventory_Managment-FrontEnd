import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.logoBox}>
          <img 
            src="https://img.icons8.com/color/96/box--v1.png" 
            alt="Logo" 
            style={styles.logoIcon} 
          />
        </div>
        
        <h1 style={styles.title}>StockHub — Gestão de Estoque</h1>
        <p style={styles.subtitle}>
          Gerencie seus sellers, produtos e movimentações de estoque em um só lugar.
        </p>

        <button onClick={() => navigate('/cadastrar')} style={styles.button}>
          <span style={{ marginRight: '8px' }}>👤+</span>
          Cadastrar novo Seller
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', fontFamily: 'sans-serif' },
  content: { textAlign: 'center' },
  logoBox: { backgroundColor: '#007bff', width: '60px', height: '60px', borderRadius: '12px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' },
  logoIcon: { width: '35px', filter: 'brightness(0) invert(1)' },
  title: { fontSize: '32px', fontWeight: 'bold', color: '#0a1d37', margin: '0 0 8px 0' },
  subtitle: { color: '#6c757d', marginBottom: '32px' },
  button: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }
};

export default Home;