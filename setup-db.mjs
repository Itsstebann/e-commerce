import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tmfuibrkvwqdjkcxnxjj.supabase.co';
const supabaseKey = 'sb_publishable_5CBY96jEdGZwZEh0tnz-Wg_oFBiBh1A';

const supabase = createClient(supabaseUrl, supabaseKey);

const productos = [
  { nombre: 'Eau de Parfum Noir', descripcion: 'Una fragancia intensa y seductora con notas de madera oscura, cuero y especias orientales. Perfecta para las noches mas elegantes.', precio: 1299, precio_oferta: 999, imagen_url: null, categoria_nombre: 'Para El', slug: 'hombre', destacado: true, nuevo: true, stock: 15 },
  { nombre: 'Rose Absolue Intense', descripcion: 'Un bouquet de rosas de Bulgaria con un corazon de jazmin y fondo de almizcle. Femenina, elegante y duradera.', precio: 1599, precio_oferta: null, imagen_url: null, categoria_nombre: 'Para Ella', slug: 'mujer', destacado: true, nuevo: false, stock: 8 },
  { nombre: 'Oud & Santal Premium', descripcion: 'Madera de oud combinada con sandalo cremoso y un toque de vainilla. Una fragancia unisex que transmite lujo y calidez.', precio: 1899, precio_oferta: 1499, imagen_url: null, categoria_nombre: 'Unisex', slug: 'unisex', destacado: true, nuevo: true, stock: 5 },
  { nombre: 'Fresh Citrus Breeze', descripcion: 'Notas citricas de bergamota y limon con un corazon de hierba fresca y base de musgo blanco. Refrescante y energizante.', precio: 899, precio_oferta: null, imagen_url: null, categoria_nombre: 'Para El', slug: 'hombre', destacado: true, nuevo: false, stock: 20 },
  { nombre: 'Jasmine & Vanilla Dream', descripcion: 'Jazmin nocturno con vainilla de Madagascar y un toque de tonka. Dulce, envolvente y adictiva.', precio: 1199, precio_oferta: 899, imagen_url: null, categoria_nombre: 'Para Ella', slug: 'mujer', destacado: true, nuevo: false, stock: 12 },
  { nombre: 'Amber Wood Collection', descripcion: 'Ambar fosil con madera de cedro, incienso y pachuli. Una fragancia profunda y meditativa.', precio: 2199, precio_oferta: null, imagen_url: null, categoria_nombre: 'Unisex', slug: 'unisex', destacado: true, nuevo: true, stock: 3 },
  { nombre: 'Ocean Mist Sport', descripcion: 'Brisa marina con notas acuaticas, menta fresca y madera flotante. Fresca ideal para el hombre activo.', precio: 799, precio_oferta: 599, imagen_url: null, categoria_nombre: 'Para El', slug: 'hombre', destacado: true, nuevo: false, stock: 25 },
  { nombre: 'Peony & Blush Suede', descripcion: 'Peonia en flor con gamuza delicada y un toque de manzana roja. Femenina y contemporanea.', precio: 1399, precio_oferta: null, imagen_url: null, categoria_nombre: 'Para Ella', slug: 'mujer', destacado: true, nuevo: false, stock: 10 },
  { nombre: 'Vetiver & Tobacco', descripcion: 'Vetiver puro con tabaco dulce y cuero suave. Masculina y sofisticada para el caballero moderno.', precio: 1699, precio_oferta: 1299, imagen_url: null, categoria_nombre: 'Para El', slug: 'hombre', destacado: false, nuevo: false, stock: 7 },
  { nombre: 'Cherry Blossom Delight', descripcion: 'Flores de cerezo con pera fresca y un fondo de almizcle blanco. Ligera y primaveral.', precio: 999, precio_oferta: null, imagen_url: null, categoria_nombre: 'Para Ella', slug: 'mujer', destacado: false, nuevo: true, stock: 18 },
  { nombre: 'Musk Noir Absolute', descripcion: 'Almizcle negro intenso con ambar y notas de cuero. Una fragancia profunda y misteriosa.', precio: 2499, precio_oferta: 1999, imagen_url: null, categoria_nombre: 'Unisex', slug: 'unisex', destacado: false, nuevo: false, stock: 4 },
  { nombre: 'Bergamot & Neroli', descripcion: 'Bergamota italiana con neroli y un toque de cedro. Una fragancia citrica y elegante.', precio: 1099, precio_oferta: null, imagen_url: null, categoria_nombre: 'Para El', slug: 'hombre', destacado: false, nuevo: false, stock: 14 },
];

async function setup() {
  console.log('Insertando productos en Supabase...');
  
  const { data, error } = await supabase.from('productos').insert(productos).select();
  
  if (error) {
    console.error('Error al insertar. Es probable que la tabla no exista aun.');
    console.error('Error:', error.message);
    console.log('');
    console.log('=== DEBES CREAR LAS TABLAS MANUALMENTE ===');
    console.log('Ve al SQL Editor de tu Supabase dashboard y ejecuta este SQL:');
    console.log('');
    console.log(`
CREATE TABLE productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio NUMERIC NOT NULL,
  precio_oferta NUMERIC,
  imagen_url TEXT,
  categoria_nombre TEXT NOT NULL,
  slug TEXT NOT NULL,
  destacado BOOLEAN DEFAULT false,
  nuevo BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 0,
  descripcion TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_nombre TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_telefono TEXT,
  direccion_envio JSONB NOT NULL,
  total NUMERIC NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  mercadopago_id TEXT,
  mercadopago_preference_id TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE pedido_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  nombre TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  precio_unitario NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL
);

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on productos" ON productos FOR SELECT USING (true);
CREATE POLICY "Allow public insert on pedidos" ON pedidos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on pedidos" ON pedidos FOR SELECT USING (true);
CREATE POLICY "Allow public update on pedidos" ON pedidos FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on pedido_items" ON pedido_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on pedido_items" ON pedido_items FOR SELECT USING (true);
`);
    console.log('');
    console.log('Luego vuelve a ejecutar: node setup-db.mjs');
  } else {
    console.log(`Se insertaron ${data.length} productos exitosamente.`);
  }
}

setup();
