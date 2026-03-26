'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CheckoutPending() {
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('external_reference') || params.get('preference_id') || '';
    if (ref) setOrderId(ref.split('-')[0].toUpperCase());
  }, []);

  return (
    <div style={{
      minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        textAlign: 'center', maxWidth: '480px', width: '100%',
        background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)',
        padding: '3rem 2.5rem', border: '1px solid var(--color-border)',
      }}>
        {/* Icono animado */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(250,204,21,0.12)', border: '2px solid #facc15',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', margin: '0 auto 1.5rem',
          animation: 'pulse 2s infinite',
        }}>
          ⏳
        </div>

        <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }`}</style>

        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: '1.75rem',
          color: '#facc15', marginBottom: '0.75rem',
        }}>
          Pago en proceso
        </h1>

        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
          Tu pago está siendo verificado. Esto puede tomar unos minutos.
          Te notificaremos por correo cuando se confirme.
        </p>

        {orderId && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Referencia: <strong style={{ color: 'var(--color-accent)', fontFamily: 'monospace' }}>#{orderId}</strong>
          </p>
        )}

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          ¿Tienes dudas?{' '}
          <a
            href={`https://wa.me/573202848069?text=${encodeURIComponent('Hola, realicé un pago en AurumeAcol y está pendiente de confirmación')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#25D366', fontWeight: 600 }}
          >
            Contáctanos por WhatsApp
          </a>
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent)', color: '#000',
            fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
          }}>
            Volver al inicio
          </Link>
          <Link href="/catalogo" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)',
            fontWeight: 500, textDecoration: 'none', fontSize: '0.9rem',
          }}>
            Ver catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
