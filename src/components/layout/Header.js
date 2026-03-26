'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ANNOUNCEMENT_TEXT } from '@/utils/constants';
import styles from './Header.module.css';

export default function Header() {
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Barra de anuncio superior */}
      <div className={styles['announcement-bar']}>
        {ANNOUNCEMENT_TEXT}
      </div>

      {/* Header principal */}
      <header className={styles.header}>
        <div className={styles['header-inner']}>
          {/* Navegacion izquierda */}
          <nav className={styles['header-nav']}>
            <Link href="/">Inicio</Link>
            <Link href="/catalogo">Catalogo</Link>
          </nav>

          {/* Logo centro */}
          <Link href="/" className={styles['header-logo']}>
            <Image
              src="/logo.png"
              alt="AurumeAcol Perfumería Virtual"
              width={140}
              height={52}
              priority
              style={{ objectFit: 'contain', filter: 'brightness(1.05)' }}
            />
          </Link>

          {/* Acciones derecha */}
          <div className={styles['header-actions']}>
            {/* Busqueda */}
            <button
              className={styles['header-action-btn']}
              aria-label="Buscar"
              id="search-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {/* Carrito */}
            <button
              className={styles['header-action-btn']}
              onClick={() => setIsOpen(true)}
              aria-label="Carrito de compras"
              id="cart-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className={styles['cart-badge']}>{totalItems}</span>
              )}
            </button>

            {/* Menu mobile */}
            <button
              className={styles['mobile-menu-btn']}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              id="mobile-menu-btn"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile desplegable */}
      <nav className={`${styles['mobile-nav']} ${mobileMenuOpen ? styles.open : ''}`}>
        <Link href="/" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
        <Link href="/catalogo" onClick={() => setMobileMenuOpen(false)}>Catalogo</Link>
        <Link href="/carrito" onClick={() => setMobileMenuOpen(false)}>Carrito</Link>
      </nav>
    </>
  );
}
