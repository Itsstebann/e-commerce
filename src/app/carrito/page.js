'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '6rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.75rem' }}>
          Tu carrito esta vacio
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          Explora nuestro catalogo y encuentra tu fragancia ideal
        </p>
        <Link href="/catalogo" className="btn btn-primary btn-lg">
          Ver Catalogo
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 'var(--max-width)',
      margin: '0 auto',
      padding: '2rem 1.5rem',
    }}>
      <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
        Tu <span>Carrito</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
        {/* Lista de productos */}
        <div>
          {items.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              gap: '1.5rem',
              padding: '1.5rem 0',
              borderBottom: '1px solid var(--color-border)',
              alignItems: 'center',
            }}>
              <div style={{
                width: 100,
                height: 100,
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                flexShrink: 0,
              }}>
                {item.imagen_url ? (
                  <img src={item.imagen_url} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                ) : '🌸'}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                  {item.nombre}
                </h3>
                <p style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '1.1rem' }}>
                  {formatPrice(item.precio_oferta || item.precio)}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{ width: 36, height: 36, background: 'var(--color-bg-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >-</button>
                <span style={{ width: 40, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ width: 36, height: 36, background: 'var(--color-bg-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >+</button>
              </div>

              <p style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: 100, textAlign: 'right' }}>
                {formatPrice((item.precio_oferta || item.precio) * item.quantity)}
              </p>

              <button
                onClick={() => removeItem(item.id)}
                style={{ color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.5rem' }}
                aria-label="Eliminar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Resumen de la compra */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          border: '1px solid var(--color-border)',
          position: 'sticky',
          top: 'calc(var(--header-height) + 2rem)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
            Resumen del pedido
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            <span>Envio</span>
            <span style={{ color: 'var(--color-success)' }}>{totalPrice >= 999 ? 'Gratis' : formatPrice(99)}</span>
          </div>
          <div style={{ height: 1, background: 'var(--color-border)', margin: '1rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--color-accent)' }}>
              {formatPrice(totalPrice + (totalPrice >= 999 ? 0 : 99))}
            </span>
          </div>

          <Link
            href="/checkout"
            className="btn btn-primary"
            style={{ width: '100%', textAlign: 'center', display: 'flex' }}
            id="go-to-checkout"
          >
            Ir al Checkout
          </Link>

          <Link
            href="/catalogo"
            style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
