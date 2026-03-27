import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Cargar variables de .env.local manualmente
const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length > 0 && !key.trim().startsWith('#')) {
    process.env[key.trim()] = value.join('=').trim();
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupBucket() {
  console.log('Intentando crear el bucket "product-images"...');
  const { data, error } = await supabase.storage.createBucket('product-images', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('El bucket "product-images" ya existe.');
    } else {
      console.error('Error al crear el bucket:', error.message);
    }
  } else {
    console.log('Bucket creado exitosamente:', data);
  }

  console.log('\n=== IMPORTANTE: POLÍTICAS DE SEGURIDAD ===');
  console.log('Debes ejecutar el siguiente código SQL en tu panel de Supabase (SQL Editor) para permitir la subida de imágenes:');
  console.log(`
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT TO public
USING ( bucket_id = 'product-images' );

CREATE POLICY "Anon Insert"
ON storage.objects FOR INSERT TO public
WITH CHECK ( bucket_id = 'product-images' );

CREATE POLICY "Anon Update"
ON storage.objects FOR UPDATE TO public
USING ( bucket_id = 'product-images' );

CREATE POLICY "Anon Delete"
ON storage.objects FOR DELETE TO public
USING ( bucket_id = 'product-images' );
  `);
}

setupBucket();
