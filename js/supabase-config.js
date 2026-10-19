/* =====================================================================
   CONFIGURACIÓN DE SUPABASE  (ver README.md → "Configurar Supabase")
   ---------------------------------------------------------------------
   - SUPABASE_URL y SUPABASE_ANON_KEY están en:
       Supabase → Project Settings → API
   - La "anon key" es pública por diseño: la seguridad real la dan las
     políticas RLS de supabase/schema.sql (solo tu correo puede leer/escribir).
   - OWNER_EMAIL: el único correo autorizado para entrar.
   ===================================================================== */
window.APP_CONFIG = {
  SUPABASE_URL: "https://ejzpurasofertcewyesi.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqenB1cmFzb2ZlcnRjZXd5ZXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNTIzMzcsImV4cCI6MjEwNzkyODMzN30._58-01s6MnPlT5DUtFUfnW515PwCOAlOx8NAHsMA97w",   // ej. "eyJhbGciOi..."
  OWNER_EMAIL: "fernando.zela@pucp.edu.pe"
};
