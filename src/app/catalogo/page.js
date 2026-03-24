'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import styles from './page.module.css';

// Datos de demostración (se reemplazaran con Supabase)
const ALL_PRODUCTS = [
  { id: '1', nombre: 'Eau de Parfum Noir', precio: 1299, precio_oferta: 999, imagen_url: null, categoria_nombre: 'Para El', slug: 'hombre', destacado: true, nuevo: true, stock: 15 },
  { id: '2', nombre: 'Rose Absolue Intense', precio: 1599, precio_oferta: null, imagen_url: null, categoria_nombre: 'Para Ella', slug: 'mujer', destacado: true, nuevo: false, stock: 8 },
  { id: '3', nombre: 'Oud & Santal Premium', precio: 1899, precio_oferta: 1499, imagen_url: null, categoria_nombre: 'Unisex', slug: 'unisex', destacado: true, nuevo: true, stock: 5 },
  { id: '4', nombre: 'Fresh Citrus Breeze', precio: 899, precio_oferta: null, imagen_url: null, categoria_nombre: 'Para El', slug: 'hombre', destacado: true, nuevo: false, stock: 20 },
  { id: '5', nombre: 'Jasmine & Vanilla Dream', precio: 1199, precio_oferta: 899, imagen_url: null, categoria_nombre: 'Para Ella', slug: 'mujer', destacado: true, nuevo: false, stock: 12 },
  { id: '6', nombre: 'Amber Wood Collection', precio: 2199, precio_oferta: null, imagen_url: null, categoria_nombre: 'Unisex', slug: 'unisex', destacado: true, nuevo: true, stock: 3 },
  { id: '7', nombre: 'Ocean Mist Sport', precio: 799, precio_oferta: 599, imagen_url: null, categoria_nombre: 'Para El', slug: 'hombre', destacado: true, nuevo: false, stock: 25 },
  { id: '8', nombre: 'Peony & Blush Suede', precio: 1399, precio_oferta: null, imagen_url: null, categoria_nombre: 'Para Ella', slug: 'mujer', destacado: true, nuevo: false, stock: 10 },
  { id: '9', nombre: 'Vetiver & Tobacco', precio: 1699, precio_oferta: 1299, imagen_url: null, categoria_nombre: 'Para El', slug: 'hombre', destacado: false, nuevo: false, stock: 7 },
  { id: '10', nombre: 'Cherry Blossom Delight', precio: 999, precio_oferta: null, imagen_url: null, categoria_nombre: 'Para Ella', slug: 'mujer', destacado: false, nuevo: true, stock: 18 },
  { id: '11', nombre: 'Musk Noir Absolute', precio: 2499, precio_oferta: 1999, imagen_url: null, categoria_nombre: 'Unisex', slug: 'unisex', destacado: false, nuevo: false, stock: 4 },
  { id: '12', nombre: 'Bergamot & Neroli', precio: 1099, precio_oferta: null, imagen_url: null, categoria_nombre: 'Para El', slug: 'hombre', destacado: false, nuevo: false, stock: 14 },
];

const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'hombre', label: 'Para El' },
  { id: 'mujer', label: 'Para Ella' },
  { id: 'unisex', label: 'Unisex' },
  { id: 'ofertas', label: 'Ofertas' },
];

export default function CatalogoPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoria') || 'todos';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevancia');

  const filteredProducts = useMemo(() => {
    let products = [...ALL_PRODUCTS];

    // Filtrar por categoria
    if (activeCategory === 'ofertas') {
      products = products.filter(p => p.precio_oferta !== null);
    } else if (activeCategory !== 'todos') {
      products = products.filter(p => p.slug === activeCategory);
    }

    // Filtrar por busqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.nombre.toLowerCase().includes(query) ||
        p.categoria_nombre.toLowerCase().includes(query)
      );
    }

    // Ordenar
    switch (sortBy) {
      case 'precio-asc':
        products.sort((a, b) => (a.precio_oferta || a.precio) - (b.precio_oferta || b.precio));
        break;
      case 'precio-desc':
        products.sort((a, b) => (b.precio_oferta || b.precio) - (a.precio_oferta || a.precio));
        break;
      case 'nombre':
        products.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nuevo':
        products.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0));
        break;
    }

    return products;
  }, [activeCategory, searchQuery, sortBy]);

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
          {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
        </p>

        {/* Grid de productos */}
        {filteredProducts.length > 0 ? (
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
