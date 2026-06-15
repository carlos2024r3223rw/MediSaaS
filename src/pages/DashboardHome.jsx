import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function DashboardHome() {
  const { userData } = useAuth();
  const [stats, setStats] = useState({ patients: 0, appointmentsToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!userData?.clinicId) return;
      try {
        const qPatients = query(collection(db, 'patients'), where('clinicId', '==', userData.clinicId));
        const snapPatients = await getDocs(qPatients);
        
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const qAppointments = query(collection(db, 'appointments'), 
          where('clinicId', '==', userData.clinicId),
          where('date', '==', today)
        );
        const snapAppointments = await getDocs(qAppointments);

        setStats({
          patients: snapPatients.size,
          appointmentsToday: snapAppointments.size
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [userData?.clinicId]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Resumen del Consultorio</h1>
        <p>Bienvenido de vuelta. Aquí está el resumen de hoy para tu clínica.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Pacientes Totales</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0.5rem 0' }}>
            {loading ? '-' : stats.patients}
          </p>
        </div>
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Citas Hoy</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', margin: '0.5rem 0' }}>
            {loading ? '-' : stats.appointmentsToday}
          </p>
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem' }}>Configuración Completada 🎉</h3>
        <p>Tu clínica está lista. Usa el menú lateral para gestionar tus pacientes y agenda diaria de forma segura.</p>
      </div>
    </div>
  );
}
