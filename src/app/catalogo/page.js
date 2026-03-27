'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'hombre', label: 'Para El' },
  { id: 'mujer', label: 'Para Ella' },
  { id: 'unisex', label: 'Unisex' },
  { id: 'ofertas', label: 'Ofertas' },
];

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Cargando catalogo...</p></div>}>
      <CatalogoContent />
    </Suspense>
  );
}

function CatalogoContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoria') || 'todos';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevancia');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .order('creado_en', { ascending: false });
        
        if (error) throw error;
        if (!error && data) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        // Fallback en caso de error (tabla no existe, etc.)
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtrar por categoria
    if (activeCategory === 'ofertas') {
      result = result.filter(p => p.precio_oferta !== null);
    } else if (activeCategory !== 'todos') {
      result = result.filter(p => p.slug === activeCategory);
    }

    // Filtrar por busqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(query) ||
        p.categoria_nombre.toLowerCase().includes(query)
      );
    }

    // Ordenar
    switch (sortBy) {
      case 'precio-asc':
        result.sort((a, b) => (a.precio_oferta || a.precio) - (b.precio_oferta || b.precio));
        break;
      case 'precio-desc':
        result.sort((a, b) => (b.precio_oferta || b.precio) - (a.precio_oferta || a.precio));
        break;
      case 'nombre':
        result.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nuevo':
        result.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0));
        break;
    }

    return result;
  }, [activeCategory, searchQuery, sortBy, products]);

  return (
    <>
      {/* Header del catalogo */}
      <div className={styles['catalog-header']}>
        <div className="container">
          <h1 className="section-title">
            Nuestro <span>Catalogo</span>
          </h1>
          <p>Explora nuestra coleccion completa de fragancias exclusivas</p>
        </div>
      </div>

      {/* Contenido del catalogo */}
      <div className={styles['catalog-layout']}>
        {/* Barra de filtros */}
        <div className={styles['filters-bar']}>
          <div className={styles['filter-tabs']}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles['filter-tab']} ${activeCategory === cat.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                id={`filter-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className={styles['search-bar']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Buscar perfumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-input"
              />
            </div>

            <select
              className={styles['sort-select']}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-select"
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="nombre">Nombre A-Z</option>
              <option value="nuevo">Mas Nuevos</option>
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <p className={styles['results-count']}>
          {loading ? 'Cargando productos...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto' : 'productos'}`}
        </p>

        {/* Grid de productos */}
        {loading ? (
           <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-secondary)' }}>
             <span>Cargando nuestro catálogo de fragancias...</span>
           </div>
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles['empty-state']}>
            <h3>No se encontraron productos</h3>
            <p>Intenta con otra busqueda o categoria</p>
          </div>
        )}
      </div>
    </>
  );
}
