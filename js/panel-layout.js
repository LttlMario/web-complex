// Navigare comună pentru panel: meniu mobil și sidebar pliabil pe desktop.
(() => {
    const COLLAPSE_KEY = 'panel_sidebar_collapsed';

    function addStyles() {
        if (document.getElementById('panel-layout-styles')) return;
        const style = document.createElement('style');
        style.id = 'panel-layout-styles';
        style.textContent = `
            .panel-responsive-sidebar { transition: width .2s ease; position:sticky; top:0; height:100vh; align-self:flex-start; }
            #panel-shared-sidebar, #panel-shared-sidebar *, #panel-mobile-menu, #panel-mobile-menu * { box-sizing:border-box; }
            #panel-shared-sidebar { display:flex !important; flex-direction:column !important; justify-content:space-between !important; overflow:visible; border-right:1px solid #1e293b !important; background:#0f172a !important; color:#e2e8f0 !important; font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif !important; text-align:left !important; }
            #panel-shared-sidebar > div:first-child { flex:1 1 auto; min-height:0; padding:24px !important; overflow-y:auto !important; }
            #panel-shared-sidebar > div:last-child { flex:0 0 auto; min-height:78px; padding:16px !important; display:flex !important; align-items:center !important; justify-content:space-between !important; gap:8px !important; border-top:1px solid #1e293b !important; background:#0f172a !important; }
            #panel-shared-sidebar h1 { display:flex !important; align-items:center !important; gap:12px !important; margin:0 !important; padding:0 !important; color:#f8fafc !important; font-size:20px !important; font-weight:700 !important; line-height:1.25 !important; text-align:left !important; white-space:normal !important; }
            #panel-shared-sidebar h1 > span { display:block; min-width:0; }
            #panel-shared-sidebar h1 > span > span { display:block !important; margin-top:3px; color:#94a3b8 !important; font-size:12px !important; font-weight:400 !important; line-height:1.3 !important; }
            #panel-shared-sidebar nav { display:flex !important; flex-direction:column !important; gap:6px !important; margin:24px 0 0 !important; padding:0 !important; }
            #panel-shared-sidebar .nav-link { width:100% !important; min-height:42px; margin:0 !important; padding:10px 14px !important; display:flex; align-items:center !important; gap:12px !important; border-radius:12px !important; color:#cbd5e1 !important; font-size:14px !important; font-weight:500 !important; line-height:1.25 !important; text-align:left !important; text-decoration:none !important; white-space:normal !important; }
            #panel-shared-sidebar .nav-link > span:first-child { width:20px; flex:0 0 20px; text-align:center; }
            #panel-shared-sidebar .nav-link > span:last-child { min-width:0; overflow-wrap:anywhere; }
            #panel-shared-sidebar .nav-link.bg-emerald-500\/10 { color:#6ee7b7 !important; }
            #panel-shared-sidebar #user-avatar { width:36px !important; height:36px !important; flex:0 0 36px; margin:0 !important; padding:0 !important; border:1px solid #334155 !important; border-radius:999px !important; object-fit:cover; }
            #panel-shared-sidebar #user-display-name, #panel-shared-sidebar #user-role { margin:0 !important; padding:0 !important; line-height:1.3 !important; }
            #panel-shared-sidebar #user-display-name { color:#f8fafc !important; font-size:13px !important; font-weight:600 !important; }
            #panel-shared-sidebar #user-role { margin-top:3px !important; color:#34d399 !important; font-size:11px !important; }
            #panel-shared-sidebar button { font-family:inherit !important; }
            #panel-shared-sidebar [data-shared-logout] { min-width:auto !important; margin:0 !important; padding:7px 9px !important; border:1px solid rgba(244,63,94,.25) !important; border-radius:9px !important; background:rgba(244,63,94,.08) !important; color:#fb7185 !important; font-size:11px !important; line-height:1 !important; cursor:pointer; }
            #panel-mobile-menu .panel-mobile-nav { display:flex !important; flex-direction:column !important; gap:6px !important; }
            #panel-mobile-menu .nav-link { min-height:44px; margin:0 !important; padding:11px 14px !important; display:flex; align-items:center !important; gap:12px !important; border-radius:12px !important; color:#cbd5e1 !important; font-size:14px !important; line-height:1.25 !important; text-decoration:none !important; }
            .panel-brand-logo { width:46px; height:46px; flex:none; border-radius:14px; object-fit:cover; border:1px solid #334155; box-shadow:0 8px 24px rgba(0,0,0,.32); }
            .panel-brand-heading { display:flex; align-items:center; gap:12px; }
            body.panel-shared-sidebar-page { padding-left:18rem; }
            body.panel-shared-sidebar-page > #panel-shared-sidebar { position:fixed; inset:0 auto 0 0; z-index:60; width:18rem; }
            .panel-responsive-sidebar.fixed { position:fixed; }
            #panel-theme-toggle { width:38px; height:38px; flex:none; display:grid; place-items:center; border:1px solid #334155; border-radius:11px; background:#0b1220; color:#cbd5e1; cursor:pointer; box-shadow:0 5px 16px rgba(0,0,0,.18); }
            #panel-theme-toggle:hover { border-color:#10b981; color:#6ee7b7; }
            .panel-responsive-sidebar .nav-link, .panel-mobile-nav .nav-link, #mobile-menu .nav-link { border:1px solid #2d4058; background:linear-gradient(135deg,rgba(30,45,65,.9),rgba(19,31,49,.92)); box-shadow:0 3px 10px rgba(2,6,23,.2); }
            .panel-responsive-sidebar .nav-link:hover, .panel-mobile-nav .nav-link:hover, #mobile-menu .nav-link:hover { border-color:#48617d; background:linear-gradient(135deg,#293e58,#1d3048); transform:translateX(2px); }
            .panel-responsive-sidebar .nav-link.bg-emerald-500\\/10, .panel-mobile-nav .nav-link.bg-emerald-500\\/10, #mobile-menu .nav-link.bg-emerald-500\\/10 { border-color:rgba(52,211,153,.45); background:linear-gradient(135deg,rgba(5,150,105,.34),rgba(6,95,70,.3)); }
            html,body { max-width:100%; overflow-x:hidden; }
            body,main,#app { min-width:0; }
            img,svg,video,canvas { max-width:100%; }
            header { position:relative; min-height:76px !important; height:auto !important; padding-top:12px !important; padding-bottom:12px !important; gap:12px; }
            header > div:not(.panel-header-tools) { min-width:0; }
            header h1,header h2 { font-size:clamp(1.05rem,2vw,1.35rem) !important; line-height:1.25 !important; white-space:normal !important; overflow-wrap:anywhere; }
            header p { white-space:normal; line-height:1.35; }
            .panel-global-header { width:100% !important; max-width:none !important; min-height:76px !important; margin:0 !important; padding:12px 32px !important; display:flex !important; align-items:center !important; flex-wrap:wrap; gap:12px; flex:none; position:sticky !important; top:0; z-index:20; border-bottom:1px solid #1e293b; background:rgba(15,23,42,.72); backdrop-filter:blur(10px); text-align:left !important; }
            .panel-global-header .panel-global-title { display:flex; flex-direction:column; justify-content:center; min-width:0; flex:none; }
            .panel-global-header h1,.panel-global-header h2 { margin:0 !important; color:#f1f5f9; font-size:1.125rem !important; font-weight:700; }
            .panel-global-header p { margin:3px 0 0 !important; color:#94a3b8; font-size:11px; }
            .community-toolbar { justify-content:flex-end !important; margin-bottom:18px !important; }
            header:has(.panel-header-tools) { padding-right:72px !important; }
            .panel-header-tools { position:absolute; inset:0 18px; z-index:25; display:flex; align-items:center; pointer-events:none; }
            .panel-header-tools .panel-search-host { position:absolute; left:50%; transform:translateX(-50%); width:min(620px,45vw); min-width:0; pointer-events:auto; }
            .panel-header-tools .panel-search-host > div, .panel-header-tools .panel-search-host .relative, .panel-header-tools .search-container { width:100% !important; max-width:none !important; }
            .panel-global-search { width:100%; height:40px; padding:0 15px; border:1px solid #334155; border-radius:12px; outline:none; background:#07101f; color:#e2e8f0; font-size:13px; box-shadow:inset 0 1px 0 rgba(255,255,255,.025); transition:border-color .18s,box-shadow .18s; }
            .panel-global-search::placeholder { color:#64748b; }
            .panel-global-search:focus { border-color:#10b981; box-shadow:0 0 0 3px rgba(16,185,129,.12); }
            .panel-global-search-match { outline:2px solid rgba(16,185,129,.7) !important; outline-offset:2px; }
            .panel-header-tools #panel-theme-toggle { margin-left:auto; pointer-events:auto; }

            @media (min-width:768px) {
                .panel-global-header:has(.panel-header-tools) { min-height:132px !important; padding-top:16px !important; padding-bottom:66px !important; }
                .panel-global-header .panel-header-tools { align-items:flex-start; padding-top:17px; }
                .panel-global-header .panel-header-tools .panel-search-host { top:72px; }
            }

            /* Tema Panel nu primește suprascrieri: păstrează exact designul original al paginilor. */
            html[data-panel-theme="dark"] { color-scheme:dark; --bg-main:#030712; --bg-panel:#080f1d; --bg-panel-hover:#111c2e; --card:#0a1220; --border:#223047; --text-main:#e5edf8; --text-muted:#91a0b6; }
            html[data-panel-theme="dark"] body, html[data-panel-theme="dark"] main, html[data-panel-theme="dark"] #app { background:#030712 !important; color:#e5edf8 !important; }
            html[data-panel-theme="dark"] aside, html[data-panel-theme="dark"] header, html[data-panel-theme="dark"] footer, html[data-panel-theme="dark"] .bg-slate-900, html[data-panel-theme="dark"] .post, html[data-panel-theme="dark"] .dialog, html[data-panel-theme="dark"] .panel, html[data-panel-theme="dark"] .card { background-color:#080f1d !important; }
            html[data-panel-theme="dark"] .bg-slate-950, html[data-panel-theme="dark"] input, html[data-panel-theme="dark"] textarea, html[data-panel-theme="dark"] select, html[data-panel-theme="dark"] .poll-option, html[data-panel-theme="dark"] .tab, html[data-panel-theme="dark"] .reaction { background-color:#030712 !important; color:#e5edf8 !important; }
            html[data-panel-theme="dark"] .bg-slate-800 { background-color:#111c2e !important; }
            html[data-panel-theme="dark"] .border-slate-800, html[data-panel-theme="dark"] .border-slate-700, html[data-panel-theme="dark"] .post, html[data-panel-theme="dark"] .dialog { border-color:#223047 !important; }

            .panel-sidebar-toggle { position:absolute; top:18px; right:-14px; z-index:70; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border:1px solid #334155; border-radius:999px; background:#0f172a; color:#cbd5e1; cursor:pointer; box-shadow:0 6px 18px rgba(0,0,0,.3); }
            .panel-sidebar-toggle:hover { background:#1e293b; color:#fff; }
            #panel-mobile-backdrop { display:none; position:fixed; inset:0; z-index:4000; background:rgba(2,6,23,.78); backdrop-filter:blur(3px); }
            #panel-mobile-menu { position:fixed; inset:0 auto 0 0; z-index:4001; width:min(288px,86vw); background:#0f172a; border-right:1px solid #1e293b; transform:translateX(-102%); transition:transform .2s ease; box-shadow:16px 0 40px rgba(0,0,0,.45); overflow:auto; }
            #panel-mobile-menu.is-open { transform:translateX(0); }
            #panel-mobile-menu .panel-mobile-top { height:64px; padding:0 18px; border-bottom:1px solid #1e293b; display:flex; align-items:center; justify-content:space-between; }
            #panel-mobile-menu .panel-mobile-nav { padding:16px; }
            .panel-mobile-toggle { display:none; position:relative; z-index:40; width:40px; height:40px; flex:none; align-items:center; justify-content:center; border:1px solid #334155; border-radius:12px; background:#020617; color:#e2e8f0; font-size:18px; cursor:pointer; }
            .panel-action-bar { display:flex; align-items:center; justify-content:flex-end; gap:12px; flex-wrap:wrap; padding:12px max(16px, calc((100vw - 1280px) / 2)); border-bottom:1px solid #1e293b; background:rgba(15,23,42,.72); }
            .panel-action-bar > div { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
            .panel-bottom-save-bar { position:sticky; bottom:0; z-index:30; display:flex; justify-content:flex-end; padding:14px 16px; border-top:1px solid #1e293b; background:rgba(15,23,42,.96); backdrop-filter:blur(10px); }
            #panel-save-reminder { position:fixed; right:16px; bottom:94px; z-index:100; max-width:min(360px, calc(100vw - 32px)); padding:12px 14px; border:1px solid rgba(251,191,36,.4); border-radius:14px; background:#3b2f09; color:#fef3c7; font-size:12px; box-shadow:0 14px 35px rgba(0,0,0,.35); }
            main table { max-width:100%; }
            main :is(input,select,textarea,button,a) { touch-action:manipulation; }
            main :is(input,select,textarea) { max-width:100%; }
            main :is(.modal,.dialog,[role="dialog"]) { max-width:100vw; }
            @media (max-width:767px) {
                body { min-height:100dvh; }
                body.panel-shared-sidebar-page { padding-left:0; }
                .panel-responsive-sidebar { display:none !important; }
                .panel-sidebar-toggle { display:none !important; }
                .panel-mobile-toggle { display:flex; }
                header { min-height:88px !important; padding:12px 14px !important; display:flex !important; flex-wrap:wrap !important; align-content:center; }
                header > div:not(.panel-header-tools) { flex:1; min-width:calc(100% - 58px); }
                header h1,header h2 { font-size:1.08rem !important; }
                .panel-global-header { min-height:76px !important; padding:12px 14px !important; }
                .panel-header-tools { position:static; order:20; width:100%; gap:10px; pointer-events:auto; inset:auto; }
                .panel-header-tools .panel-search-host { position:static; transform:none; width:calc(100% - 48px); }
                header:has(.panel-header-tools) { padding-right:14px !important; }
                #app { grid-template-columns:1fr !important; grid-template-rows:auto 1fr !important; width:100% !important; }
                #app:has(#map-container-wrapper) { grid-template-rows:auto minmax(0,1fr) !important; }
                #app > header, #app > #map-container-wrapper { grid-column:1 !important; }
                .panel-action-bar { justify-content:stretch; padding:12px 16px; }
                .panel-action-bar > div, .panel-action-bar button { width:100%; }
                main { width:100% !important; max-width:100vw !important; margin-left:0 !important; overflow-x:hidden; }
                main > :is(.p-8,.p-6,.p-5) { padding:14px !important; }
                main :is(.grid-cols-2,.grid-cols-3,.grid-cols-4,.grid-cols-5,.grid-cols-6) { grid-template-columns:minmax(0,1fr) !important; }
                main :is(.md\\:grid-cols-2,.md\\:grid-cols-3,.lg\\:grid-cols-2,.lg\\:grid-cols-3,.lg\\:grid-cols-4) { grid-template-columns:minmax(0,1fr) !important; }
                main :is(.flex) { min-width:0; }
                main :is(input,select,textarea) { width:100%; font-size:16px !important; }
                main button,main a[class*="px-"] { min-height:42px; }
                main table { display:block; width:100%; overflow-x:auto; overscroll-behavior-x:contain; -webkit-overflow-scrolling:touch; }
                main th,main td { white-space:nowrap; }
                main :is(.rounded-2xl,.rounded-xl,.card,.panel,.post) { max-width:100%; }
                main :is(.modal,.fixed.inset-0) { padding:10px !important; }
                main :is(.dialog,[role="dialog"],.modal-content) { width:100% !important; max-height:calc(100dvh - 20px) !important; overflow:auto; border-radius:16px !important; }
                footer { padding-left:12px !important; padding-right:12px !important; padding-bottom:max(18px,env(safe-area-inset-bottom)) !important; }
                #panel-save-reminder { right:10px; bottom:82px; max-width:calc(100vw - 20px); }
            }
            @media (min-width:768px) and (max-width:1100px) { .panel-header-tools .panel-search-host { width:min(460px,42vw); } }
        `;
        document.head.appendChild(style);
    }

    function setup() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        addStyles();
        ensureBrandAssets();
        ensureGlobalFooter();
        setupAssistantWidget(currentPage);
        const shared = ensureSharedSidebar();
        const navigation = shared.navigation;
        const sidebar = navigation?.closest('aside');
        if (!navigation || !sidebar) return;
        ensureBrandLogo(sidebar);

        ensureCommunityLink(navigation, currentPage);
        normalizeNavigation(navigation, currentPage);
        if (typeof applyRoleBasedVisibility === 'function' && typeof getRole === 'function') {
            applyRoleBasedVisibility(getRole());
        }
        ensureSidebarLogout(sidebar);
        ensureThemeToggle(sidebar);

        normalizePageHeader(currentPage);
        sidebar.classList.add('panel-responsive-sidebar');
        relocateHeaderActions(currentPage);
        setupAdminSaveArea();
        const main = document.querySelector('main');
        if (main) main.style.minHeight = '100vh';
        const originalMainMargin = main?.style.marginLeft || '';
        const originalSidebarWidth = sidebar.style.width || '';

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'panel-sidebar-toggle';
        toggle.setAttribute('aria-label', 'Micșorează meniul');
        sidebar.appendChild(toggle);

        const applyCollapsedState = (collapsed) => {
            sidebar.style.width = collapsed ? '5.25rem' : originalSidebarWidth;
            if (main?.classList.contains('ml-72')) main.style.marginLeft = collapsed ? '5.25rem' : originalMainMargin;
            const mapApp = document.getElementById('app');
            if (mapApp && document.getElementById('map-container-wrapper')) {
                mapApp.style.gridTemplateColumns = collapsed ? '5.25rem 1fr' : '288px 1fr';
            }

            navigation.querySelectorAll('a').forEach((link) => {
                const label = link.querySelector('span:nth-child(2)');
                if (label) label.classList.toggle('hidden', collapsed);
                link.classList.toggle('justify-center', collapsed);
                link.classList.toggle('px-3', collapsed);
                link.classList.toggle('space-x-3', !collapsed);
                link.title = collapsed ? (label?.textContent || '').trim() : '';
            });
            const title = sidebar.querySelector('h1');
            if (title) title.classList.toggle('hidden', collapsed);
            sidebar.querySelectorAll('#user-display-name, #user-role').forEach((element) => element.classList.toggle('hidden', collapsed));
            toggle.textContent = collapsed ? '›' : '‹';
            toggle.setAttribute('aria-label', collapsed ? 'Extinde meniul' : 'Micșorează meniul');
        };

        const savedState = localStorage.getItem(COLLAPSE_KEY) === 'true';
        applyCollapsedState(savedState);
        toggle.addEventListener('click', () => {
            const nextState = !sidebar.querySelector('.nav-link span:nth-child(2)')?.classList.contains('hidden');
            localStorage.setItem(COLLAPSE_KEY, String(nextState));
            applyCollapsedState(nextState);
        });

        // Dashboard are deja propriul meniu mobil, păstrat pentru compatibilitate.
        if (document.getElementById('mobile-menu')) return;

        const backdrop = document.createElement('div');
        backdrop.id = 'panel-mobile-backdrop';
        const mobileMenu = document.createElement('aside');
        mobileMenu.id = 'panel-mobile-menu';
        mobileMenu.innerHTML = `<div class="panel-mobile-top"><div><strong class="text-slate-100">Panel</strong><p class="text-[10px] text-slate-400">Meniu navigare</p></div><button type="button" class="w-9 h-9 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-lg" aria-label="Închide meniul">×</button></div><nav class="panel-mobile-nav space-y-1.5"></nav>`;
        document.body.append(backdrop, mobileMenu);

        const mobileNav = mobileMenu.querySelector('.panel-mobile-nav');
        mobileNav.innerHTML = navigation.innerHTML;
        if (typeof applyRoleBasedVisibility === 'function' && typeof getRole === 'function') applyRoleBasedVisibility(getRole());

        const closeMobileMenu = () => {
            mobileMenu.classList.remove('is-open');
            backdrop.style.display = 'none';
        };
        const openMobileMenu = () => {
            document.dispatchEvent(new CustomEvent('panel:mobile-menu-open'));
            mobileMenu.classList.add('is-open');
            backdrop.style.display = 'block';
        };
        mobileMenu.querySelector('button').addEventListener('click', closeMobileMenu);
        backdrop.addEventListener('click', closeMobileMenu);
        mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));

        const header = document.querySelector('header');
        if (header) {
            const mobileToggle = document.createElement('button');
            mobileToggle.type = 'button';
            mobileToggle.className = 'panel-mobile-toggle';
            mobileToggle.textContent = '☰';
            mobileToggle.setAttribute('aria-label', 'Deschide meniul');
            mobileToggle.addEventListener('click', openMobileMenu);
            header.insertBefore(mobileToggle, header.firstChild);
        }
    }

    function ensureGlobalFooter() {
        if (!document.querySelector('link[href="css/global-footer.css"]')) { const link=document.createElement('link');link.rel='stylesheet';link.href='css/global-footer.css';document.head.appendChild(link); }
        if (!document.querySelector('script[src="js/global-footer.js"]')) { const script=document.createElement('script');script.src='js/global-footer.js';script.defer=true;document.head.appendChild(script); }
    }

    function ensureBrandAssets() {
        if (!document.querySelector('link[rel~="icon"]')) { const icon=document.createElement('link');icon.rel='icon';icon.href='img/favicon.ico';document.head.appendChild(icon); }
        if (!document.querySelector('link[rel="apple-touch-icon"]')) { const touch=document.createElement('link');touch.rel='apple-touch-icon';touch.href='img/logo-180.png';document.head.appendChild(touch); }
    }

    function ensureBrandLogo(sidebar) {
        const heading=sidebar.querySelector('h1');
        if(!heading||heading.querySelector('.panel-brand-logo'))return;
        heading.classList.add('panel-brand-heading');
        const content=document.createElement('span');content.className='min-w-0';while(heading.firstChild)content.appendChild(heading.firstChild);
        const logo=document.createElement('img');logo.className='panel-brand-logo';logo.src='img/logo-192.png';logo.alt='Logo Panel';heading.append(logo,content);
    }

    function ensureSharedSidebar() {
        let navigation=document.getElementById('sidebar-nav')||document.querySelector('aside nav');
        if (navigation) return {navigation};
        const user=typeof getUser==='function'?getUser():null,sidebar=document.createElement('aside');sidebar.id='panel-shared-sidebar';sidebar.className='panel-responsive-sidebar bg-slate-900 border-r border-slate-800 flex flex-col justify-between';sidebar.innerHTML=`<div class="p-6 overflow-y-auto"><h1 class="text-xl font-bold">${window.getActiveOrganization?.()?.name||'Panel'}<span class="block text-xs font-normal text-slate-400">Platformă multi-organizație</span></h1><nav id="sidebar-nav" class="mt-6 space-y-1.5"></nav></div><div class="p-4 border-t border-slate-800 flex items-center justify-between gap-2"><div class="flex items-center gap-3 min-w-0"><img id="user-avatar" class="w-9 h-9 rounded-full border border-slate-700 object-cover" src="${user?.avatar||user?.avatar_url||''}" alt=""><div class="min-w-0"><p id="user-display-name" class="font-semibold truncate">${user?.display_name||user?.username||'Utilizator'}</p><p id="user-role" class="text-xs text-emerald-400 truncate">${user?.role||'Rol Discord'}</p></div></div><button type="button" data-shared-logout class="text-xs text-rose-400">Logout</button></div>`;document.body.prepend(sidebar);document.body.classList.add('panel-shared-sidebar-page');navigation=sidebar.querySelector('nav');return {navigation};
    }

    function normalizePageHeader(currentPage) {
        const main = document.querySelector('main');
        if (!main) return;
        let header = main.querySelector(':scope > header') || document.querySelector('body > header');

        if (currentPage === 'anunturi.html') {
            if (!header) {
                header = document.createElement('header');
                header.innerHTML = '<div class="panel-global-title"><h2>📣 Anunțuri & Sondaje</h2><p>Comunicare pentru Familie și Mecanici.</p></div>';
                main.prepend(header);
            }
            header.className = 'panel-global-header';
            const hero = main.querySelector('.community-hero');
            hero?.querySelector(':scope > div')?.remove();
            hero?.classList.add('community-toolbar');
            return;
        }

        if (currentPage === 'calculatorilegal.html') {
            if (!header) return;
            header.className = 'panel-global-header';
            const search = header.querySelector('.search-container');
            header.innerHTML = '<div class="panel-global-title"><h2>🧮 Calculator Ilegal</h2><p>Calcul pentru arme, muniție și plicuri.</p></div>';
            if (search) header.appendChild(search);
            return;
        }

        if (currentPage === 'craftmecanics.html') {
            if (!header) return;
            header.className = 'panel-global-header';
            header.innerHTML = '<div class="panel-global-title"><h2>🔨 Craft Mechanics</h2><p>Galerie capturi, rețete și echipamente.</p></div>';
            return;
        }

        if (header) {
            header.classList.add('panel-global-header');
            const titleBlock=[...header.children].find(child=>child.querySelector?.('h1,h2')||child.matches?.('h1,h2'));
            const extras=[...header.children].filter(child=>child!==titleBlock&&!child.classList.contains('panel-header-tools')&&!child.querySelector?.('input[type="search"]'));
            if(extras.length){let bar=main.querySelector(':scope > .panel-page-details');if(!bar){bar=document.createElement('section');bar.className='panel-page-details panel-action-bar';if(header.parentElement===main)header.after(bar);else main.prepend(bar)}extras.forEach(extra=>bar.appendChild(extra));}
        }
    }

    function loadAssistantScript(id, source, ready) {
        if (ready()) return Promise.resolve();
        const existing = document.getElementById(id);
        if (existing) {
            return new Promise((resolve, reject) => {
                existing.addEventListener('load', resolve, { once: true });
                existing.addEventListener('error', reject, { once: true });
            });
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.id = id;
            script.src = source;
            script.onload = resolve;
            script.onerror = () => {
                script.remove();
                reject(new Error(`Nu s-a putut încărca ${source}`));
            };
            document.head.appendChild(script);
        });
    }

    function ensureCommunityLink(navigation, currentPage) {
        if (navigation.querySelector('a[href="anunturi.html"]')) return;
        const link = document.createElement('a');
        link.href = 'anunturi.html';
        link.dataset.role = '1';
        link.className = 'nav-link flex items-center space-x-3 px-4 py-3 rounded-xl transition text-sm';
        link.classList.add(...(currentPage === 'anunturi.html'
            ? ['bg-emerald-500/10', 'text-emerald-400', 'font-medium']
            : ['text-slate-300', 'hover:bg-slate-800']));
        link.innerHTML = '<span>📣</span><span>Anunțuri & Sondaje</span>';
        const marketplace = navigation.querySelector('a[href="marketplace.html"]');
        navigation.insertBefore(link, marketplace || null);
    }

    function normalizeNavigation(navigation, currentPage) {
        const links = [
            ['index.html', 1, '📊', 'Dashboard'],
            ['anunturi.html', 1, '📣', 'Anunțuri & Sondaje'],
            ['pontaj.html', 1, '⏱️', 'Pontaj'],
            ['cereri.html', 1, '📋', 'Cereri / Absențe'],
            ['contracte.html', 4, '📜', 'Contracte'],
            ['calculatorilegal.html', 3, '🧮', 'Calculator Ilegal'],
            ['craftmecanics.html', 1, '🔨', 'Craft Mecanics'],
            ['locatiiilegale.html', 3, '🗺️', 'Locații Ilegale'],
            ['marketplace.html', 1, '🛒', 'Marketplace'],
            ['marketplace-ilegal.html', 3, '🚨', 'Black Market'],
            ['rapoarte.html', 4, '📈', 'Rapoarte'],
            ['logs.html', 7, '🧾', 'Loguri'],
            ['diagnostic.html', 7, '🩺', 'Verificare sistem'],
            ['discord-configurare.html', 7, '⚙️', 'Configurare Discord'],
            ['organizatii.html', 7, '🏢', 'Organizații platformă'],
            ['developer.html', 7, '🛠️', 'Developer'],
            ['admin.html', 7, '👑', 'Panou Admin']
        ];

        navigation.innerHTML = links.filter(([href]) => href !== 'edit.html').map(([href, role, icon, label]) => {
            const active = currentPage === href;
            const stateClasses = active
                ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                : 'text-slate-300 hover:bg-slate-800';
            return `<a href="${href}" data-role="${role}" class="nav-link flex items-center space-x-3 px-4 py-3 rounded-xl transition text-sm ${stateClasses}"><span>${icon}</span><span>${label}</span></a>`;
        }).join('');

        if (typeof isPlatformAdmin === 'function' && isPlatformAdmin()) {
            navigation.querySelectorAll('a.nav-link').forEach((link) => { link.style.display = ''; });
        }

        const existingMobileNavigation = document.querySelector('#mobile-menu nav');
        if (existingMobileNavigation) existingMobileNavigation.innerHTML = navigation.innerHTML;
    }

    function ensureSidebarLogout(sidebar) {
        const existingLogout = [...sidebar.querySelectorAll('button')].find((button) => {
            const action = `${button.id} ${button.getAttribute('onclick') || ''} ${button.textContent || ''}`.toLocaleLowerCase('ro-RO');
            return action.includes('logout') || action.includes('ieșire') || action.includes('iesire');
        });
        if (existingLogout) {
            const cleanButton = existingLogout.cloneNode(true);
            cleanButton.removeAttribute('onclick');
            const label = cleanButton.querySelector('span:last-child');
            if (label) label.textContent = 'Logout'; else cleanButton.textContent = 'Logout';
            cleanButton.addEventListener('click', (event) => { event.preventDefault(); event.stopImmediatePropagation(); if (typeof logout === 'function') logout(); else { localStorage.clear(); sessionStorage.clear(); location.replace('login.html'); } });
            existingLogout.replaceWith(cleanButton);
            return;
        }

        const avatar = sidebar.querySelector('#user-avatar');
        if (!avatar) return;
        let footer = avatar.parentElement;
        while (footer?.parentElement && footer.parentElement !== sidebar) footer = footer.parentElement;
        if (!footer) return;

        footer.classList.add('flex', 'items-center', 'justify-between', 'gap-3');
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Logout';
        button.className = 'flex-shrink-0 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition cursor-pointer text-xs font-medium';
        button.addEventListener('click', () => {
            if (typeof logout === 'function') logout();
            else if (typeof handleLogout === 'function') handleLogout();
            else {
                localStorage.clear();
                location.href = 'login.html';
            }
        });
        footer.appendChild(button);
    }

    function ensureThemeToggle(sidebar) {
        const avatar = sidebar.querySelector('#user-avatar');
        if (!avatar) return;
        let footer = avatar.parentElement;
        while (footer?.parentElement && footer.parentElement !== sidebar) footer = footer.parentElement;
        if (!footer) return;

        const modes = ['panel', 'dark'];
        const icons = { panel: '🎨', dark: '🌙' };
        const labels = { panel: 'Tema Panel (originală)', dark: 'Tema Dark' };
        const apply = (mode) => {
            document.documentElement.dataset.panelTheme = mode;
            // Unele pagini vechi își citesc culorile din data-theme; Panel folosește paleta lor originală întunecată.
            document.documentElement.dataset.theme = 'dark';
            document.documentElement.classList.add('dark');
            const button = document.getElementById('panel-theme-toggle');
            if (button) {
                button.textContent = icons[mode];
                button.title = labels[mode];
                button.setAttribute('aria-label', `${labels[mode]}. Apasă pentru tema următoare.`);
            }
        };

        let mode = localStorage.getItem('panel_theme') || 'panel';
        if (mode === 'system' || mode === 'light' || !modes.includes(mode)) {
            mode = 'panel';
            localStorage.setItem('panel_theme', mode);
        }
        const legacyButton = document.getElementById('theme-toggle-btn');
        const button = legacyButton || document.createElement('button');
        if (legacyButton) legacyButton.removeAttribute('onclick');
        button.id = 'panel-theme-toggle';
        button.type = 'button';
        button.setAttribute('aria-label', 'Schimbă tema');
        button.addEventListener('click', () => {
            mode = modes[(modes.indexOf(mode) + 1) % modes.length];
            localStorage.setItem('panel_theme', mode);
            apply(mode);
        });
        if (!legacyButton) {
            const logoutButton = [...footer.querySelectorAll('button')].find((item) => item !== button && /logout|ieșire|iesire/i.test(item.textContent || ''));
            let reference = logoutButton || null;
            while (reference?.parentElement && reference.parentElement !== footer) reference = reference.parentElement;
            footer.insertBefore(button, reference);
        }
        apply(mode);
    }

    async function setupAssistantWidget(currentPage) {
        const allowedPages = new Set([
            'index.html', 'pontaj.html', 'cereri.html', 'rapoarte.html', 'contracte.html', 'admin.html',
            'calculatorilegal.html', 'craftmecanics.html', 'locatiiilegale.html', 'marketplace.html',
            'marketplace-ilegal.html', 'logs.html', 'diagnostic.html', 'organizatii.html'
        ]);
        if (!allowedPages.has(currentPage) || document.getElementById('panel-assistant-widget')) return;
        try {
            if (typeof isLogged !== 'function' || !isLogged()) return;
            await loadAssistantScript('panel-assistant-data-script', 'js/asistent-data.js', () => Array.isArray(window.PANEL_ASSISTANT_KNOWLEDGE));
            await loadAssistantScript('panel-assistant-core-script', 'js/asistent-core.js', () => Boolean(window.PanelAssistantCore));
            await loadAssistantScript('panel-assistant-widget-script', 'js/asistent-widget.js', () => Boolean(window.__panelAssistantWidgetLoaded));
        } catch (error) {
            console.warn('Asistentul plutitor nu a putut fi inițializat.', error);
        }
    }

    function createGlobalPageSearch(header, currentPage) {
        const wrapper = document.createElement('div');
        wrapper.className = 'search-container';
        const input = document.createElement('input');
        input.type = 'search';
        input.id = 'global-search';
        input.className = 'panel-global-search';
        const title = header.querySelector('h1,h2')?.textContent?.trim() || 'pagină';
        input.placeholder = `Caută în ${title}...`;
        input.setAttribute('aria-label', `Caută în ${title}`);
        input.addEventListener('input', () => runGlobalPageSearch(input.value));
        input.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                input.value = '';
                runGlobalPageSearch('');
                input.blur();
            }
        });
        wrapper.appendChild(input);
        header.appendChild(wrapper);
        return input;
    }

    function runGlobalPageSearch(value) {
        const query = String(value || '').trim().toLocaleLowerCase('ro');
        const main = document.querySelector('main');
        if (!main) return;

        const selectorGroups = [
            '.gallery-card',
            'tbody tr',
            '.community-post, .announcement-card, .post',
            '.marketplace-card, .listing-card',
            '[data-searchable]'
        ];
        let items = [];
        for (const selector of selectorGroups) {
            items = Array.from(main.querySelectorAll(selector)).filter(item => !item.closest('header,footer,[role="dialog"]'));
            if (items.length) break;
        }

        if (!items.length) {
            main.querySelectorAll('.panel-global-search-match').forEach(item => item.classList.remove('panel-global-search-match'));
            if (!query) return;
            const match = Array.from(main.querySelectorAll('h1,h2,h3,h4,a,button,label'))
                .find(item => item.textContent.toLocaleLowerCase('ro').includes(query));
            if (match) {
                match.classList.add('panel-global-search-match');
                match.scrollIntoView({ behavior:'smooth', block:'center' });
            }
            return;
        }

        items.forEach(item => {
            const visible = !query || item.textContent.toLocaleLowerCase('ro').includes(query);
            item.style.display = visible ? '' : 'none';
        });
    }

    function relocateHeaderActions(currentPage) {
        const header = document.querySelector('header');
        const themeButton = document.getElementById('panel-theme-toggle');
        if (!header || !themeButton || document.querySelector('.panel-header-tools')) return;

        const tools = document.createElement('div');
        tools.className = 'panel-header-tools';
        const search = document.getElementById('global-search')
            || header.querySelector('.search-container input, input[type="search"], input[placeholder*="Caută"], input[placeholder*="caută"]')
            || createGlobalPageSearch(header, currentPage);
        if (search) {
            search.classList.add('panel-global-search');
            const originalWrapper = search.closest('.search-container, .relative') || search.parentElement;
            if (originalWrapper) {
                const searchHost = document.createElement('div');
                searchHost.className = 'panel-search-host';
                searchHost.appendChild(originalWrapper);
                tools.appendChild(searchHost);
            }
        }
        tools.appendChild(themeButton);
        header.appendChild(tools);
    }

    function setupAdminSaveArea() {
        const saveButton = document.querySelector('button[onclick="saveAllAdminSettings()"]');
        const main = document.querySelector('main');
        if (!saveButton || !main || document.getElementById('panel-admin-save-area')) return;

        const saveArea = document.createElement('div');
        saveArea.id = 'panel-admin-save-area';
        saveArea.className = 'panel-bottom-save-bar';
        main.appendChild(saveArea);
        saveArea.appendChild(saveButton);
        document.getElementById('panel-page-actions')?.remove();

        let dirty = false;
        const showReminder = () => {
            if (dirty) return;
            dirty = true;
            const reminder = document.createElement('div');
            reminder.id = 'panel-save-reminder';
            reminder.textContent = 'Ai modificări nesalvate. Apasă „Salvează Toate Setările” din partea de jos a paginii.';
            document.body.appendChild(reminder);
        };
        const clearReminder = () => {
            dirty = false;
            document.getElementById('panel-save-reminder')?.remove();
        };

        main.addEventListener('change', (event) => {
            const element = event.target;
            if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement)) return;
            if (element.id.startsWith('search-') || element.id.startsWith('filter-') || element.id.startsWith('role-select-')) return;
            showReminder();
        });

        const originalSave = window.saveAllAdminSettings;
        if (typeof originalSave === 'function') {
            window.saveAllAdminSettings = async (...args) => {
                const result = await originalSave(...args);
                clearReminder();
                return result;
            };
        }
    }

    function loadOperationsCenter() {
        if (document.getElementById('panel-operations-script')) return;
        const script = document.createElement('script');
        script.id = 'panel-operations-script';
        script.src = 'js/panel-operations.js';
        script.defer = true;
        document.head.appendChild(script);
    }

    loadOperationsCenter();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
    else setup();
})();

// Selector multi-organizație. Este afișat numai după o autentificare validă.
document.addEventListener('DOMContentLoaded', () => {
    let organizations = [];
    try { organizations = JSON.parse(localStorage.getItem('panel_organizations') || '[]'); } catch (_) {}
    const active = window.getActiveOrganization?.();
    const header = document.querySelector('header');
    if (!active || !header || header.querySelector('[data-organization-switcher]')) return;
    document.title = `${document.title.split(' · ')[0]} · ${active.name}`;
    const sidebarTitle = document.querySelector('aside h1');
    if (sidebarTitle) sidebarTitle.innerHTML = `${String(active.name).replace(/[&<>"']/g, '')}<span class="block text-xs font-normal text-slate-400">Platformă multi-organizație</span>`;
    const wrapper = document.createElement('div');
    wrapper.dataset.organizationSwitcher = 'true';
    wrapper.style.cssText = 'margin-left:auto;display:flex;align-items:center;gap:8px;padding-left:12px';
    if (organizations.length > 1) {
        const select = document.createElement('select');
        select.setAttribute('aria-label', 'Organizația activă');
        select.style.cssText = 'max-width:220px;background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:10px;padding:8px 10px;font-size:12px;font-weight:700';
        organizations.forEach((organization) => {
            const option = document.createElement('option');
            option.value = organization.id;
            option.textContent = `${organization.name} · ${organization.panel_role}`;
            option.selected = organization.id === active.id;
            select.appendChild(option);
        });
        select.addEventListener('change', async () => {
            select.disabled = true;
            try {
                const config = window.PANEL_SUPABASE_CONFIG;
                const response = await fetch(`${config.url}/functions/v1/sync-discord-role`, {
                    method:'POST', headers:{'Content-Type':'application/json',apikey:config.publishableKey,Authorization:`Bearer ${config.publishableKey}`},
                    body:JSON.stringify({access_token:localStorage.getItem('discord_access_token'),organization_id:select.value})
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Organizația nu poate fi activată.');
                localStorage.setItem('discord_user', JSON.stringify(result.user));
                localStorage.setItem('user_role', result.user.role);
                localStorage.setItem('panel_session_token', result.session_token);
                localStorage.setItem('panel_session_expires_at', result.expires_at);
                localStorage.setItem('panel_active_organization', JSON.stringify(result.active_organization));
                localStorage.setItem('panel_organizations', JSON.stringify(result.organizations || []));
                location.reload();
            } catch (error) {
                alert(error instanceof Error ? error.message : 'Schimbarea organizației a eșuat.');
                select.disabled = false; select.value = active.id;
            }
        });
        wrapper.appendChild(select);
    } else {
        const badge = document.createElement('span');
        badge.textContent = active.name;
        badge.style.cssText = 'color:#a7f3d0;border:1px solid #065f46;background:#064e3b55;border-radius:999px;padding:6px 10px;font-size:11px;font-weight:800';
        wrapper.appendChild(badge);
    }
    header.appendChild(wrapper);
});
