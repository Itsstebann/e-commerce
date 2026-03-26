'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    notas: '',
  });
  const [loading, setLoading] = useState(false);

  const shippingCost = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + shippingCost;

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customer: formData,
          shippingCost,
          total
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Mostrar el detalle exacto de MercadoPago para facilitar el diagnóstico
        const detail = data.detail ? `\n\nDetalle: ${data.detail}` : '';
        throw new Error((data.error || 'Error al procesar el pago') + detail);
      }

      // Redirigir a MercadoPago
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error('[Checkout] Error:', error.message);
      alert(`Hubo un error al iniciar el pago.\n\n${error.message}`);
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '6rem 1.5rem',
        textAlign: 'center',
      }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.75rem' }}>
          No hay productos en tu carrito
        </h1>
        <Link href="/catalogo" className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          Ver Catalogo
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 'var(--max-width)',
      margin: '0 auto',
      padding: '2rem 1.5rem 4rem',
    }}>
      <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <span>Checkout</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'start' }}>
        {/* Formulario */}
        <form onSubmit={handleSubmit} id="checkout-form">
          <div style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            border: '1px solid var(--color-border)',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              Informacion de contacto
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  id="checkout-nombre"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  id="checkout-email"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                  Telefono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  id="checkout-telefono"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            border: '1px solid var(--color-border)',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              Direccion de envio
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                  Direccion completa *
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  id="checkout-direccion"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                    id="checkout-ciudad"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'var(--color-bg-tertiary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                    Codigo Postal
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    id="checkout-cp"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'var(--color-bg-tertiary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                  Notas adicionales
                </label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows={3}
                  id="checkout-notas"
                  placeholder="Instrucciones especiales de entrega..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
            id="submit-checkout"
          >
            {loading ? 'Procesando...' : `Pagar ${formatPrice(total)}`}
          </button>
        </form>

        {/* Resumen del pedido */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          border: '1px solid var(--color-border)',
          position: 'sticky',
          top: 'calc(var(--header-height) + 2rem)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '1.5rem' }}>
            Tu pedido
          </h3>

          {items.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: '1px solid var(--color-border)',
              fontSize: '0.9rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0,
                }}>
                  🌸
                </div>
                <div>
                  <p style={{ fontWeight: 500 }}>{item.nombre}</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    x{item.quantity}
                  </p>
                </div>
              </div>
              <span style={{ fontWeight: 600 }}>
                {formatPrice((item.precio_oferta || item.precio) * item.quantity)}
              </span>
            </div>
          ))}

          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              <span>Envio</span>
              <span style={{ color: shippingCost === 0 ? 'var(--color-success)' : 'inherit' }}>
                {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
              </span>
            </div>
            <div style={{ height: 1, background: 'var(--color-border)', margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--color-accent)' }}>
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--color-accent-glow)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(201, 169, 110, 0.2)',
          }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-accent)', textAlign: 'center' }}>
              Pago seguro via MercadoPago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
