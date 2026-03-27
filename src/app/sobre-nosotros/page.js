import styles from './page.module.css';

export const metadata = {
  title: 'Sobre Nosotros | Perfumería',
  description: 'Descubre nuestra historia, valores y compromiso con la excelencia en cada fragancia.',
};

export default function SobreNosotros() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sobre Nosotros</h1>
        <p className={styles.subtitle}>La esencia de la elegancia</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Nuestra Historia</h2>
          <p>
            Nacimos de la pasion por los aromas excepcionales y el deseo de ofrecer una experiencia unica en cada gota. 
            Durante años, nos hemos dedicado a seleccionar las fragancias mas exclusivas y sofisticadas, entendiendo 
            que un perfume es mas que un aroma: es una firma personal.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Nuestros Valores</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Calidad</h3>
              <p>Trabajamos solo con marcas y proveedores garantizados para ofrecerte autenticidad y excelencia.</p>
            </div>
            <div className={styles.card}>
              <h3>Exclusividad</h3>
              <p>Curamos nuestra coleccion para traerte opciones unicas que te hagan destacar.</p>
            </div>
            <div className={styles.card}>
              <h3>Atencion</h3>
              <p>Tu experiencia es nuestra prioridad. Te asesoramos para que encuentres tu fragancia ideal.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Nuestro Compromiso</h2>
          <p>
            Nos comprometemos a brindarte un servicio transparente, envios seguros y una atencion personalizada. 
            Queremos que cada paso, desde que exploras nuestro catalogo hasta que el perfume llega a tus manos, 
            sea perfumado con excelencia.
          </p>
        </section>
      </div>
    </div>
  );
}
