export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/'],
      },
    ],
    sitemap: 'https://www.aurumeacol.com/sitemap.xml',
  };
}
