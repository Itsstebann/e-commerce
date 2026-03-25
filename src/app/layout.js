import './globals.css';
import { CartProvider } from '@/context/CartContext';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

export const metadata = {
  title: 'Aurumea | Fragancias exclusivas que definen tu esencia',
  description: 'Aurumea - Tienda en linea de perfumes exclusivos. Encuentra la fragancia perfecta para cada ocasion con envio a todo el pais.',
  keywords: 'aurumea, perfumes, fragancias, perfumeria, tienda online, perfumes originales',
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
