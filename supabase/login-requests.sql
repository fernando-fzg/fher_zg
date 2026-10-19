-- =====================================================================
-- Autorización desde otro dispositivo
-- ---------------------------------------------------------------------
-- Permite pedir el enlace en la PC, abrirlo en el celular y que la
-- sesión continúe en la PC.
--
-- Cómo funciona:
-- 1. La PC crea una solicitud con una clave pública (la privada nunca
--    sale de la PC).
-- 2. El celular abre el enlace, inicia sesión y cifra su token de
--    sesión con esa clave pública.
-- 3. La PC recoge el token cifrado, lo descifra y continúa.
-- En la tabla solo se guarda texto cifrado y las solicitudes vencen a
-- los 15 minutos.
--
-- Ejecuta este archivo en: Supabase → SQL Editor → New query → Run
-- =====================================================================

create table if not exists public.login_requests (
  id         uuid        primary key,
  public_key text        not null,
  payload    text,
  created_at timestamptz not null default now()
);

-- Nadie accede a la tabla directamente: solo a través de las funciones de abajo.
alter table public.login_requests enable row level security;
revoke all on public.login_requests from anon, authenticated;

-- 1) La PC crea la solicitud (sin sesión iniciada)
create or replace function public.create_login_request(p_id uuid, p_public_key text)
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from login_requests where created_at < now() - interval '15 minutes';
  if length(p_public_key) > 1000 then raise exception 'clave inválida'; end if;
  if (select count(*) from login_requests) >= 20 then raise exception 'demasiadas solicitudes'; end if;
  insert into login_requests (id, public_key) values (p_id, p_public_key);
end $$;

-- 2a) El celular (ya autenticado) lee la clave pública
create or replace function public.get_login_request_key(p_id uuid)
returns text language plpgsql security definer set search_path = public as $$
begin
  if lower(coalesce(auth.jwt() ->> 'email', '')) <> lower('fernando.zela@pucp.edu.pe') then
    raise exception 'no autorizado';
  end if;
  return (select public_key from login_requests
          where id = p_id and payload is null and created_at > now() - interval '15 minutes');
end $$;

-- 2b) El celular entrega el token cifrado
create or replace function public.complete_login_request(p_id uuid, p_payload text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if lower(coalesce(auth.jwt() ->> 'email', '')) <> lower('fernando.zela@pucp.edu.pe') then
    raise exception 'no autorizado';
  end if;
  update login_requests set payload = p_payload
   where id = p_id and payload is null and created_at > now() - interval '15 minutes';
  return found;
end $$;

-- 3) La PC recoge el token cifrado (una sola vez: luego se borra)
create or replace function public.poll_login_request(p_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v text;
begin
  delete from login_requests where id = p_id and payload is not null returning payload into v;
  return v;
end $$;

-- Permisos: quién puede llamar a cada función
revoke all on function public.create_login_request(uuid, text)   from public, anon, authenticated;
revoke all on function public.get_login_request_key(uuid)        from public, anon, authenticated;
revoke all on function public.complete_login_request(uuid, text) from public, anon, authenticated;
revoke all on function public.poll_login_request(uuid)           from public, anon, authenticated;

grant execute on function public.create_login_request(uuid, text)   to anon, authenticated;
grant execute on function public.poll_login_request(uuid)           to anon, authenticated;
grant execute on function public.get_login_request_key(uuid)        to authenticated;
grant execute on function public.complete_login_request(uuid, text) to authenticated;
