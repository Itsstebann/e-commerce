import './globals.css';
import { CartProvider } from '@/context/CartContext';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

export const metadata = {
  title: 'AurumeAcol | Perfumería Virtual',
  description: 'AurumeAcol - Tienda en linea de perfumes exclusivos. Encuentra la fragancia perfecta para cada ocasion con envio a todo Colombia.',
  keywords: 'aurumeacol, perfumes, fragancias, perfumeria, tienda online, perfumes originales, Colombia',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
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
