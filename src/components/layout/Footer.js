'use client';

import Link from 'next/link';
import { STORE_NAME, SOCIAL_LINKS } from '@/utils/constants';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-grid']}>
        {/* Columna de marca */}
        <div className={styles['footer-brand']}>
          <h3>{STORE_NAME}<span>.</span></h3>
          <p>
            Descubre fragancias exclusivas que capturan tu esencia.
            Una experiencia olfativa unica y sofisticada.
          </p>
          <div className={styles['footer-social']}>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.33-6.33V9.15a8.16 8.16 0 0 0 3.89.98V6.69z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Tienda */}
        <div className={styles['footer-col']}>
          <h4>Tienda</h4>
          <ul>
            <li><Link href="/catalogo">Catalogo</Link></li>
            <li><Link href="/catalogo?categoria=hombre">Para El</Link></li>
            <li><Link href="/catalogo?categoria=mujer">Para Ella</Link></li>
            <li><Link href="/catalogo?categoria=unisex">Unisex</Link></li>
          </ul>
        </div>

        {/* Informacion */}
        <div className={styles['footer-col']}>
          <h4>Informacion</h4>
          <ul>
            <li><Link href="/sobre-nosotros">Sobre Nosotros</Link></li>
            <li><Link href="/politica-envios">Envios</Link></li>
            <li><Link href="/politica-devoluciones">Devoluciones</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className={styles['footer-newsletter']}>
          <h4 className={styles['footer-col']?.h4}>Newsletter</h4>
          <p className={styles['newsletter-label']}>Recibe ofertas exclusivas y novedades</p>
          <form className={styles['newsletter-form']} onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Tu email"
              aria-label="Email para newsletter"
              id="newsletter-email"
            />
            <button type="submit">Unirme</button>
          </form>
        </div>
      </div>

      {/* Footer inferior */}
      <div className={styles['footer-bottom']}>
        <p>&copy; {currentYear} {STORE_NAME}. Todos los derechos reservados.</p>
        <div className={styles['footer-payments']}>
          <span>MercadoPago</span>
          <span>Visa</span>
          <span>Mastercard</span>
        </div>
      </div>
    </footer>
  );
}
