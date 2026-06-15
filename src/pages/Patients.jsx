import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Plus, X, Search } from 'lucide-react';

export default function Patients() {
  const { userData } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', age: '', notes: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [userData?.clinicId]);

  async function fetchPatients() {
    if (!userData?.clinicId) return;
    try {
      setLoading(true);
      const q = query(
        collection(db, 'patients'), 
        where('clinicId', '==', userData.clinicId),
        // orderBy('createdAt', 'desc') // Need index for this, let's keep it simple for now
      );
      const querySnapshot = await getDocs(q);
      const patientsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientsList);
    } catch (error) {
      console.error('Error fetching patients', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userData?.clinicId) return;

    try {
      setFormLoading(true);
      await addDoc(collection(db, 'patients'), {
        clinicId: userData.clinicId,
        ...formData,
        age: parseInt(formData.age, 10),
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', age: '', notes: '' });
      fetchPatients();
    } catch (error) {
      console.error('Error adding patient', error);
      alert('Error al guardar el paciente');
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Pacientes</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Nuevo Paciente
        </button>
      </div>

      <div className="table-container glass-panel">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando pacientes...</div>
        ) : patients.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No tienes pacientes registrados aún.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Edad</th>
                <th>Notas Médicas</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{patient.name}</td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>{patient.phone}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{patient.email}</div>
                  </td>
                  <td>{patient.age}</td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {patient.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', margin: '1rem', background: 'var(--bg-base)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Registrar Paciente</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Nombre Completo</label>
                <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Teléfono</label>
                  <input required type="tel" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Edad</label>
                  <input required type="number" min="0" className="input-field" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Correo Electrónico</label>
                <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Notas Médicas / Antecedentes</label>
                <textarea className="input-field" rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Guardando...' : 'Guardar Paciente'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
