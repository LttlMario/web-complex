-- Rulează după INSTALARE-NOUA-COMPLETA.sql și după deploy-ul funcțiilor.
-- Înlocuiește exact cele trei valori PLACEHOLDER înainte de rulare.
create extension if not exists pg_net;
create extension if not exists pg_cron;

select vault.create_secret('https://PROJECT_REF_NOU.supabase.co','project_url');
select vault.create_secret('PUBLISHABLE_KEY_DIN_PROIECTUL_NOU','publishable_key');
select vault.create_secret('ACELASI_CRON_SECRET_DIN_EDGE_SECRETS','cron_secret');

select cron.unschedule(jobid) from cron.job where jobname='invoke-close-expired-shifts';
select cron.schedule('invoke-close-expired-shifts','* * * * *',$job$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name='project_url') || '/functions/v1/close-expired-shifts',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'apikey',(select decrypted_secret from vault.decrypted_secrets where name='publishable_key'),
      'x-cron-secret',(select decrypted_secret from vault.decrypted_secrets where name='cron_secret')
    ),
    body := '{}'::jsonb
  );
$job$);
