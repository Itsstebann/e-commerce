'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/formatPrice';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('creado_en', { ascending: false });
        
      if (!error && data) {
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function toggleDestacado(id, currentValue) {
    try {
      const { error } = await supabase
        .from('productos')
        .update({ destacado: !currentValue })
        .eq('id', id);
        
      if (!error) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, destacado: !currentValue } : p));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteProduct(id) {
    if (!confirm('Estas seguro de eliminar este producto?')) return;
    try {
      const { error } = await supabase.from('productos').delete().eq('id', id);
      if (!error) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Error al eliminar');
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p style={{ color: '#888' }}>Cargando productos...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#C9A96E', margin: 0 }}>Gestion de Productos</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={loadProducts} style={{ background: 'transparent', color: '#888', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
            Actualizar 🔄
          </button>
          <button style={{ background: '#C9A96E', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Nuevo Producto
          </button>
        </div>
      </div>
      
      <div style={{ background: '#111', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#1a1a1a' }}>
            <tr style={{ color: '#888' }}>
              <th style={{ padding: '1rem', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Nombre</th>
              <th style={{ padding: '1rem', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Categoria</th>
              <th style={{ padding: '1rem', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Precio</th>
              <th style={{ padding: '1rem', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Stock</th>
              <th style={{ padding: '1rem', fontWeight: 'normal', borderBottom: '1px solid #333' }}>Destacado</th>
              <th style={{ padding: '1rem', fontWeight: 'normal', borderBottom: '1px solid #333', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No se encontraron productos.</td></tr>
            ) : products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{product.nombre}</td>
                <td style={{ padding: '1rem', color: '#888' }}>{product.categoria_nombre}</td>
                <td style={{ padding: '1rem' }}>
                  <div>{formatPrice(product.precio)}</div>
                  {product.precio_oferta && <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>Oferta: {formatPrice(product.precio_oferta)}</div>}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: product.stock <= 5 ? '#facc15' : '#888' }}>{product.stock} un.</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button 
                    onClick={() => toggleDestacado(product.id, product.destacado)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: product.destacado ? 1 : 0.3 }}
                  >
                    ⭐
                  </button>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', marginRight: '1rem' }}>Editar</button>
                  <button onClick={() => deleteProduct(product.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
