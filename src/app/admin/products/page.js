'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/formatPrice';

const EMPTY_FORM = {
  nombre: '', descripcion: '', precio: '', precio_oferta: '',
  stock: '', categoria_nombre: '', imagen_url: '', destacado: false,
};

const BUCKET = 'product-images';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  async function loadProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('creado_en', { ascending: false });
      if (!error && data) setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(); }, []);

  function openCreate() {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setImageFiles([]);
    setImagePreviews([]);
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditingProduct(product);
    setForm({
      nombre: product.nombre || '',
      descripcion: product.descripcion || '',
      precio: product.precio || '',
      precio_oferta: product.precio_oferta || '',
      stock: product.stock || '',
      categoria_nombre: product.categoria_nombre || '',
      imagen_url: product.imagen_url || '',
      destacado: product.destacado || false,
    });
    setImageFiles([]);
    setImagePreviews(product.imagenes && product.imagenes.length > 0 ? product.imagenes : (product.imagen_url ? [product.imagen_url] : []));
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setImageFiles([]);
    setImagePreviews([]);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  }

  async function uploadImages(files) {
    setUploadingImage(true);
    try {
      const urls = [];
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(fileName, file, { upsert: true, contentType: file.type });
        if (error) throw error;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
        urls.push(data.publicUrl);
      }
      return urls;
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.stock) {
      alert('Nombre, precio y stock son obligatorios.');
      return;
    }
    setSaving(true);
    try {
      let finalUrls = imagePreviews.filter(p => !p.startsWith('blob:')); // kept existing images if any
      
      // Subir imágenes si se seleccionaron archivos nuevos
      if (imageFiles.length > 0) {
        const uploadedUrls = await uploadImages(imageFiles);
        finalUrls = uploadedUrls;
      }
      
      let imagenUrl = finalUrls.length > 0 ? finalUrls[0] : (form.imagen_url || null);

      let generatedSlug = 'unisex';
      const catLower = (form.categoria_nombre || '').toLowerCase();
      if (catLower.includes('mujer') || catLower.includes('ella')) generatedSlug = 'mujer';
      else if (catLower.includes('hombre') || catLower.includes(' el')) generatedSlug = 'hombre';
      else if (catLower) generatedSlug = catLower.trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        precio_oferta: form.precio_oferta ? Number(form.precio_oferta) : null,
        stock: Number(form.stock),
        categoria_nombre: form.categoria_nombre,
        imagen_url: imagenUrl,
        imagenes: finalUrls,
        destacado: form.destacado,
        slug: generatedSlug,
      };

      if (editingProduct) {
        const { error } = await supabase.from('productos').update(payload).eq('id', editingProduct.id);
        if (error) throw error;
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p));
      } else {
        const { data, error } = await supabase.from('productos').insert([payload]).select().single();
        if (error) throw error;
        setProducts(prev => [data, ...prev]);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Error al guardar producto: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleDestacado(id, currentValue) {
    try {
      const { error } = await supabase.from('productos').update({ destacado: !currentValue }).eq('id', id);
      if (!error) setProducts(prev => prev.map(p => p.id === id ? { ...p, destacado: !currentValue } : p));
    } catch (err) { console.error(err); }
  }

  async function deleteProduct(id) {
    if (!confirm('¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.')) return;
    try {
      const { error } = await supabase.from('productos').delete().eq('id', id);
      if (!error) setProducts(prev => prev.filter(p => p.id !== id));
      else alert('Error al eliminar');
    } catch (err) { console.error(err); }
  }

  const filtered = products.filter(p =>
    p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria_nombre?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#888', padding: '4rem 0' }}>
      <span style={{ width: 20, height: 20, border: '2px solid #333', borderTop: '2px solid #C9A96E', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
      Cargando productos...
    </div>
  );

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#C9A96E', margin: 0, fontSize: '1.75rem' }}>Gestión de Productos</h1>
          <p style={{ color: '#666', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>{products.length} productos en catálogo</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={loadProducts} style={{ background: '#1a1a1a', color: '#888', border: '1px solid #333', padding: '0.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888'; }}>
            ↻ Actualizar
          </button>
          <button onClick={openCreate} style={{ background: '#C9A96E', color: '#000', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'opacity 0.2s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
            + Nuevo Producto
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#555', pointerEvents: 'none' }}>🔍</span>
        <input type="text" placeholder="Buscar por nombre o categoría..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }} />
      </div>

      {/* Tabla */}
      <div style={{ background: '#111', borderRadius: '10px', border: '1px solid #222', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#161616' }}>
            <tr style={{ color: '#555', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 600, borderBottom: '1px solid #222' }}>Producto</th>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 600, borderBottom: '1px solid #222' }}>Categoría</th>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 600, borderBottom: '1px solid #222' }}>Precio</th>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 600, borderBottom: '1px solid #222' }}>Stock</th>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 600, borderBottom: '1px solid #222' }}>★</th>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 600, borderBottom: '1px solid #222', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#444' }}>No se encontraron productos.</td></tr>
            ) : filtered.map((product, i) => (
              <tr key={product.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #1a1a1a' : 'none', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = '#151515'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {product.imagen_url ? (
                      <img src={product.imagen_url} alt={product.nombre} style={{ width: 40, height: 40, borderRadius: '6px', objectFit: 'cover', border: '1px solid #222' }} onError={e => e.target.style.display = 'none'} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: '6px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: '1px solid #222' }}>🌸</div>
                    )}
                    <span style={{ fontWeight: 500 }}>{product.nombre}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.25rem', color: '#666', fontSize: '0.88rem' }}>{product.categoria_nombre || '—'}</td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ fontWeight: 600 }}>{formatPrice(product.precio)}</div>
                  {product.precio_oferta && <div style={{ fontSize: '0.78rem', color: '#4ade80', marginTop: '0.1rem' }}>Oferta: {formatPrice(product.precio_oferta)}</div>}
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ color: product.stock <= 5 ? '#facc15' : product.stock === 0 ? '#f87171' : '#888', fontWeight: product.stock <= 5 ? 600 : 400 }}>
                    {product.stock} un.
                  </span>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <button onClick={() => toggleDestacado(product.id, product.destacado)}
                    title={product.destacado ? 'Quitar de destacados' : 'Marcar como destacado'}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.15rem', opacity: product.destacado ? 1 : 0.25, transition: 'opacity 0.2s' }}>
                    ⭐
                  </button>
                </td>
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                  <button onClick={() => openEdit(product)}
                    style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', marginRight: '1rem', fontWeight: 500, fontSize: '0.85rem', padding: '0.3rem 0.6rem', borderRadius: '4px', transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(96,165,250,0.1)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    Editar
                  </button>
                  <button onClick={() => deleteProduct(product.id)}
                    style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', padding: '0.3rem 0.6rem', borderRadius: '4px', transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal crear/editar */}
      {modalOpen && (
        <>
          <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 50, backdropFilter: 'blur(2px)' }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: '#111', border: '1px solid #222', borderRadius: '12px',
            width: '560px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto',
            zIndex: 51, animation: 'fadeIn 0.2s ease-out',
          }}>
            {/* Modal header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#C9A96E' }}>
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={closeModal} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#666', width: 32, height: 32, borderRadius: '6px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSave} style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <Field label="Nombre *" name="nombre" value={form.nombre} onChange={handleChange} required span={2} />
                <Field label="Categoría" name="categoria_nombre" value={form.categoria_nombre} onChange={handleChange} placeholder="ej. Mujer, Hombre, Unisex" />
                <Field label="Stock *" name="stock" value={form.stock} onChange={handleChange} type="number" required />
                <Field label="Precio (COP) *" name="precio" value={form.precio} onChange={handleChange} type="number" required />
                <Field label="Precio Oferta (COP)" name="precio_oferta" value={form.precio_oferta} onChange={handleChange} type="number" placeholder="Opcional" />
              </div>

              {/* Imagen del producto - file upload */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Galería de imágenes
                </label>
                <label htmlFor="product-image-input" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', padding: '1.25rem', borderRadius: '8px', cursor: 'pointer',
                  border: '2px dashed #2a2a2a', background: '#1a1a1a', transition: 'border-color 0.2s',
                  minHeight: imagePreviews.length > 0 ? 'auto' : '100px',
                }}
                  onMouseOver={e => e.currentTarget.style.borderColor = '#C9A96E'}
                  onMouseOut={e => e.currentTarget.style.borderColor = '#2a2a2a'}>
                  {imagePreviews.length > 0 ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {imagePreviews.map((preview, idx) => (
                        <img key={idx} src={preview} alt={`Preview ${idx + 1}`} style={{ maxHeight: 100, borderRadius: '6px', objectFit: 'contain' }} />
                      ))}
                    </div>
                  ) : (
                    <>
                      <span style={{ fontSize: '1.75rem' }}>📷</span>
                      <span style={{ fontSize: '0.85rem', color: '#555' }}>Haz clic para seleccionar múltiples imágenes (Mín. 2)</span>
                      <span style={{ fontSize: '0.75rem', color: '#444' }}>JPG, PNG, WEBP</span>
                    </>
                  )}
                </label>
                <input
                  id="product-image-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {imagePreviews.length > 0 && (
                  <button type="button" onClick={() => { setImageFiles([]); setImagePreviews([]); setForm(p => ({ ...p, imagen_url: '' })); }}
                    style={{ marginTop: '0.5rem', background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem' }}>
                    ✕ Quitar todas las imágenes
                  </button>
                )}
              </div>

              {/* Descripción */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#555', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Descripción del perfume..."
                  style={{ width: '100%', padding: '0.7rem 1rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* Destacado */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1.75rem' }}>
                <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange}
                  style={{ width: 16, height: 16, accentColor: '#C9A96E', cursor: 'pointer' }} />
                <span style={{ fontSize: '0.9rem', color: '#aaa' }}>Marcar como producto destacado ⭐</span>
              </label>

              {/* Acciones */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={closeModal}
                  style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '0.7rem 1.5rem', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving || uploadingImage}
                  style={{ background: '#C9A96E', color: '#000', border: 'none', padding: '0.7rem 1.75rem', borderRadius: '6px', cursor: (saving || uploadingImage) ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: (saving || uploadingImage) ? 0.7 : 1 }}>
                  {uploadingImage ? 'Subiendo imagen...' : saving ? 'Guardando...' : (editingProduct ? 'Guardar cambios' : 'Crear producto')}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', required = false, placeholder = '', span = 1 }) {
  return (
    <div style={{ gridColumn: span === 2 ? '1 / -1' : undefined }}>
      <label style={{ display: 'block', fontSize: '0.78rem', color: '#555', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={{ width: '100%', padding: '0.7rem 1rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }}
      />
    </div>
  );
}
