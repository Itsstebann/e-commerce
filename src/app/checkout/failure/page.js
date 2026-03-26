'use client';

import Link from 'next/link';

export default function CheckoutFailure() {
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
        {/* Icono */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(248,113,113,0.12)', border: '2px solid #f87171',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', margin: '0 auto 1.5rem',
        }}>
          ✕
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: '1.75rem',
          color: '#f87171', marginBottom: '0.75rem',
        }}>
          Pago no procesado
        </h1>

        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Hubo un problema al procesar tu pago. No se realizó ningún cargo a tu cuenta.
          Puedes intentarlo de nuevo o contactarnos directamente.
        </p>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          ¿Necesitas ayuda?{' '}
          <a
            href={`https://wa.me/573202848069?text=${encodeURIComponent('Hola, tuve un problema al pagar en AurumeAcol y necesito ayuda')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#25D366', fontWeight: 600 }}
          >
            Escríbenos por WhatsApp
          </a>
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/checkout" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent)', color: '#000',
            fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
          }}>
            Intentar de nuevo
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
