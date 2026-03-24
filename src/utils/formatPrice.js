/**
 * Formatea un precio numerico a formato de moneda
 * @param {number} price - Precio a formatear
 * @param {string} currency - Codigo de moneda (MXN, COP, etc.)
 * @returns {string} Precio formateado
 */
export function formatPrice(price, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Calcula el porcentaje de descuento
 * @param {number} originalPrice - Precio original
 * @param {number} salePrice - Precio con descuento
 * @returns {number} Porcentaje de descuento
 */
export function calculateDiscount(originalPrice, salePrice) {
  if (!originalPrice || !salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Genera un slug a partir de un texto
 * @param {string} text - Texto para convertir
 * @returns {string} Slug generado
 */
export function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
