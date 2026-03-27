import './globals.css';
import { CartProvider } from '@/context/CartContext';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

export const metadata = {
  title: {
    default: 'AurumeAcol | Perfumería Online en Colombia',
    template: '%s | AurumeAcol',
  },
  description: 'AurumeAcol - Tienda en linea de perfumes exclusivos y originales. Encuentra la fragancia perfecta para cada ocasion con envio a todo Colombia. Perfumes para hombre, mujer y unisex.',
  keywords: ['aurumeacol', 'perfumes', 'fragancias', 'perfumeria', 'tienda online', 'perfumes originales', 'Colombia', 'perfumes para hombre', 'perfumes para mujer', 'perfumes unisex', 'comprar perfumes'],
  authors: [{ name: 'AurumeAcol' }],
  creator: 'AurumeAcol',
  metadataBase: new URL('https://www.aurumeacol.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://www.aurumeacol.com',
    siteName: 'AurumeAcol',
    title: 'AurumeAcol | Perfumería Online en Colombia',
    description: 'Descubre fragancias exclusivas que capturan tu esencia. Perfumes originales con envio a todo Colombia.',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'AurumeAcol - Perfumería Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AurumeAcol | Perfumería Online en Colombia',
    description: 'Descubre fragancias exclusivas que capturan tu esencia. Perfumes originales con envio a todo Colombia.',
    images: ['/favicon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
