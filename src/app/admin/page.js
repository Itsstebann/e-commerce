'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/formatPrice';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    productsCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        
        // Cargar estadisticas
        const { data: orders, error: ordersError } = await supabase
          .from('pedidos')
          .select('id, total, estado, creado_en, cliente_nombre')
          .order('creado_en', { ascending: false });
          
        const { count: productsCount } = await supabase
          .from('productos')
          .select('*', { count: 'exact', head: true });
          
        if (!ordersError && orders) {
          const totalSales = orders.filter(o => o.estado === 'pagado' || o.estado === 'entregado' || o.estado === 'enviado').reduce((acc, curr) => acc + Number(curr.total), 0);
          const pendingOrders = orders.filter(o => o.estado === 'pendiente' || o.estado === 'pagado').length;
          
          setStats({
            totalSales,
            totalOrders: orders.length,
            pendingOrders,
            productsCount: productsCount || 0
          });
          
          setRecentOrders(orders.slice(0, 5));
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboard();
  }, []);

  if (loading) {
    return <p style={{ color: '#888' }}>Cargando panel...</p>;
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: '#C9A96E', marginBottom: '2rem' }}>Panel de Control</h1>
      
      {/* Tarjetas de metricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title="Ventas Totales" value={formatPrice(stats.totalSales)} icon="💰" />
        <StatCard title="Pedidos" value={stats.totalOrders} icon="📦" />
        <StatCard title="Pendientes" value={stats.pendingOrders} icon="⏳" />
        <StatCard title="Productos" value={stats.productsCount} icon="🏷️" />
      </div>

      {/* Tabla de pedidos recientes */}
      <div style={{ background: '#111', borderRadius: '8px', border: '1px solid #333', padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Pedidos Recientes</h2>
          <a href="/admin/orders" style={{ color: '#C9A96E', textDecoration: 'none', fontSize: '0.9rem' }}>Ver todos →</a>
        </div>
        
        {recentOrders.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem 0' }}>No hay pedidos registrados.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>ID</th>
                <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Cliente</th>
                <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Fecha</th>
                <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Total</th>
                <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem 0', color: '#888', fontSize: '0.9rem' }}>{order.id.split('-')[0]}...</td>
                  <td style={{ padding: '1rem 0' }}>{order.cliente_nombre}</td>
                  <td style={{ padding: '1rem 0' }}>{new Date(order.creado_en).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>{formatPrice(order.total)}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '99px', 
                      fontSize: '0.8rem',
                      background: order.estado === 'pagado' ? 'rgba(74, 222, 128, 0.1)' : 
                                  order.estado === 'pendiente' ? 'rgba(250, 204, 21, 0.1)' : 
                                  'rgba(168, 162, 158, 0.1)',
                      color: order.estado === 'pagado' ? '#4ade80' : 
                             order.estado === 'pendiente' ? '#facc15' : 
                             '#a8a29e',
                      textTransform: 'capitalize'
                    }}>
                      {order.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div style={{ background: '#111', borderRadius: '8px', border: '1px solid #333', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ fontSize: '2rem', background: '#1a1a1a', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#888', fontWeight: 'normal' }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginTop: '0.25rem' }}>{value}</p>
      </div>
    </div>
  );
}
