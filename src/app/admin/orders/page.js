'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/formatPrice';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('creado_en', { ascending: false });
        
      if (!error && data) {
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id, newStatus) {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ estado: newStatus })
        .eq('id', id);
        
      if (!error) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, estado: newStatus } : o));
      } else {
        alert('Error al actualizar estado');
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p style={{ color: '#888' }}>Cargando pedidos...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#C9A96E', margin: 0 }}>Gestion de Pedidos</h1>
        <button onClick={loadOrders} style={{ background: '#333', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
          Actualizar 🔄
        </button>
      </div>
      
      <div style={{ background: '#111', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#1a1a1a' }}>
            <tr style={{ color: '#888' }}>
              <th style={{ padding: '1rem', fontWeight: 'normal', borderBottom: '1px solid #333' }}>ID</th>
              <th style={{ padding: '1rem', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Cliente</th>
              <th style={{ padding: '1rem', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Fecha</th>
              <th style={{ padding: '1rem', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Total</th>
              <th style={{ padding: '1rem', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Estado</th>
              <th style={{ padding: '1rem', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No se encontraron pedidos.</td></tr>
            ) : orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '1rem', color: '#888', fontSize: '0.9rem' }}>{order.id.split('-')[0]}</td>
                <td style={{ padding: '1rem' }}>
                  <div>{order.cliente_nombre}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{order.cliente_email}</div>
                </td>
                <td style={{ padding: '1rem' }}>{new Date(order.creado_en).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#C9A96E' }}>{formatPrice(order.total)}</td>
                <td style={{ padding: '1rem' }}>
                  <select 
                    value={order.estado}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{
                      background: '#222',
                      color: '#fff',
                      border: '1px solid #444',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
