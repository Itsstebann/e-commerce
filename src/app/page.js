'use client';

import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import styles from './page.module.css';

// Datos de demostración mientras se conecta Supabase
const DEMO_COLLECTIONS = [
  {
    id: 1,
    nombre: 'Para El',
    slug: 'hombre',
    descripcion: 'Fragancias masculinas',
    emoji: '🖤',
  },
  {
    id: 2,
    nombre: 'Para Ella',
    slug: 'mujer',
    descripcion: 'Fragancias femeninas',
    emoji: '💜',
  },
  {
    id: 3,
    nombre: 'Unisex',
    slug: 'unisex',
    descripcion: 'Para todos',
    emoji: '✨',
  },
];

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('destacado', true)
          .order('creado_en', { ascending: false })
          .limit(8);
        if (!error && data) {
          setFeaturedProducts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles['hero-bg']} />
        <div className={styles['hero-particles']}>
          {[...Array(8)].map((_, i) => (
            <span key={i} className={styles.particle} />
          ))}
        </div>
        <div className={styles['hero-content']}>
          <span className={styles['hero-tag']}>Fragancias Exclusivas</span>
          <h1 className={styles['hero-title']}>
            Encuentra Tu Esencia Perfecta
          </h1>
          <p className={styles['hero-subtitle']}>
            Descubre nuestra coleccion curada de perfumes que definen tu estilo
            y dejan una impresion inolvidable.
          </p>
          <div className={styles['hero-actions']}>
            <Link href="/catalogo" className="btn btn-primary btn-lg">
              Ver Catalogo
            </Link>
            <Link href="/catalogo?categoria=ofertas" className="btn btn-secondary btn-lg">
              Ofertas
            </Link>
          </div>
        </div>
      </section>

      {/* Colecciones */}
      <section className="section">
        <h2 className="section-title">
          Nuestras <span>Colecciones</span>
        </h2>
        <div className={styles['collections-grid']}>
          {DEMO_COLLECTIONS.map(col => (
            <Link
              href={`/catalogo?categoria=${col.slug}`}
              key={col.id}
              className={styles['collection-card']}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg, #1A1A2E, #0D0D0D)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '5rem',
                }}
              >
                {col.emoji}
              </div>
              <div className={styles['collection-overlay']}>
                <h3>{col.nombre}</h3>
                <p>{col.descripcion}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="section">
        <h2 className="section-title">
          Productos <span>Destacados</span>
        </h2>
        <div className={styles['featured-section']}>
          <div className="product-grid">
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>Cargando productos destacados...</div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: '#888' }}>
                Aún no hay productos destacados.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Barra de confianza */}
      <section className={styles['trust-bar']}>
        <div className={styles['trust-grid']}>
          <div className={styles['trust-item']}>
            <div className={styles['trust-icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h4>100% Originales</h4>
            <p>Garantia de autenticidad</p>
          </div>

          <div className={styles['trust-item']}>
            <div className={styles['trust-icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <h4>Pago Seguro</h4>
            <p>Via MercadoPago</p>
          </div>

          <div className={styles['trust-item']}>
            <div className={styles['trust-icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
                <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
                <circle cx="7" cy="18" r="2" />
                <path d="M15 18H9" />
                <circle cx="17" cy="18" r="2" />
              </svg>
            </div>
            <h4>Envio Rapido</h4>
            <p>A todo el pais</p>
          </div>

          <div className={styles['trust-item']}>
            <div className={styles['trust-icon']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h4>Atencion 24/7</h4>
            <p>Via WhatsApp</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={`section ${styles['cta-banner']}`}>
        <div className={styles['cta-inner']}>
          <h2 className="section-title">
            No te pierdas nuestras <span>ofertas</span>
          </h2>
          <p>
            Suscribete a nuestro newsletter y recibe un 10% de descuento en tu primera compra
          </p>
          <Link href="/catalogo" className="btn btn-primary btn-lg">
            Explorar Catalogo
          </Link>
        </div>
      </section>
    </>
  );
}
