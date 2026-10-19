-- =====================================================================
-- Esquema de Supabase para el panel personal
-- Ejecuta este archivo en: Supabase → SQL Editor → New query → Run
-- IMPORTANTE: reemplaza 'TU_CORREO@ejemplo.com' por tu correo (2 veces).
-- =====================================================================

create table if not exists public.modules (
  user_id    uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  key        text        not null,          -- schedule | events | health | pantry | menu
  data       jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.modules enable row level security;

-- Solo TU usuario, con TU correo, puede leer y escribir SUS filas.
drop policy if exists "owner_only" on public.modules;
create policy "owner_only" on public.modules
  for all
  to authenticated
  using      (auth.uid() = user_id and lower(auth.jwt() ->> 'email') = lower('TU_CORREO@ejemplo.com'))
  with check (auth.uid() = user_id and lower(auth.jwt() ->> 'email') = lower('TU_CORREO@ejemplo.com'));

-- Nadie anónimo tiene acceso.
revoke all on public.modules from anon;
