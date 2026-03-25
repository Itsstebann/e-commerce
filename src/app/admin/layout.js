'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificacion tonta por ahora
  useEffect(() => {
    // Si estamos en /admin/login no forzamos auth en el layout
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      window.location.href = '/admin/login';
    }
  }, [pathname]);

  if (!isAuthenticated) return null;

  if (pathname === '/admin/login') {
    return <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>{children}</div>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Pedidos', path: '/admin/orders', icon: '🛒' },
    { name: 'Productos', path: '/admin/products', icon: '🛍️' },
  ];

  function handleLogout() {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: '#111', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid #333' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0 }}>Aurumea Admin</h1>
        </div>
        
        <nav style={{ flex: 1, padding: '1.5rem 0' }}>
          {navItems.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 2rem',
                  color: isActive ? '#C9A96E' : '#888',
                  background: isActive ? 'rgba(201, 169, 110, 0.1)' : 'transparent',
                  borderRight: isActive ? '3px solid #C9A96E' : '3px solid transparent',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 400
                }}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '2rem', borderTop: '1px solid #333' }}>
          <button 
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid #333',
              color: '#888',
              padding: '0.75rem 1rem',
              width: '100%',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#666'; }}
            onMouseOut={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333'; }}
          >
            <span>🚪</span> Cerrar Sesion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
