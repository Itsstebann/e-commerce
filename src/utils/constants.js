// Nombre de la tienda (actualizar con el nombre real del cliente)
export const STORE_NAME = 'Aurumea';
export const STORE_DESCRIPTION = 'Fragancias exclusivas que definen tu esencia';

// Moneda por defecto
export const DEFAULT_CURRENCY = 'MXN';

// Numero de WhatsApp para contacto (actualizar con el real)
export const WHATSAPP_NUMBER = '525500000000';
export const WHATSAPP_MESSAGE = 'Hola, me interesa un perfume de su catalogo';

// Redes sociales
export const SOCIAL_LINKS = {
  instagram: '#',
  facebook: '#',
  tiktok: '#',
};

// Opciones de envio
export const SHIPPING_OPTIONS = [
  { id: 'standard', name: 'Envio Estandar', price: 99, days: '3-5 dias' },
  { id: 'express', name: 'Envio Express', price: 199, days: '1-2 dias' },
];

// Estados de pedido
export const ORDER_STATUSES = {
  pendiente: { label: 'Pendiente', color: '#FF9800' },
  pagado: { label: 'Pagado', color: '#2196F3' },
  enviado: { label: 'Enviado', color: '#9C27B0' },
  entregado: { label: 'Entregado', color: '#4CAF50' },
  cancelado: { label: 'Cancelado', color: '#F44336' },
};

// Barra de anuncio
export const ANNOUNCEMENT_TEXT = 'ENVIO GRATIS en compras mayores a $999';
