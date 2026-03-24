import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import CartSidebar from '@/components/cart/CartSidebar';

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
          <Header />
          <main>{children}</main>
          <Footer />
          <CartSidebar />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
