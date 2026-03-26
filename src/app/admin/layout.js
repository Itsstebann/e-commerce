'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }
    const token = localStorage.getItem('admin_token');
    if (token) {
      const timestamp = parseInt(token.replace('logged_in_', ''), 10);
      const EIGHT_HOURS = 8 * 60 * 60 * 1000;
      if (!isNaN(timestamp) && (Date.now() - timestamp) < EIGHT_HOURS) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    } else {
      window.location.href = '/admin/login';
    }
  }, [pathname]);

  // Cerrar nav al cambiar de ruta
  useEffect(() => { setNavOpen(false); }, [pathname]);

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
    <div className="admin-wrapper" style={{ background: '#0A0A0A', color: '#fff', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar / Header mobile */}
      <aside className="admin-sidebar">
        {/* Cabecera (visible en mobile como topbar) */}
        <div className="admin-sidebar-header" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: 0, color: '#C9A96E' }}>
            ✦ Admin
          </h1>
          {/* Botón cerrar sesión solo visible en desktop en la cabecera */}
          <button
            onClick={handleLogout}
            style={{ background: 'transparent', border: '1px solid #333', color: '#666', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            🚪 Salir
          </button>
        </div>

        {/* Navegación */}
        <nav className="admin-sidebar-nav" style={{ flex: 1, padding: '1.5rem 0', display: 'flex', flexDirection: 'column' }}>
          {navItems.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="admin-nav-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 2rem',
                  color: isActive ? '#C9A96E' : '#888',
                  background: isActive ? 'rgba(201,169,110,0.1)' : 'transparent',
                  borderRight: isActive ? '3px solid #C9A96E' : '3px solid transparent',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
