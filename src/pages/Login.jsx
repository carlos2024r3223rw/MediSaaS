import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { loginWithGoogle, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setError('Failed to log in with Google. ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1.5rem' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>M</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Bienvenido a MediSaaS</h1>
          <p style={{ fontSize: '0.95rem' }}>Gestiona tu consultorio médico de forma segura y moderna.</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

        <button 
          className="btn btn-primary" 
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          <LogIn size={20} />
          {loading ? 'Iniciando...' : 'Iniciar sesión con Google'}
        </button>
      </div>
    </div>
  );
}
