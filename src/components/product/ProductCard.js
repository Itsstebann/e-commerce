'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateDiscount } from '@/utils/formatPrice';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const hasDiscount = product.precio_oferta && product.precio_oferta < product.precio;
  const discount = hasDiscount ? calculateDiscount(product.precio, product.precio_oferta) : 0;

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  }

  return (
    <Link href={`/producto/${product.id}`} className={styles.card}>
      {/* Imagen del producto */}
      <div className={styles['image-wrapper']}>
        {product.imagen_url ? (
          <img src={product.imagen_url} alt={product.nombre} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>🌸</div>
        )}

        {/* Badges */}
        <div className={styles['badge-container']}>
          {hasDiscount && (
            <span className="badge badge-sale">-{discount}%</span>
          )}
          {product.nuevo && (
            <span className="badge badge-new">Nuevo</span>
          )}
        </div>

        {/* Boton rapido de agregar */}
        <div className={styles['quick-add']}>
          <button onClick={handleQuickAdd} id={`add-to-cart-${product.id}`}>
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Informacion del producto */}
      <div className={styles.info}>
        {product.categoria_nombre && (
          <p className={styles.category}>{product.categoria_nombre}</p>
        )}
        <h3 className={styles.name}>{product.nombre}</h3>
        <div className={styles['price-row']}>
          <span className={styles.price}>
            {formatPrice(hasDiscount ? product.precio_oferta : product.precio)}
          </span>
          {hasDiscount && (
            <>
              <span className={styles['original-price']}>
                {formatPrice(product.precio)}
              </span>
              <span className={styles.discount}>-{discount}%</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
