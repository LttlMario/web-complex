-- Blochează accesul direct la date imediat ce organizația expiră.
create or replace function public.panel_session_context()
returns table(organization_id uuid,discord_id text,permission_level smallint)
language sql stable security definer set search_path=''
as $$
  select s.organization_id,s.discord_id,s.permission_level
  from public.panel_sessions s
  join public.organizations o on o.id=s.organization_id and o.active
  left join public.app_settings a on a.organization_id=s.organization_id and a.key='organization_access'
  where s.token_hash=encode(extensions.digest(coalesce((nullif(current_setting('request.headers',true),'')::jsonb->>'x-panel-session'),''),'sha256'),'hex')
    and s.revoked_at is null and s.expires_at>now()
    and (a.value->>'expires_at' is null or (a.value->>'expires_at')::timestamptz>now())
  limit 1
$$;

revoke all on function public.panel_session_context() from public;
grant execute on function public.panel_session_context() to anon,authenticated;
