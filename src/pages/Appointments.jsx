import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { Plus, X, Calendar as CalendarIcon, Clock, Mail } from 'lucide-react';

export default function Appointments() {
  const { userData } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Notification Simulation State
  const [emailNotification, setEmailNotification] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    patientId: '', date: '', time: '', reason: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [userData?.clinicId]);

  async function fetchData() {
    if (!userData?.clinicId) return;
    try {
      setLoading(true);
      // Fetch Patients for dropdown
      const qPatients = query(collection(db, 'patients'), where('clinicId', '==', userData.clinicId));
      const patientsSnap = await getDocs(qPatients);
      const patientsList = patientsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPatients(patientsList);

      // Fetch Appointments
      const qAppointments = query(collection(db, 'appointments'), where('clinicId', '==', userData.clinicId));
      const appsSnap = await getDocs(qAppointments);
      
      const appsList = await Promise.all(appsSnap.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const patientData = patientsList.find(p => p.id === data.patientId);
        return {
          id: docSnap.id,
          ...data,
          patientName: patientData ? patientData.name : 'Desconocido',
          patientEmail: patientData ? patientData.email : ''
        };
      }));
      
      // Sort in JS to avoid needing complex composite indexes right away
      appsList.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
      
      setAppointments(appsList);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userData?.clinicId) return;

    try {
      setFormLoading(true);
      
      const selectedPatient = patients.find(p => p.id === formData.patientId);

      await addDoc(collection(db, 'appointments'), {
        clinicId: userData.clinicId,
        patientId: formData.patientId,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        status: 'scheduled',
        createdAt: serverTimestamp()
      });
      
      setIsModalOpen(false);
      
      // Simular Cloud Function Wow Effect
      if (selectedPatient && selectedPatient.email) {
        setEmailNotification(`¡Magia! Se ha "enviado" un correo automático a ${selectedPatient.email} con los detalles de su cita.`);
        setTimeout(() => setEmailNotification(null), 5000);
      }

      setFormData({ patientId: '', date: '', time: '', reason: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding appointment', error);
      alert('Error al guardar la cita');
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Citas Médicas</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Agendar Cita
        </button>
      </div>

      {emailNotification && (
        <div className="animate-fade-in" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Mail size={20} />
          <span>{emailNotification}</span>
        </div>
      )}

      <div className="table-container glass-panel">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando citas...</div>
        ) : appointments.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No tienes citas programadas aún.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Fecha y Hora</th>
                <th>Motivo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(app => (
                <tr key={app.id}>
                  <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{app.patientName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <CalendarIcon size={14} color="var(--text-secondary)" /> {app.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      <Clock size={14} color="var(--text-secondary)" /> {app.time}
                    </div>
                  </td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {app.reason}
                  </td>
                  <td>
                    <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: '600' }}>Programada</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Agendar Nueva Cita</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Paciente</label>
                <select required className="input-field" value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                  <option value="" disabled>Selecciona un paciente</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} {p.email ? `(${p.email})` : ''}</option>
                  ))}
                </select>
                {patients.length === 0 && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>Primero debes registrar pacientes.</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Fecha</label>
                  <input required type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Hora</label>
                  <input required type="time" className="input-field" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Motivo de Consulta</label>
                <textarea required className="input-field" rows="3" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="Ej. Chequeo general, Dolor de cabeza..."></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading || patients.length === 0}>
                  {formLoading ? 'Guardando...' : 'Agendar Cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
