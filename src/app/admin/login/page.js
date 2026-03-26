'use client';
import { useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Itsstech1028';
    if (password === correctPassword) {
      localStorage.setItem('admin_token', 'logged_in_' + Date.now());
      window.location.href = '/admin';
    } else {
      setError('Contraseña incorrecta');
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ background: '#111', padding: '3rem', borderRadius: '8px', border: '1px solid #333', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#C9A96E', marginBottom: '2rem' }}>Aurumea Admin</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <input 
              type="password" 
              placeholder="Contrasena de administrador" 
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#0a0a0a',
                border: '1px solid #333',
                color: '#fff',
                borderRadius: '4px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#C9A96E'}
              onBlur={e => e.target.style.borderColor = '#333'}
            />
            {error && <p style={{ color: '#ff4444', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'left' }}>{error}</p>}
          </div>

          <button 
            type="submit"
            style={{
              background: '#C9A96E',
              color: '#000',
              border: 'none',
              padding: '1rem',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.opacity = 0.9}
            onMouseOut={e => e.currentTarget.style.opacity = 1}
          >
            Ingresar
          </button>
        </form>
        

      </div>
    </div>
  );
}
