import styles from './page.module.css';

export const metadata = {
  title: 'Politica de Devoluciones | Perfumería',
  description: 'Conoce nuestras politicas de devolucion y garantias.',
};

export default function PoliticaDevoluciones() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Politica de Devoluciones</h1>
        <p className={styles.subtitle}>Tu satisfaccion es nuestra garantia</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Condiciones Generales</h2>
          <p>
            Queremos que estes completamente satisfecho con tu eleccion. Si por alguna razon no lo estas,
            puedes solicitar una devolucion dentro de los primeros 14 dias naturales despues de haber
            recibido tu pedido, sujeto a las siguientes condiciones.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Requisitos para la Devolucion</h2>
          <ul className={styles.list}>
            <li>El perfume debe estar completamente sellado en su empaque original de celofan.</li>
            <li>No mostrar signos de uso, alteraciones o daño en la caja.</li>
            <li>Conservar todos los accesorios, muestras promocionales o regalos que hayan venido incluidos.</li>
            <li>Presentar el comprobante de compra o numero de pedido.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Proceso de Devolucion</h2>
          <div className={styles.timeline}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div>
                <h3>Solicitud</h3>
                <p>Contactanos mediante nuestro correo de soporte indicando tu numero de pedido y el motivo de la devolucion.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div>
                <h3>Aprobacion y Envio</h3>
                <p>Te proporcionaremos una guia de retorno pre-pagada. Deberas empaquetar el producto de forma segura.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div>
                <h3>Inspeccion y Reembolso</h3>
                <p>Al recibir y revisar el producto en nuestras instalaciones, procesaremos tu reembolso en un lapso de 3 a 5 dias habiles al metodo de pago original.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Excepciones</h2>
          <p>
            Por motivos de higiene y salud, no aceptamos devoluciones de productos abiertos o probados, a menos
            que exista un defecto de fabrica o error en el envio por nuestra parte. En tal caso, cubriremos el
            100% de los gastos asociados.
          </p>
        </section>
      </div>
    </div>
  );
}
