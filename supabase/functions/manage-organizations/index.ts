import { createClient } from 'jsr:@supabase/supabase-js@2';
import { requirePanelSession } from '../_shared/panel-session.ts';

const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization,apikey,content-type,x-panel-session','Content-Type':'application/json'};
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
const slugify=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60);

Deno.serve(async request=>{
  if(request.method==='OPTIONS')return new Response('ok',{headers});
  if(request.method!=='POST')return reply({error:'Metodă invalidă.'},405);
  try{
    const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')??'{}').default;
    if(!key)throw new Error('Cheia secretă Supabase lipsește.');
    const db=createClient(Deno.env.get('SUPABASE_URL')!,key);
    const session=await requirePanelSession(db,request,7,true);
    const owners=String(Deno.env.get('PLATFORM_OWNER_DISCORD_IDS')||'').split(',').map(x=>x.trim()).filter(Boolean);
    if(!owners.includes(session.discord_id))return reply({error:'Doar proprietarul platformei poate administra organizațiile.'},403);
    const body=await request.json();

    if(body.action==='list'){
      const {data,error}=await db.from('organizations').select('*,organization_guilds(*),organization_settings(*),organization_role_mappings(*)').order('name');
      if(error)throw error;const ids=(data||[]).map((item:any)=>item.id);const {data:settings,error:settingsError}=ids.length?await db.from('app_settings').select('organization_id,key,value').in('organization_id',ids).in('key',['organization_access','contract_template','page_permissions']):{data:[],error:null};if(settingsError)throw settingsError;return reply({organizations:(data||[]).map((item:any)=>({...item,platform_settings:(settings||[]).filter((setting:any)=>setting.organization_id===item.id).reduce((map:any,setting:any)=>(map[setting.key]=setting.value,map),{})}))});
    }
    if(body.action==='discover'){
      const guildId=String(body.guild_id||'').trim();if(!/^\d{15,22}$/.test(guildId))return reply({error:'Guild ID invalid.'},400);
      const bot=String(Deno.env.get('DISCORD_BOT_TOKEN')||'').trim();if(!bot)throw new Error('DISCORD_BOT_TOKEN lipsește.');
      const [guildResponse,rolesResponse]=await Promise.all([
        fetch(`https://discord.com/api/v10/guilds/${guildId}`,{headers:{Authorization:`Bot ${bot}`}}),
        fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`,{headers:{Authorization:`Bot ${bot}`}})
      ]);
      if(!guildResponse.ok||!rolesResponse.ok)return reply({error:`Botul nu poate accesa serverul (HTTP ${!guildResponse.ok?guildResponse.status:rolesResponse.status}). Invită botul pe server.`},400);
      const guild=await guildResponse.json(),roles=await rolesResponse.json();
      return reply({guild:{id:guild.id,name:guild.name,icon:guild.icon},roles:(roles||[]).filter((r:any)=>!r.managed&&String(r.id)!==guildId).map((r:any)=>({id:String(r.id),name:String(r.name),position:Number(r.position)})).sort((a:any,b:any)=>b.position-a.position)});
    }
    if(body.action==='save'){
      const org=body.organization||{},name=String(org.name||'').trim();if(name.length<2)throw new Error('Numele organizației este obligatoriu.');
      const slug=slugify(String(org.slug||name));if(!slug)throw new Error('Slug invalid.');
      const row={slug,name,code:String(org.code||'').trim()||null,address:String(org.address||'').trim()||null,description:String(org.description||'').trim()||null,logo_url:String(org.logo_url||'').trim()||null,banner_url:String(org.banner_url||'').trim()||null,active:org.active!==false,updated_at:new Date().toISOString()};
      let organizationId=String(org.id||'').trim();
      if(organizationId){const {data,error}=await db.from('organizations').update(row).eq('id',organizationId).select('id').maybeSingle();if(error)throw error;if(!data)throw new Error('Organizația nu mai există. Reîncarcă lista.');}
      else{const {data,error}=await db.from('organizations').insert(row).select('id').single();if(error)throw error;organizationId=data.id;}
      const guilds=Array.isArray(body.guilds)?body.guilds:[];if(!guilds.length)throw new Error('Configurează cel puțin un server Discord.');
      if(organizationId){const {error}=await db.from('organization_guilds').delete().eq('organization_id',organizationId);if(error)throw error;}
      for(const guild of guilds){const guildId=String(guild.guild_id||'').trim();if(!/^\d{15,22}$/.test(guildId))throw new Error(`Guild ID invalid: ${guildId}`);const {error}=await db.from('organization_guilds').upsert({organization_id:organizationId,guild_id:guildId,guild_name:String(guild.guild_name||'').trim()||null,kind:guild.kind==='secondary'?'secondary':'primary',enabled:guild.enabled!==false},{onConflict:'guild_id'});if(error)throw error;}
      const settings=body.settings||{};const clientId=String(settings.discord_client_id||'').trim();const publicUrl=String(settings.panel_public_url||'').replace(/\/$/,'');if(!/^\d{15,22}$/.test(clientId))throw new Error('Discord Client ID invalid.');try{new URL(publicUrl)}catch{throw new Error('URL-ul public al panelului este invalid.');}
      const {error:settingsError}=await db.from('organization_settings').upsert({organization_id:organizationId,discord_client_id:clientId,panel_public_url:publicUrl,family_webhook_url:settings.family_webhook_url||null,mechanics_webhook_url:settings.mechanics_webhook_url||null,pontaj_webhook_url:settings.pontaj_webhook_url||null,requests_webhook_url:settings.requests_webhook_url||null,contracts_webhook_url:settings.contracts_webhook_url||null,marketplace_webhook_url:settings.marketplace_webhook_url||null,illegal_marketplace_webhook_url:settings.illegal_marketplace_webhook_url||null,updated_by_discord_id:session.discord_id,updated_at:new Date().toISOString()},{onConflict:'organization_id'});if(settingsError)throw settingsError;
      await db.from('app_settings').upsert({organization_id:organizationId,key:'pontaj_config',value:{maxHours:12,dayEndTime:'19:59',nightEndTime:'23:00',excludeBreaks:false}},{onConflict:'organization_id,key'});
      if(body.access){const expiresAt=String(body.access.expires_at||'').trim();if(expiresAt&&Number.isNaN(Date.parse(expiresAt)))throw new Error('Data expirării este invalidă.');const {error}=await db.from('app_settings').upsert({organization_id:organizationId,key:'organization_access',value:{expires_at:expiresAt||null},updated_at:new Date().toISOString()},{onConflict:'organization_id,key'});if(error)throw error;if(!expiresAt||Date.parse(expiresAt)>Date.now())await db.from('organizations').update({active:true,updated_at:new Date().toISOString()}).eq('id',organizationId);}
      if(body.contract_template){const title=String(body.contract_template.title||'').trim(),template=String(body.contract_template.template||'').trim();if(title.length<2)throw new Error('Numele contractului este obligatoriu.');if(template.length<20)throw new Error('Textul contractului este prea scurt.');const allowed=['{{COMPANY}}','{{ADDRESS}}','{{MANAGER}}','{{EMPLOYEE_NAME}}','{{CNP}}','{{PHONE}}','{{POSITION}}','{{SALARY}}','{{PROGRAM}}','{{START_DATE}}','{{CONTRACT_NUMBER}}'];const unknown=[...template.matchAll(/{{[A-Z0-9_]+}}/g)].map(match=>match[0]).filter(value=>!allowed.includes(value));if(unknown.length)throw new Error(`Câmpuri necunoscute în contract: ${[...new Set(unknown)].join(', ')}`);const {error}=await db.from('app_settings').upsert({organization_id:organizationId,key:'contract_template',value:{title,template},updated_at:new Date().toISOString()},{onConflict:'organization_id,key'});if(error)throw error;}
      if(body.page_permissions&&typeof body.page_permissions==='object'){const allowedPages=new Set(['index.html','anunturi.html','pontaj.html','cereri.html','contracte.html','calculatorilegal.html','craftmecanics.html','locatiiilegale.html','marketplace.html','marketplace-ilegal.html','rapoarte.html','asistent.html']);const rules=Object.fromEntries(Object.entries(body.page_permissions).filter(([page])=>allowedPages.has(page)).map(([page,ids]:any)=>[page,[...new Set((Array.isArray(ids)?ids:[]).map(String).filter(id=>/^\d{15,22}$/.test(id)))]]));const {error}=await db.from('app_settings').upsert({organization_id:organizationId,key:'page_permissions',value:rules,updated_at:new Date().toISOString()},{onConflict:'organization_id,key'});if(error)throw error;}
      if(Array.isArray(body.roles)){
        await db.from('organization_role_mappings').delete().eq('organization_id',organizationId);
        const rows=body.roles.map((role:any)=>({organization_id:organizationId,guild_id:String(role.guild_id),discord_role_id:String(role.discord_role_id),discord_role_name:String(role.discord_role_name),panel_role:String(role.panel_role),permission_level:Number(role.permission_level),priority:Number(role.permission_level)*10,enabled:true}));
        if(rows.some((r:any)=>!/^\d{15,22}$/.test(r.discord_role_id)||r.permission_level<1||r.permission_level>7))throw new Error('Mapările rolurilor sunt invalide.');
        const {error}=await db.from('organization_role_mappings').insert(rows);if(error)throw error;
      }
      return reply({ok:true,organization_id:organizationId});
    }
    if(body.action==='extend'){
      const organizationId=String(body.organization_id||'').trim(),expiresAt=String(body.expires_at||'').trim();if(!organizationId||Number.isNaN(Date.parse(expiresAt))||Date.parse(expiresAt)<=Date.now())return reply({error:'Alege o dată viitoare pentru prelungire.'},400);
      const {data,error}=await db.from('organizations').update({active:true,updated_at:new Date().toISOString()}).eq('id',organizationId).select('id').maybeSingle();if(error)throw error;if(!data)return reply({error:'Organizația nu există.'},404);
      const {error:settingError}=await db.from('app_settings').upsert({organization_id:organizationId,key:'organization_access',value:{expires_at:expiresAt},updated_at:new Date().toISOString()},{onConflict:'organization_id,key'});if(settingError)throw settingError;return reply({ok:true,expires_at:expiresAt});
    }
    if(body.action==='set_access'){
      const organizationId=String(body.organization_id||'').trim(),expiresAt=String(body.expires_at||'').trim(),active=body.active!==false;
      if(!organizationId)return reply({error:'Organizația lipsește.'},400);if(expiresAt&&Number.isNaN(Date.parse(expiresAt)))return reply({error:'Data expirării este invalidă.'},400);
      const effectiveActive=active&&(!expiresAt||Date.parse(expiresAt)>Date.now());const {data,error}=await db.from('organizations').update({active:effectiveActive,updated_at:new Date().toISOString()}).eq('id',organizationId).select('id').maybeSingle();if(error)throw error;if(!data)return reply({error:'Organizația nu există.'},404);
      const {error:settingError}=await db.from('app_settings').upsert({organization_id:organizationId,key:'organization_access',value:{expires_at:expiresAt||null},updated_at:new Date().toISOString()},{onConflict:'organization_id,key'});if(settingError)throw settingError;return reply({ok:true,active:effectiveActive,expires_at:expiresAt||null});
    }
    if(body.action==='delete'){
      const organizationId=String(body.organization_id||'').trim();
      if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(organizationId))return reply({error:'ID-ul organizației este invalid.'},400);
      const {data:organization,error:findError}=await db.from('organizations').select('id,name').eq('id',organizationId).maybeSingle();
      if(findError)throw findError;if(!organization)return reply({error:'Organizația nu mai există.'},404);
      if(String(body.confirm_name||'').trim()!==organization.name)return reply({error:'Confirmarea nu corespunde numelui organizației.'},400);
      const {count,error:countError}=await db.from('organizations').select('id',{count:'exact',head:true});if(countError)throw countError;
      if((count||0)<=1)return reply({error:'Ultima organizație nu poate fi ștearsă. Creează întâi alta.'},409);
      const tenantTables=['panel_notification_reads','community_poll_votes','community_reactions','community_poll_options','community_posts','panel_notifications','admin_audit_log','illegal_locations','profiles','marketplace_ilegal','marketplace','app_settings','absences','shifts'];
      for(const table of tenantTables){const {error}=await db.from(table).delete().eq('organization_id',organizationId);if(error)throw new Error(`Ștergerea datelor din ${table} a eșuat: ${error.message}`);}
      const {error:deleteError}=await db.from('organizations').delete().eq('id',organizationId);if(deleteError)throw deleteError;
      return reply({ok:true,deleted_organization_id:organizationId});
    }
    return reply({error:'Acțiune necunoscută.'},400);
  }catch(error){console.error(error);return reply({error:error instanceof Error?error.message:'Eroare internă.'},400)}
});
