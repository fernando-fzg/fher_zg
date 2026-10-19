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
  SUPABASE_ANON_KEY: "",   // ej. "eyJhbGciOi..."
  OWNER_EMAIL: "fernando.zela@pucp.edu.pe"
};
