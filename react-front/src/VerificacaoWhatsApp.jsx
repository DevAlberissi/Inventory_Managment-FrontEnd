import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TOTAL_DIGITS = 4;

const maskPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8) return phone;
  return `(**) *****-${digits.slice(-4)}`;
};

const VerificacaoWhatsApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone ?? '';
  const email = location.state?.email ?? '';

  const [digits, setDigits] = useState(Array(TOTAL_DIGITS).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (index, value) => {
    const char = value.replace(/\D/g, '').slice(-1);
    setError('');
    setDigits(prev => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < TOTAL_DIGITS - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, TOTAL_DIGITS);
    setDigits(prev => {
      const next = [...prev];
      pasted.split('').forEach((char, i) => { next[i] = char; });
      return next;
    });
    const nextFocus = Math.min(pasted.length, TOTAL_DIGITS - 1);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < TOTAL_DIGITS) return;

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/users/activate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        setError('Código inválido. Verifique e tente novamente.');
        setDigits(Array(TOTAL_DIGITS).fill(''));
        inputRefs.current[0]?.focus();
        return;
      }

      navigate('/login');
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setCooldown(60);
    try {
      await fetch('http://localhost:5000/resend-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
    } catch {
      // silent — user can retry after cooldown
    }
  };

  const isComplete = digits.every(d => d !== '');

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconBox}>💬</div>

        <h1 style={styles.title}>Verificação</h1>
        <p style={styles.subtitle}>
          Enviamos um código de 4 dígitos via WhatsApp para
          {phone && (
            <>
              <br />
              <strong style={styles.phoneHighlight}>{maskPhone(phone)}</strong>
            </>
          )}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.digitsRow} onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={el => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                autoFocus={i === 0}
                style={
                  error
                    ? { ...styles.digitInput, ...styles.digitInputError }
                    : digit
                    ? { ...styles.digitInput, ...styles.digitInputFilled }
                    : styles.digitInput
                }
              />
            ))}
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button
            type="submit"
            disabled={!isComplete || isLoading}
            style={
              !isComplete || isLoading
                ? { ...styles.button, ...styles.buttonDisabled }
                : styles.button
            }
          >
            {isLoading ? 'Verificando...' : 'Confirmar código'}
          </button>
        </form>

        <div style={styles.resendRow}>
          <span style={styles.resendText}>Não recebeu? </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            style={
              cooldown > 0
                ? { ...styles.resendButton, ...styles.resendButtonDisabled }
                : styles.resendButton
            }
          >
            {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar código'}
          </button>
        </div>

        <button type="button" onClick={() => navigate('/cadastrar')} style={styles.backButton}>
          ← Voltar para o cadastro
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    fontFamily: 'sans-serif',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  iconBox: {
    backgroundColor: '#25d366',
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '24px',
    fontSize: '28px',
  },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#0a1d37', margin: '0 0 8px 0' },
  subtitle: { color: '#6c757d', marginBottom: '32px', lineHeight: '1.6', fontSize: '14px' },
  phoneHighlight: { color: '#0a1d37' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' },
  digitsRow: { display: 'flex', gap: '12px', justifyContent: 'center' },
  digitInput: {
    width: '60px',
    height: '64px',
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    outline: 'none',
    color: '#0a1d37',
  },
  digitInputFilled: { borderColor: '#007bff', backgroundColor: '#eff6ff' },
  digitInputError: { borderColor: '#dc3545', backgroundColor: '#fff5f5' },
  errorText: { color: '#dc3545', fontSize: '13px', margin: 0 },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  buttonDisabled: { backgroundColor: '#a0c4ff', cursor: 'not-allowed' },
  resendRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    marginTop: '24px',
  },
  resendText: { color: '#6c757d', fontSize: '14px' },
  resendButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
  },
  resendButtonDisabled: { color: '#a0aec0', cursor: 'not-allowed' },
  backButton: {
    backgroundColor: 'transparent',
    color: '#6c757d',
    border: 'none',
    padding: '12px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '8px',
  },
};

export default VerificacaoWhatsApp;
