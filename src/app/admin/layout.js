'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth <= 768);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  /* ── MOBILE LAYOUT ── */
  if (isMobile) {
    return (
      <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
        {/* Topbar */}
        <div style={{ background: '#111', borderBottom: '1px solid #222', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <span style={{ fontFamily: 'var(--font-heading)', color: '#C9A96E', fontSize: '1.1rem' }}>✦ Admin</span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setNavOpen(o => !o)}
              style={{ background: 'transparent', border: '1px solid #333', color: '#aaa', padding: '0.4rem 0.8rem', borderRadius: 6, cursor: 'pointer', fontSize: '1.1rem' }}
            >
              {navOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Dropdown nav */}
        {navOpen && (
          <div style={{ background: '#111', borderBottom: '1px solid #222' }}>
            {navItems.map(item => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.9rem 1.5rem',
                    color: isActive ? '#C9A96E' : '#888',
                    background: isActive ? 'rgba(201,169,110,0.1)' : 'transparent',
                    borderLeft: isActive ? '3px solid #C9A96E' : '3px solid transparent',
                    textDecoration: 'none', fontWeight: isActive ? 600 : 400,
                    borderBottom: '1px solid #1a1a1a',
                  }}
                >
                  <span>{item.icon}</span>{item.name}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.9rem 1.5rem', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)' }}
            >
              🚪 Cerrar sesión
            </button>
          </div>
        )}

        {/* Contenido */}
        <main style={{ padding: '1.5rem 1rem' }}>
          {children}
        </main>
      </div>
    );
  }

  /* ── DESKTOP LAYOUT ── */
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <aside style={{ width: 250, flexShrink: 0, background: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.75rem 2rem', borderBottom: '1px solid #222' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', margin: 0, color: '#C9A96E' }}>✦ Admin</h1>
        </div>

        <nav style={{ flex: 1, paddingTop: '1.5rem' }}>
          {navItems.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 2rem',
                  color: isActive ? '#C9A96E' : '#888',
                  background: isActive ? 'rgba(201,169,110,0.1)' : 'transparent',
                  borderRight: isActive ? '3px solid #C9A96E' : '3px solid transparent',
                  transition: 'all 0.2s', textDecoration: 'none',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <span>{item.icon}</span>{item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #222' }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent', border: '1px solid #333', color: '#888',
              padding: '0.75rem 1rem', width: '100%', borderRadius: 6, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              fontFamily: 'var(--font-body)',
            }}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
