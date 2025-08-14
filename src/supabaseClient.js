import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sxilredfuujrdkjfgwhw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4aWxyZWRmdXVqcmRramZnd2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMzQ0NzUsImV4cCI6MjA3MDYxMDQ3NX0.a_2FQVK0YrIF-m0tq3eX4vLPblFAS0XGp0CyoO3iwik'

const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  }
}

// Log de configuración
console.log('Configurando Supabase con URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey, supabaseOptions)

