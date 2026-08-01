-- Permite mai multe roluri Discord cu același nivel de acces în panel.
alter table public.organization_role_mappings
  drop constraint if exists organization_role_mappings_organization_id_guild_id_permission_level_key;

create index if not exists organization_role_mappings_org_guild_level_idx
  on public.organization_role_mappings(organization_id,guild_id,permission_level);
