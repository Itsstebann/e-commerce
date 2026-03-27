'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateDiscount } from '@/utils/formatPrice';
import ProductCard from '@/components/product/ProductCard';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

// Fallback products just in case DB is not populated
const ALL_PRODUCTS = [
  { id: '1', nombre: 'Eau de Parfum Noir', descripcion: 'Una fragancia intensa y seductora con notas de madera oscura, cuero y especias orientales. Perfecta para las noches mas elegantes. Esta esencia captura la sofisticacion de la noche con un toque de misterio.', precio: 1299, precio_oferta: 999, imagen_url: null, categoria_nombre: 'Para El', slug: 'hombre', destacado: true, nuevo: true, stock: 15 },
  { id: '2', nombre: 'Rose Absolue Intense', descripcion: 'Un bouquet de rosas de Bulgaria con un corazon de jazmin y fondo de almizcle. Femenina, elegante y duradera. La esencia perfecta para la mujer que busca dejar huella.', precio: 1599, precio_oferta: null, imagen_url: null, categoria_nombre: 'Para Ella', slug: 'mujer', destacado: true, nuevo: false, stock: 8 },
  { id: '3', nombre: 'Oud & Santal Premium', descripcion: 'Madera de oud combinada con sandalo cremoso y un toque de vainilla. Una fragancia unisex que transmite lujo y calidez. Ideal para quienes buscan una presencia sofisticada.', precio: 1899, precio_oferta: 1499, imagen_url: null, categoria_nombre: 'Unisex', slug: 'unisex', destacado: true, nuevo: true, stock: 5 },
  { id: '4', nombre: 'Fresh Citrus Breeze', descripcion: 'Notas citricas de bergamota y limon con un corazon de hierba fresca y base de musgo blanco. Refrescante y energizante para el dia a dia.', precio: 899, precio_oferta: null, imagen_url: null, categoria_nombre: 'Para El', slug: 'hombre', destacado: true, nuevo: false, stock: 20 },
];

export default function ProductoPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        // Intentar obtener de Supabase
        const { data: dbProduct, error } = await supabase
          .from('productos')
          .select('*')
          .eq('id', productId)
          .single();
          
        if (dbProduct) {
          setProduct(dbProduct);
          
          // Fetch related
          const { data: related } = await supabase
            .from('productos')
            .select('*')
            .eq('categoria_nombre', dbProduct.categoria_nombre)
            .neq('id', dbProduct.id)
            .limit(4);
            
          if (related) setRelatedProducts(related);
        } else {
          // Fallback
          const fallback = ALL_PRODUCTS.find(p => p.id === productId);
          if (fallback) {
            setProduct(fallback);
            setRelatedProducts(ALL_PRODUCTS.filter(p => p.id !== fallback.id && p.categoria_nombre === fallback.categoria_nombre).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        // Fallback en caso de error (e.g. invalid UUID format para Supabase vs ID manuales)
        const fallback = ALL_PRODUCTS.find(p => String(p.id) === String(productId));
        if (fallback) {
          setProduct(fallback);
          setRelatedProducts(ALL_PRODUCTS.filter(p => p.id !== fallback.id && p.categoria_nombre === fallback.categoria_nombre).slice(0, 4));
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [productId]);

  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (product) {
      setActiveImage(
        (product.imagenes && product.imagenes.length > 0) ? product.imagenes[0] : (product.imagen_url || null)
      );
    }
  }, [product]);

  if (loading) {
    return (
      <div className={styles['product-page']} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles['product-page']}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Producto no encontrado</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
            El producto que buscas no existe o fue removido.
          </p>
          <Link href="/catalogo" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
            Ver Catalogo
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.precio_oferta && product.precio_oferta < product.precio;
  const discount = hasDiscount ? calculateDiscount(product.precio, product.precio_oferta) : 0;
  
  const allImages = (product.imagenes && product.imagenes.length > 0) ? product.imagenes : (product.imagen_url ? [product.imagen_url] : []);

  function handleAddToCart() {
    addItem(product, quantity);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2500);
  }

  function handleBuyNow() {
    addItem(product, quantity);
    window.location.href = '/checkout';
  }

  return (
    <div className={styles['product-page']}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/">Inicio</Link>
        <span>/</span>
        <Link href="/catalogo">Catalogo</Link>
        <span>/</span>
        <Link href={`/catalogo?categoria=${product.slug}`}>{product.categoria_nombre}</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-text-primary)' }}>{product.nombre}</span>
      </nav>

      {/* Layout principal */}
      <div className={styles['product-layout']}>
        {/* Galeria de imagenes */}
        <div className={styles.gallery}>
          <div className={styles['main-image']}>
            {activeImage ? (
              <img src={activeImage} alt={product.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className={styles['main-image-placeholder']}>🌸</div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className={styles.thumbnails}>
              {allImages.map((img, i) => (
                <div 
                  key={i} 
                  className={`${styles.thumbnail} ${activeImage === img ? styles.active : ''}`}
                  onClick={() => setActiveImage(img)}
                  style={{ cursor: 'pointer', overflow: 'hidden' }}
                >
                  <img src={img} alt={`Miniatura ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalles del producto */}
        <div className={styles.details}>
          <span className={styles['product-category']}>{product.categoria_nombre}</span>
          <h1 className={styles['product-name']}>{product.nombre}</h1>

          <div className={styles['product-price-section']}>
            <span className={styles['current-price']}>
              {formatPrice(hasDiscount ? product.precio_oferta : product.precio)}
            </span>
            {hasDiscount && (
              <>
                <span className={styles['original-price']}>{formatPrice(product.precio)}</span>
                <span className={styles['discount-badge']}>-{discount}%</span>
              </>
            )}
          </div>

          <p className={styles['product-description']}>
            {product.descripcion || 'Una fragancia excepcional diseñada para cautivar. Formulada con las más finas esencias del mundo.'}
          </p>

          {/* Selector de cantidad */}
          <div className={styles['quantity-section']}>
            <p className={styles['section-label']}>Cantidad</p>
            <div className={styles['quantity-selector']}>
              <button
                className={styles['qty-btn']}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Reducir cantidad"
              >
                -
              </button>
              <span className={styles['qty-value']}>{quantity}</span>
              <button
                className={styles['qty-btn']}
                onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          {/* Botones de accion */}
          <div className={styles['action-buttons']}>
            <button
              className={styles['add-to-cart-btn']}
              onClick={handleAddToCart}
              id="product-add-to-cart"
            >
              Agregar al carrito
            </button>
            <button
              className={styles['buy-now-btn']}
              onClick={handleBuyNow}
              id="product-buy-now"
            >
              Comprar ahora
            </button>
          </div>

          {/* Info de stock */}
          <div className={styles['stock-info']}>
            <span className={`${styles['stock-dot']} ${product.stock <= 5 ? styles.low : ''}`} />
            <span>
              {product.stock <= 5
                ? `Solo ${product.stock || 0} unidades disponibles`
                : 'Disponible en stock'}
            </span>
          </div>

          {/* Caracteristicas */}
          <div className={styles['product-features']}>
            <div className={styles.feature}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>100% Original</span>
            </div>
            <div className={styles.feature}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
                <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
                <circle cx="7" cy="18" r="2" />
                <path d="M15 18H9" />
                <circle cx="17" cy="18" r="2" />
              </svg>
              <span>Envio a todo el pais</span>
            </div>
            <div className={styles.feature}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.2-8.5" />
                <path d="M21 3v5l-5" />
              </svg>
              <span>Devolucion gratis</span>
            </div>
            <div className={styles.feature}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              <span>Pago seguro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className={styles['related-section']}>
          <h2 className="section-title" style={{ marginTop: 'var(--spacing-2xl)' }}>
            Tambien te puede <span>interesar</span>
          </h2>
          <div className="product-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Notificacion de agregado al carrito */}
      {showNotification && (
        <div className={styles['added-notification']}>
          Producto agregado al carrito
        </div>
      )}
    </div>
  );
}
