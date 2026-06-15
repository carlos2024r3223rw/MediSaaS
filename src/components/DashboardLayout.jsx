import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, Calendar, LogOut, Menu, X } from 'lucide-react';

export default function DashboardLayout() {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Panel Principal', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pacientes', href: '/dashboard/patients', icon: Users },
    { name: 'Citas Médicas', href: '/dashboard/appointments', icon: Calendar },
  ];

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  const navClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2";
  const getNavStyle = (path) => {
    const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
    return {
      display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px',
      textDecoration: 'none', marginBottom: '0.5rem', transition: 'all 0.3s ease',
      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
      borderLeft: isActive ? '4px solid var(--accent-primary)' : '4px solid transparent',
      fontWeight: isActive ? '600' : '500'
    };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Desktop */}
      <aside className="glass-panel" style={{ width: '260px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--glass-border)', borderRadius: '0', position: 'fixed', height: '100vh', zIndex: 10 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>M</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>MediSaaS</h2>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.href} style={getNavStyle(item.href)}>
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
             <img 
               src={currentUser?.photoURL || 'https://via.placeholder.com/40'} 
               alt="Profile" 
               referrerPolicy="no-referrer"
               style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
             />
             <div style={{ overflow: 'hidden' }}>
               <p style={{ fontSize: '0.875rem', fontWeight: '600', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{currentUser?.displayName}</p>
               <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{currentUser?.email}</p>
             </div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '2rem' }}>
        <div className="container animate-fade-in" style={{ maxWidth: '1000px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
