import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Building2 } from 'lucide-react';

export default function Onboarding() {
  const { currentUser, setUserData } = useAuth();
  const [clinicName, setClinicName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!clinicName.trim()) {
      return setError('Por favor ingresa el nombre de tu consultorio o clínica.');
    }

    try {
      setError('');
      setLoading(true);

      // 1. Create the clinic
      const clinicRef = await addDoc(collection(db, 'clinics'), {
        name: clinicName.trim(),
        ownerUid: currentUser.uid,
        createdAt: serverTimestamp()
      });

      // 2. Create the user profile linked to the clinic
      const userData = {
        email: currentUser.email,
        displayName: currentUser.displayName,
        clinicId: clinicRef.id,
        createdAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', currentUser.uid), userData);

      // 3. Update local state
      setUserData(userData);

      // 4. Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating clinic:', error);
      setError('Hubo un problema al configurar tu consultorio. ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1.5rem' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '450px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Building2 size={32} color="var(--accent-primary)" />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Configura tu Espacio</h1>
          <p style={{ fontSize: '0.95rem' }}>Para comenzar, necesitamos saber el nombre de tu clínica o consultorio privado.</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="clinicName">Nombre de la Clínica / Consultorio</label>
            <input 
              id="clinicName"
              type="text" 
              className="input-field" 
              placeholder="Ej. Consultorio Dr. Pérez"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
          >
            {loading ? 'Creando espacio seguro...' : 'Comenzar a trabajar'}
          </button>
        </form>
      </div>
    </div>
  );
}
