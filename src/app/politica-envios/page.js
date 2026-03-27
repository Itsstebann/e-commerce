import styles from './page.module.css';

export const metadata = {
  title: 'Politica de Envios | Perfumería',
  description: 'Informacion sobre nuestros metodos y tiempos de envio.',
};

export default function PoliticaEnvios() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Politica de Envios</h1>
        <p className={styles.subtitle}>Como llega tu perfume a tus manos</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Zonas de Cobertura</h2>
          <p>
            Realizamos envios a todo el pais mediante servicios de mensajeria de primer nivel.
            Aseguramos que tu pedido llegue en perfectas condiciones, manejando cada paquete con el cuidado
            que un producto premium merece.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Tiempos Estimados de Entrega</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Envio Estandar</h3>
              <p>Entrega en 3 a 5 dias habiles.</p>
              <span className={styles.badge}>Gratis en compras mayores a $1500</span>
            </div>
            <div className={styles.card}>
              <h3>Envio Express</h3>
              <p>Entrega en 1 a 2 dias habiles maximo.</p>
              <span className={styles.badge}>Costo adicional aplicado en checkout</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Seguimiento de tu Pedido</h2>
          <p>
            Una vez que tu compra sea procesada y enviada a la paqueteria, recibiras un correo electronico
            con tu numero de guia. Podras rastrear el paquete en tiempo real hasta que llegue a la puerta
            de tu casa.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Empaque Seguro</h2>
          <p>
            Entendemos la delicadeza de los frascos de perfume. Por ello, todos nuestros envios cuentan con
            embalaje especial anti-impacto, asegurando que tu fragancia llegue intacta y lista para ser disfrutada.
          </p>
        </section>
      </div>
    </div>
  );
}
