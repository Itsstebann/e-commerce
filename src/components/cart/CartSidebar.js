'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';
import styles from './CartSidebar.module.css';

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice } = useCart();

  return (
    <>
      {/* Overlay oscuro */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar del carrito */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Header del sidebar */}
        <div className={styles['sidebar-header']}>
          <h2>Tu Carrito</h2>
          <button
            className={styles['close-btn']}
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar carrito"
            id="close-cart-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cuerpo del sidebar */}
        <div className={styles['sidebar-body']}>
          {items.length === 0 ? (
            <div className={styles['empty-cart']}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <h3>Tu carrito esta vacio</h3>
              <p>Explora nuestro catalogo y encuentra tu fragancia ideal</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className={styles['cart-item']}>
                <div className={styles['cart-item-image']}>
                  {item.imagen_url && (
                    <img src={item.imagen_url} alt={item.nombre} />
                  )}
                </div>
                <div className={styles['cart-item-info']}>
                  <h4>{item.nombre}</h4>
                  <span className={styles['cart-item-price']}>
                    {formatPrice(item.precio_oferta || item.precio)}
                  </span>
                  <div className={styles['cart-item-controls']}>
                    <button
                      className={styles['qty-btn']}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Reducir cantidad"
                    >
                      -
                    </button>
                    <span className={styles['qty-value']}>{item.quantity}</span>
                    <button
                      className={styles['qty-btn']}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                    <button
                      className={styles['remove-btn']}
                      onClick={() => removeItem(item.id)}
                      aria-label="Eliminar producto"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer del sidebar */}
        {items.length > 0 && (
          <div className={styles['sidebar-footer']}>
            <div className={styles['total-row']}>
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <Link
              href="/checkout"
              className={styles['checkout-btn']}
              onClick={() => setIsOpen(false)}
              style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
              id="checkout-btn"
            >
              Ir al Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
