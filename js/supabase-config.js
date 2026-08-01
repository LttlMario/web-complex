// Configurația publică de conectare. Cheia service_role NU se pune aici.
window.PANEL_SUPABASE_CONFIG = Object.freeze({
    url: 'https://vkvsabbbawyiurnaiugo.supabase.co',
    publishableKey: 'sb_publishable_gRM7uXmfknjfFiOg7jjqDA_y-VGPMVD'
});

// Toate cererile către tabele transmit sesiunea opacă verificată de RLS.
window.createPanelSupabaseClient = function createPanelSupabaseClient() {
    const config = window.PANEL_SUPABASE_CONFIG;
    const sessionToken = localStorage.getItem('panel_session_token') || '';
    return window.supabase.createClient(config.url, config.publishableKey, {
        global: { headers: sessionToken ? { 'X-Panel-Session': sessionToken } : {} },
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
};

window.getActiveOrganization = function getActiveOrganization() {
    try { return JSON.parse(localStorage.getItem('panel_active_organization') || 'null'); }
    catch (_) { return null; }
};

window.getActiveOrganizationId = function getActiveOrganizationId() {
    return window.getActiveOrganization()?.id || JSON.parse(localStorage.getItem('discord_user') || 'null')?.organization_id || null;
};

// Atașează sesiunea numai apelurilor Edge Functions ale proiectului curent.
const panelNativeFetch = window.fetch.bind(window);
window.fetch = function panelAuthenticatedFetch(input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url || '';
    const functionPrefix = `${window.PANEL_SUPABASE_CONFIG.url}/functions/v1/`;
    if (!String(url).startsWith(functionPrefix)) return panelNativeFetch(input, init);
    const sessionToken = localStorage.getItem('panel_session_token');
    if (!sessionToken) return panelNativeFetch(input, init);
    const headers = new Headers(init.headers || (typeof input !== 'string' ? input.headers : undefined));
    headers.set('X-Panel-Session', sessionToken);
    return panelNativeFetch(input, { ...init, headers });
};
