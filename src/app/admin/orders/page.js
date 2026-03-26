'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/formatPrice';

const STATUS_CONFIG = {
  pendiente:  { label: 'Pendiente',  bg: 'rgba(250,204,21,0.12)',  color: '#facc15' },
  pagado:     { label: 'Pagado',     bg: 'rgba(74,222,128,0.12)',  color: '#4ade80' },
  enviado:    { label: 'Enviado',    bg: 'rgba(96,165,250,0.12)',  color: '#60a5fa' },
  entregado:  { label: 'Entregado', bg: 'rgba(52,211,153,0.12)',  color: '#34d399' },
  rechazado:  { label: 'Rechazado', bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: '#222', color: '#888' };
  return (
    <span style={{
      padding: '0.25rem 0.75rem',
      borderRadius: '99px',
      fontSize: '0.78rem',
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
      textTransform: 'capitalize',
      letterSpacing: '0.02em',
    }}>
      {cfg.label}
    </span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  async function loadOrders() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('creado_en', { ascending: false });
      if (!error && data) setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOrders(); }, []);

  async function openDetail(order) {
    setSelectedOrder(order);
    setOrderItems([]);
    setLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from('pedido_items')
        .select('*')
        .eq('pedido_id', order.id);
      if (!error && data) setOrderItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItems(false);
    }
  }

  async function updateStatus(id, newStatus) {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ estado: newStatus })
        .eq('id', id);
      if (!error) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, estado: newStatus } : o));
        if (selectedOrder?.id === id) {
          setSelectedOrder(prev => ({ ...prev, estado: newStatus }));
        }
      } else {
        alert('Error al actualizar estado');
      }
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = orders.filter(o =>
    o.cliente_nombre?.toLowerCase().includes(search.toLowerCase()) ||
    o.cliente_email?.toLowerCase().includes(search.toLowerCase()) ||
    o.id?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#888', padding: '4rem 0' }}>
      <span style={{ width: 20, height: 20, border: '2px solid #333', borderTop: '2px solid #C9A96E', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
      Cargando pedidos...
    </div>
  );

  return (
    <div style={{ position: 'relative' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#C9A96E', margin: 0, fontSize: '1.75rem' }}>Gestión de Pedidos</h1>
          <p style={{ color: '#666', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>{orders.length} pedidos en total</p>
        </div>
        <button onClick={loadOrders} style={{ background: '#1a1a1a', color: '#888', border: '1px solid #333', padding: '0.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#fff'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888'; }}>
          ↻ Actualizar
        </button>
      </div>

      {/* Buscador */}
      <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#555', pointerEvents: 'none' }}>🔍</span>
        <input
          type="text"
          placeholder="Buscar por cliente, email o ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem',
            background: '#111', border: '1px solid #333', borderRadius: '8px',
            color: '#fff', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Tabla */}
      <div style={{ background: '#111', borderRadius: '10px', border: '1px solid #222', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#161616' }}>
            <tr style={{ color: '#555', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 600, borderBottom: '1px solid #222' }}>ID</th>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 600, borderBottom: '1px solid #222' }}>Cliente</th>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 600, borderBottom: '1px solid #222' }}>Fecha</th>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 600, borderBottom: '1px solid #222' }}>Total</th>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 600, borderBottom: '1px solid #222' }}>Estado</th>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 600, borderBottom: '1px solid #222' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#444' }}>No se encontraron pedidos.</td></tr>
            ) : filtered.map((order, i) => (
              <tr key={order.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #1a1a1a' : 'none', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = '#151515'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '1rem 1.25rem', color: '#555', fontSize: '0.82rem', fontFamily: 'monospace' }}>{order.id.split('-')[0].toUpperCase()}</td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ fontWeight: 500 }}>{order.cliente_nombre}</div>
                  <div style={{ fontSize: '0.78rem', color: '#555', marginTop: '0.1rem' }}>{order.cliente_email}</div>
                </td>
                <td style={{ padding: '1rem 1.25rem', color: '#888', fontSize: '0.88rem' }}>
                  {new Date(order.creado_en).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#C9A96E' }}>{formatPrice(order.total)}</td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <select
                    value={order.estado}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #333', padding: '0.3rem 0.5rem', borderRadius: '6px', outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                    {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                      <option key={val} value={val}>{cfg.label}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <button
                    onClick={() => openDetail(order)}
                    style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E', padding: '0.35rem 0.85rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.2)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.1)'; }}>
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer de detalle */}
      {selectedOrder && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setSelectedOrder(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, backdropFilter: 'blur(2px)' }}
          />
          {/* Panel */}
          <div style={{
            position: 'fixed', top: 0, right: 0, height: '100vh', width: '460px', maxWidth: '95vw',
            background: '#111', borderLeft: '1px solid #222', zIndex: 51, overflowY: 'auto',
            animation: 'slideIn 0.25s ease-out',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Drawer header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pedido</p>
                <h2 style={{ margin: '0.25rem 0 0', fontFamily: 'monospace', fontSize: '1rem', color: '#888' }}>
                  #{selectedOrder.id.split('-')[0].toUpperCase()}
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <StatusBadge status={selectedOrder.estado} />
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{ background: '#1a1a1a', border: '1px solid #333', color: '#666', width: 32, height: 32, borderRadius: '6px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✕
                </button>
              </div>
            </div>

            <div style={{ padding: '1.5rem 2rem', flex: 1 }}>
              {/* Cliente */}
              <Section title="Información del cliente">
                <InfoRow label="Nombre" value={selectedOrder.cliente_nombre} />
                <InfoRow label="Email" value={selectedOrder.cliente_email} />
                <InfoRow label="Teléfono" value={selectedOrder.cliente_telefono || '—'} />
              </Section>

              {/* Dirección */}
              {selectedOrder.direccion_envio && (
                <Section title="Dirección de envío">
                  <InfoRow label="Dirección" value={selectedOrder.direccion_envio.direccion || '—'} />
                  <InfoRow label="Ciudad" value={selectedOrder.direccion_envio.ciudad || '—'} />
                  <InfoRow label="Código postal" value={selectedOrder.direccion_envio.codigoPostal || '—'} />
                  {selectedOrder.direccion_envio.notas && (
                    <InfoRow label="Notas" value={selectedOrder.direccion_envio.notas} />
                  )}
                </Section>
              )}

              {/* Productos */}
              <Section title="Productos del pedido">
                {loadingItems ? (
                  <p style={{ color: '#555', fontSize: '0.85rem' }}>Cargando items...</p>
                ) : orderItems.length === 0 ? (
                  <p style={{ color: '#555', fontSize: '0.85rem' }}>No se encontraron items para este pedido.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {orderItems.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#161616', borderRadius: '8px', border: '1px solid #222' }}>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.nombre}</div>
                          <div style={{ fontSize: '0.78rem', color: '#555', marginTop: '0.15rem' }}>
                            {formatPrice(item.precio_unitario)} × {item.cantidad}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, color: '#C9A96E' }}>{formatPrice(item.subtotal)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              {/* Cambiar estado */}
              <Section title="Cambiar estado">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                    <button
                      key={val}
                      onClick={() => updateStatus(selectedOrder.id, val)}
                      style={{
                        padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.15s', border: '1px solid',
                        background: selectedOrder.estado === val ? cfg.bg : 'transparent',
                        color: selectedOrder.estado === val ? cfg.color : '#555',
                        borderColor: selectedOrder.estado === val ? cfg.color : '#333',
                      }}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </Section>
            </div>

            {/* Drawer footer */}
            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#555', fontSize: '0.85rem' }}>
                {new Date(selectedOrder.creado_en).toLocaleString('es-CO')}
              </span>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#C9A96E' }}>{formatPrice(selectedOrder.total)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <h3 style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#444', margin: '0 0 0.75rem', fontWeight: 600 }}>{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #1a1a1a', gap: '1rem' }}>
      <span style={{ color: '#555', fontSize: '0.85rem', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#ccc', fontSize: '0.85rem', textAlign: 'right' }}>{value}</span>
    </div>
  );
}
