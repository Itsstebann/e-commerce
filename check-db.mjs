import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length > 0 && !key.trim().startsWith('#')) {
    process.env[key.trim()] = value.join('=').trim();
  }
});

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('productos').select('id, nombre');
  if (error) console.error(error);
  else {
    console.log(`Encontrados ${data.length} productos en la base de datos Supabase:`);
    console.log(data);
  }
}

check();
