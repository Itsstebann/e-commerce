-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Insertar datos de prueba si esta vacia
INSERT INTO productos (nombre, precio, precio_oferta, categoria_nombre, slug, destacado, nuevo, stock) 
SELECT 'Eau de Parfum Noir', 1299, 999, 'Para El', 'hombre', true, true, 15
WHERE NOT EXISTS (SELECT 1 FROM productos limit 1);

INSERT INTO productos (nombre, precio, precio_oferta, categoria_nombre, slug, destacado, nuevo, stock) 
SELECT 'Rose Absolue Intense', 1599, null, 'Para Ella', 'mujer', true, false, 8
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Rose Absolue Intense');

INSERT INTO productos (nombre, precio, precio_oferta, categoria_nombre, slug, destacado, nuevo, stock) 
SELECT 'Oud & Santal Premium', 1899, 1499, 'Unisex', 'unisex', true, true, 5
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Oud & Santal Premium');

INSERT INTO productos (nombre, precio, precio_oferta, categoria_nombre, slug, destacado, nuevo, stock) 
SELECT 'Fresh Citrus Breeze', 899, null, 'Para El', 'hombre', true, false, 20
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Fresh Citrus Breeze');

INSERT INTO productos (nombre, precio, precio_oferta, categoria_nombre, slug, destacado, nuevo, stock) 
SELECT 'Jasmine & Vanilla Dream', 1199, 899, 'Para Ella', 'mujer', true, false, 12
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Jasmine & Vanilla Dream');

INSERT INTO productos (nombre, precio, precio_oferta, categoria_nombre, slug, destacado, nuevo, stock) 
SELECT 'Amber Wood Collection', 2199, null, 'Unisex', 'unisex', true, true, 3
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Amber Wood Collection');

INSERT INTO productos (nombre, precio, precio_oferta, categoria_nombre, slug, destacado, nuevo, stock) 
SELECT 'Ocean Mist Sport', 799, 599, 'Para El', 'hombre', true, false, 25
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Ocean Mist Sport');

INSERT INTO productos (nombre, precio, precio_oferta, categoria_nombre, slug, destacado, nuevo, stock) 
SELECT 'Peony & Blush Suede', 1399, null, 'Para Ella', 'mujer', true, false, 10
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Peony & Blush Suede');

INSERT INTO productos (nombre, precio, precio_oferta, categoria_nombre, slug, destacado, nuevo, stock) 
SELECT 'Vetiver & Tobacco', 1699, 1299, 'Para El', 'hombre', false, false, 7
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Vetiver & Tobacco');

INSERT INTO productos (nombre, precio, precio_oferta, categoria_nombre, slug, destacado, nuevo, stock) 
SELECT 'Cherry Blossom Delight', 999, null, 'Para Ella', 'mujer', false, true, 18
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Cherry Blossom Delight');

INSERT INTO productos (nombre, precio, precio_oferta, categoria_nombre, slug, destacado, nuevo, stock) 
SELECT 'Musk Noir Absolute', 2499, 1999, 'Unisex', 'unisex', false, false, 4
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Musk Noir Absolute');

INSERT INTO productos (nombre, precio, precio_oferta, categoria_nombre, slug, destacado, nuevo, stock) 
SELECT 'Bergamot & Neroli', 1099, null, 'Para El', 'hombre', false, false, 14
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Bergamot & Neroli');

-- Crear tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cliente_nombre TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_telefono TEXT,
  direccion_envio JSONB NOT NULL,
  total NUMERIC NOT NULL,
  estado TEXT DEFAULT 'pendiente', -- pendiente, pagado, enviado, entregado
  mercadopago_id TEXT,
  mercadopago_preference_id TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Crear tabla de items del pedido
CREATE TABLE IF NOT EXISTS pedido_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  nombre TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  precio_unitario NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL
);
