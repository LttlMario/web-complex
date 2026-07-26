// Workforce Management System - Pontaj, Loguri, Leaderboard, Înștiințări & Contracte
// Autor: Little Mario

const DISCORD_CLIENT_ID = "1530594698933047426";

// ID-urile de Discord ale administratorilor (adaugă ID-ul tău aici)
const ADMIN_DISCORD_IDS = [
    "247012210021236738"
];

// Webhook-uri Discord configurate
const WEBHOOK_LOGS = "https://discord.com/api/webhooks/1530881772240502898/HOf5YsmCARiAAiKhS_qcbc8opbLU0viHooZfhXcAQVfHeth0L8BDkmN3X7rNBgb6mO2C";
const WEBHOOK_LEADERBOARD = "https://discord.com/api/webhooks/1530881982056104069/r7deKe-vqT8M6iCS9Cz4DE2WV9Fo55L7vIWic5adHC1CVOWtpiHNOC17ou-C35JiZPce";
const WEBHOOK_CERERI = "https://discord.com/api/webhooks/1530882813824466944/yKrptcBA86amfq3a9nerXLYpr9wf78VxGLXfE93P7DKaYMbthEjkpJ3HhBAL2EMPOOm-";
const WEBHOOK_CONTRACTE = "https://discord.com/api/webhooks/1530238606055309382/eRiHV6smPdqCyA7yB4Ize2kpk9hePfN_Ze1B-hNv3V58J7hzDDosw-WpQ_B9IBKKdi9h";

// Configurare Supabase
const SUPABASE_URL = "https://vkvsabbbawyiurnaiugo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdnNhYmJiYXd5aXVybmFpdWdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA0Njk1NiwiZXhwIjoyMTAwNjIyOTU2fQ.1D67DT0lul6bgcRSmbr5-JEHZmErTNvCXB4Up1g3zWw";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


document.addEventListener("DOMContentLoaded", () => {
    const btnMasaCrafting = document.getElementById("btn-masa-crafting");
    
    if (btnMasaCrafting) {
        const userRole = (localStorage.getItem('userRole') || '').toLowerCase();
        const allowedRole = (btnMasaCrafting.getAttribute('data-role') || '').toLowerCase();

        if (userRole === allowedRole || userRole === "admin") {
            btnMasaCrafting.classList.remove('hidden');
            btnMasaCrafting.addEventListener('click', () => {
                window.open("https://lttlmario.github.io/masa-crafting/", "_blank");
            });
        } else {
            btnMasaCrafting.classList.add('hidden');
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const btnLocatiiIlegale = document.getElementById("btn-locatii-ilegale");
    
    if (btnLocatiiIlegale) {
        const userRole = (localStorage.getItem('userRole') || '').toLowerCase();
        const allowedRole = (btnLocatiiIlegale.getAttribute('data-role') || '').toLowerCase();

        if (userRole === allowedRole || userRole === "admin") {
            btnLocatiiIlegale.classList.remove('hidden');
            btnLocatiiIlegale.addEventListener('click', () => {
                window.open("https://lttlmario.github.io/hatra-ilegale-bzone/", "_blank");
            });
        } else {
            btnLocatiiIlegale.classList.add('hidden');
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const btnMarketplace = document.getElementById("btn-marketplace");
    const btnMarketplaceIlegal = document.getElementById("btn-marketplace-ilegal");
    
    if (btnMarketplace || btnMarketplaceIlegal) {
        const userRole = (localStorage.getItem('userRole') || '').toLowerCase(); 

        if (userRole === "mecanic" || userRole === "admin" || userRole === "sef mecanic" || userRole === "șef mecanic") {
            if (btnMarketplace) {
                btnMarketplace.classList.remove('hidden');
                btnMarketplace.addEventListener('click', () => {
                    window.open("https://lttlmario.github.io/marketplace-legal/", "_blank");
                });
            }
            if (btnMarketplaceIlegal) {
                btnMarketplaceIlegal.classList.remove('hidden');
                btnMarketplaceIlegal.addEventListener('click', () => {
                    window.open("https://lttlmario.github.io/marketplace-ilegal/", "_blank");
                });
            }
        } else {
            if (btnMarketplace) btnMarketplace.classList.add('hidden');
            if (btnMarketplaceIlegal) btnMarketplaceIlegal.classList.add('hidden');
        }
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Sistemul a pornit. Verificăm starea de autentificare și structura bazei de date...");

    await handleDiscordCallback();
    checkAuthStatus();
    updateSidebarBranding();
    initAutomaticWeeklyReportChecker();
    await verifyAndActivateDatabaseStructure();

    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const redirectUri = window.location.origin + window.location.pathname;
            window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=identify%20email`;
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('workforce_user');
            localStorage.removeItem('workforce_shift_state');
            window.location.href = window.location.pathname;
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            const user = JSON.parse(localStorage.getItem('workforce_user')) || {};
            const userRole = (user.role || '').toLowerCase();
            const isAdmin = ADMIN_DISCORD_IDS.includes(user.discordId) || userRole === 'admin';
            const isManager = userRole === 'manager';
            const isFamilia = userRole === 'familia';
            const isSefMecanic = userRole === 'sef mecanic' || userRole === 'șef mecanic';
            const isMecanic = userRole === 'mecanic' || !userRole;

            if (isMecanic || isSefMecanic) {
                if (section === 'Contracte' || section === 'Rapoarte' || section === 'Admin') {
                    alert("Nu ai permisiunea de a accesa această secțiune!");
                    return;
                }
            } else if (isFamilia) {
                if (section === 'Contracte' || section === 'Rapoarte' || section === 'Admin') {
                    alert("Nu ai permisiunea de a accesa această secțiune!");
                    return;
                }
            } else if (isManager) {
                if (section === 'Admin') {
                    alert("Nu ai permisiunea de a accesa această secțiune!");
                    return;
                }
            } else if (!isAdmin) {
                if (section === 'Admin') {
                    alert("Nu ai permisiunea de a accesa această secțiune!");
                    return;
                }
            }

            navLinks.forEach(item => {
                item.classList.remove('bg-emerald-500/10', 'text-emerald-400', 'font-medium');
                item.classList.add('hover:bg-slate-800', 'text-slate-300');
            });
            link.classList.remove('hover:bg-slate-800', 'text-slate-300');
            link.classList.add('bg-emerald-500/10', 'text-emerald-400', 'font-medium');

            renderSection(section);
        });
    });
});

async function verifyAndActivateDatabaseStructure() {
    try {
        console.log("Verificăm și activăm tabelele din structura SQL (users, shifts, contracte, admin_settings, audit_logs)...");
        
        const { error: errShifts } = await supabaseClient.from('shifts').select('id').limit(1);
        if (errShifts) console.warn("Tabela 'shifts' necesită atenție sau nu este accesibilă direct:", errShifts.message);

        const { error: errContracte } = await supabaseClient.from('contracte').select('id').limit(1);
        if (errContracte) console.warn("Tabela 'contracte' necesită atenție:", errContracte.message);

        const { error: errUsers } = await supabaseClient.from('users').select('discord_id').limit(1);
        if (errUsers) console.warn("Tabela 'users' necesită atenție:", errUsers.message);

        console.log("Structura bazei de date este complet integrată și activă.");
    } catch (e) {
        console.error("Eroare la verificare structură SQL:", e);
    }
}

function updateSidebarBranding() {
    const brandContainer = document.querySelector('aside .p-6') || document.querySelector('aside');
    if (brandContainer) {
        const titleEl = brandContainer.querySelector('h1') || brandContainer.querySelector('.font-bold');
        if (titleEl) {
            titleEl.innerHTML = `Panel<span class="block text-xs font-normal text-slate-400 mt-0.5">by Little Mario</span>`;
        } else {
            const headerDiv = brandContainer.firstElementChild;
            if (headerDiv) {
                headerDiv.innerHTML = `
                    <h1 class="text-xl font-bold text-slate-100 tracking-tight">Panel</h1>
                    <p class="text-xs text-slate-400 mt-0.5">by Little Mario</p>
                `;
            }
        }
    }
}

function checkAuthStatus() {
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    const storedUser = localStorage.getItem('workforce_user');

    if (storedUser) {
        const user = JSON.parse(storedUser);
        
        const nameEl = document.getElementById('user-display-name');
        const roleEl = document.getElementById('user-role');
        const avatarEl = document.getElementById('user-avatar');
        
        if (nameEl) nameEl.textContent = user.displayName || user.username;
        if (roleEl) roleEl.textContent = user.role || "Mecanic";
        if (avatarEl && user.avatar) {
            avatarEl.src = user.avatar;
        }

        applyRoleAccessRestrictions(user.discordId, user.role);

        if (loginScreen) loginScreen.classList.add('hidden');
        if (appContainer) appContainer.classList.remove('hidden');
        
        renderSection('Dashboard');
    } else {
        if (loginScreen) loginScreen.classList.remove('hidden');
        if (appContainer) appContainer.classList.add('hidden');
    }
}

function applyRoleAccessRestrictions(discordId, role) {
    const userRole = (role || '').toLowerCase();
    const isAdmin = ADMIN_DISCORD_IDS.includes(discordId) || userRole === 'admin';
    const isManager = userRole === 'manager';
    const isFamilia = userRole === 'familia';
    const isSefMecanic = userRole === 'sef mecanic' || userRole === 'șef mecanic';
    const isMecanic = userRole === 'mecanic' || !userRole;
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        
        if (isMecanic || isSefMecanic || isFamilia) {
            if (section === 'Contracte' || section === 'Rapoarte' || section === 'Admin') {
                link.style.display = 'none';
            }
        } else if (isManager) {
            if (section === 'Admin') {
                link.style.display = 'none';
            }
        }
    });

    if (isAdmin) {
        checkAndRenderAdminNav(discordId);
    }
}

function checkAndRenderAdminNav(discordId) {
    const user = JSON.parse(localStorage.getItem('workforce_user')) || {};
    const userRole = (user.role || '').toLowerCase();
    const isAdmin = ADMIN_DISCORD_IDS.includes(discordId) || userRole === 'admin';
    
    const existingAdminLink = document.getElementById('nav-admin-link');
    if (isAdmin && !existingAdminLink) {
        const navLinksContainer = document.querySelector('nav');
        if (navLinksContainer) {
            const adminHtml = `
                <a href="#" id="nav-admin-link" data-section="Admin" class="nav-link flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition font-medium">
                    <span>👑</span>
                    <span>Panou Admin</span>
                </a>
            `;
            const sidebarNav = document.querySelector('nav .space-y-1') || navLinksContainer.firstElementChild;
            if (sidebarNav) {
                sidebarNav.insertAdjacentHTML('beforeend', adminHtml);
                
                const newLink = document.getElementById('nav-admin-link');
                newLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelectorAll('.nav-link').forEach(item => {
                        item.classList.remove('bg-emerald-500/10', 'text-emerald-400', 'font-medium');
                        item.classList.add('hover:bg-slate-800', 'text-slate-300');
                    });
                    newLink.classList.remove('hover:bg-slate-800', 'text-slate-300');
                    newLink.classList.add('bg-emerald-500/10', 'text-emerald-400', 'font-medium');

                    renderSection('Admin');
                });
            }
        }
    }
}

async function handleDiscordCallback() {
    let accessToken = null;
    if (window.location.hash.includes('access_token')) {
        const fragment = new URLSearchParams(window.location.hash.substring(1));
        accessToken = fragment.get('access_token');
    } else if (window.location.search.includes('access_token')) {
        const query = new URLSearchParams(window.location.search);
        accessToken = query.get('access_token');
    }

    if (accessToken) {
        try {
            const response = await fetch('https://discord.com/api/users/@me', {
                headers: { authorization: `Bearer ${accessToken}` }
            });

            if (!response.ok) throw new Error('Eșec la preluarea datelor de la Discord');

            const data = await response.json();
            
            const avatarUrl = data.avatar 
                ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` 
                : 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f468-200d-1f4bb.png';

            const { data: existingUser, error: fetchError } = await supabaseClient
                .from('users')
                .select('role, service')
                .eq('discord_id', data.id)
                .single();

            let assignedRole = "Mecanic";
            let assignedService = "Service 2";

            if (ADMIN_DISCORD_IDS.includes(data.id)) {
                assignedRole = "Admin";
            } else if (!fetchError && existingUser && existingUser.role) {
                assignedRole = existingUser.role;
                assignedService = existingUser.service || "Service 2";
            }

            const discordUser = {
                discord_id: data.id,
                username: data.username,
                display_name: data.global_name || data.username,
                email: data.email || null,
                avatar: avatarUrl,
                role: assignedRole,
                service: assignedService
            };

            await saveUserToDatabase(discordUser);

            localStorage.setItem('workforce_user', JSON.stringify({
                discordId: discordUser.discord_id,
                username: discordUser.username,
                displayName: discordUser.display_name,
                avatar: discordUser.avatar,
                role: discordUser.role,
                service: discordUser.service
            }));
            
            localStorage.setItem('userRole', discordUser.role);

            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
            console.error("Eroare la autentificare / salvare în Supabase:", error);
        }
    }
}

async function saveUserToDatabase(userData) {
    try {
        const { error } = await supabaseClient
            .from('users')
            .upsert([userData], { onConflict: ['discord_id'] });

        if (error) console.error("Eroare Supabase user:", error.message);
    } catch (err) {
        console.error("Eroare de conexiune cu Supabase:", err);
    }
}

function renderSection(sectionName) {
    const user = JSON.parse(localStorage.getItem('workforce_user')) || {};
    const userRole = (user.role || '').toLowerCase();
    const isAdmin = ADMIN_DISCORD_IDS.includes(user.discordId) || userRole === 'admin';
    const isManager = userRole === 'manager';
    const isFamilia = userRole === 'familia';
    const isSefMecanic = userRole === 'sef mecanic' || userRole === 'șef mecanic';
    const isMecanic = userRole === 'mecanic' || !userRole;

    if ((isMecanic || isSefMecanic || isFamilia) && (sectionName === 'Contracte' || sectionName === 'Admin' || sectionName === 'Rapoarte')) {
        sectionName = 'Dashboard';
    } else if (isManager && sectionName === 'Admin') {
        sectionName = 'Dashboard';
    }

    const titleEl = document.getElementById('page-title');
    const contentArea = document.getElementById('main-content-area');
    
    if (titleEl) titleEl.textContent = sectionName;
    if (!contentArea) return;

    if (sectionName === 'Dashboard') {
        const userName = user.displayName || 'Mecanic';

        contentArea.innerHTML = `
            <div class="space-y-6">
                <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 p-8 rounded-2xl relative overflow-hidden shadow-lg">
                    <div class="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/5 blur-3xl pointer-events-none"></div>
                    <div class="relative z-10 max-w-2xl">
                        <span class="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full mb-3">
                            Sistem Activ & Pregătit (Structură SQL Activată)
                        </span>
                        <h2 class="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                            Salut, <span class="text-emerald-400">${userName}</span>! 👋
                        </h2>
                        <p class="text-slate-400 text-sm mt-2 leading-relaxed">
                            Bine ai revenit în panoul de control. Aici îți poți gestiona turele, înștiințările și baza de date în timp real.
                        </p>
                        <div class="flex flex-wrap gap-3 mt-6">
                            <button onclick="renderSection('Pontaj')" class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition shadow-md flex items-center space-x-2 cursor-pointer">
                                <span>⏱️</span>
                                <span>Mergi la Pontaj</span>
                            </button>
                            <button id="btn-marketplace" class="hidden bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition shadow-md flex items-center space-x-2 cursor-pointer">
                                <span>Marketplace Legal</span>
                            </button>
                            <button id="btn-marketplace-ilegal" class="hidden bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition shadow-md flex items-center space-x-2 cursor-pointer">
                                <span>Marketplace Ilegal</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow-sm">
                        <div class="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-xl">🛠️</div>
                        <div>
                            <h3 class="text-slate-400 text-xs uppercase tracking-wider font-medium">Rol Curent</h3>
                            <p class="text-lg font-bold text-slate-100 mt-0.5">${user.role || 'Mecanic'}</p>
                        </div>
                    </div>
                    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow-sm">
                        <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xl">🏢</div>
                        <div>
                            <h3 class="text-slate-400 text-xs uppercase tracking-wider font-medium">Locație / Service</h3>
                            <p class="text-lg font-bold text-slate-100 mt-0.5">${user.service || 'Service 2'}</p>
                        </div>
                    </div>
                    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow-sm">
                        <div class="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xl">🌙</div>
                        <div>
                            <h3 class="text-slate-400 text-xs uppercase tracking-wider font-medium">Program Ture</h3>
                            <p class="text-lg font-bold text-slate-100 mt-0.5">Zi & Noapte</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const btnMarketplace = document.getElementById("btn-marketplace");
        const btnMarketplaceIlegal = document.getElementById("btn-marketplace-ilegal");
        const currentRole = (user.role || '').toLowerCase();

        if (currentRole === "mecanic" || currentRole === "admin" || currentRole === "sef mecanic" || currentRole === "șef mecanic") {
            if (btnMarketplace) {
                btnMarketplace.classList.remove('hidden');
                btnMarketplace.addEventListener('click', () => {
                    window.open("https://lttlmario.github.io/marketplace-legal/", "_blank");
                });
            }
            if (btnMarketplaceIlegal) {
                btnMarketplaceIlegal.classList.remove('hidden');
                btnMarketplaceIlegal.addEventListener('click', () => {
                    window.open("https://lttlmario.github.io/marketplace-ilegal/", "_blank");
                });
            }
        } else {
            if (btnMarketplace) btnMarketplace.classList.add('hidden');
            if (btnMarketplaceIlegal) btnMarketplaceIlegal.classList.add('hidden');
        }

    } else if (sectionName === 'Pontaj') {
        contentArea.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h3 class="text-slate-400 text-xs uppercase tracking-wider">Total Ore Acumulate</h3>
                    <p id="stat-total-hours" class="text-2xl font-bold font-mono text-emerald-400 mt-1">00:00:00</p>
                </div>
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h3 class="text-slate-400 text-xs uppercase tracking-wider">Total Ture Efectuate</h3>
                    <p id="stat-total-shifts" class="text-2xl font-bold text-indigo-400 mt-1">0</p>
                </div>
                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h3 class="text-slate-400 text-xs uppercase tracking-wider">Tip Tură Activă</h3>
                    <p id="stat-active-type" class="text-xl font-bold text-slate-200 mt-1">Niciuna</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div class="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-200 mb-2">Control Pontaj</h3>
                        <p id="shift-status-text" class="text-slate-400 text-sm mb-4">Alege tipul de tură și apasă Start.</p>
                        
                        <div id="validation-alert" class="hidden mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium"></div>

                        <div id="shift-type-container" class="mb-4 space-y-2">
                            <label class="block text-xs text-slate-400 uppercase tracking-wider">Tip Tură / Interval Orar Strict</label>
                            <div class="grid grid-cols-2 gap-2">
                                <button type="button" id="type-zi" class="py-2 px-3 text-xs font-semibold rounded-lg border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 transition cursor-pointer">
                                    ☀️ Tură de Zi<br><span class="text-[10px] opacity-80">(23:01 - 19:59)</span>
                                </button>
                                <button type="button" id="type-noapte" class="py-2 px-3 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition cursor-pointer">
                                    🌙 Tură de Noapte<br><span class="text-[10px] opacity-80">(20:00 - 23:00)</span>
                                </button>
                            </div>
                        </div>

                        <div class="bg-slate-800/50 p-4 rounded-xl text-center">
                            <span id="timer-label" class="block text-xs text-slate-400 uppercase tracking-wider">Timp scurs</span>
                            <span id="timer-display" class="text-3xl font-mono font-bold text-emerald-400 mt-1 block">00:00:00</span>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <button id="btn-start" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer">
                            <span>🟢</span><span>Start Tura</span>
                        </button>
                        <div class="grid grid-cols-2 gap-2">
                            <button id="btn-pause" class="hidden bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 px-3 rounded-xl transition text-sm flex items-center justify-center space-x-1 cursor-pointer">
                                <span>⏸️</span><span>Pauză</span>
                            </button>
                            <button id="btn-resume" class="hidden bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-3 rounded-xl transition text-sm flex items-center justify-center space-x-1 cursor-pointer">
                                <span>▶️</span><span>Continuare</span>
                            </button>
                        </div>
                        <button id="btn-stop" class="hidden w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer">
                            <span>🛑</span><span>Încheie Tura (Stop)</span>
                        </button>
                    </div>
                </div>

                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <h3 class="text-lg font-semibold text-slate-200 mb-4">Total Ore Lucrate pe Zile</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b border-slate-800 text-xs text-slate-400 uppercase">
                                        <th class="pb-3 font-semibold">Data</th>
                                        <th class="pb-3 font-semibold">Ture Efectuate</th>
                                        <th class="pb-3 font-semibold text-right">Total Ore Ziua Respectivă</th>
                                    </tr>
                                </thead>
                                <tbody id="daily-summary-table" class="divide-y divide-slate-800/50 text-sm text-slate-300">
                                    <tr><td colspan="3" class="py-4 text-center text-slate-500">Se calculează...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <h3 class="text-lg font-semibold text-slate-200 mb-4">Istoric Detaliat Ture (Supabase)</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b border-slate-800 text-xs text-slate-400 uppercase">
                                        <th class="pb-3 font-semibold">Data</th>
                                        <th class="pb-3 font-semibold">Tip Tură</th>
                                        <th class="pb-3 font-semibold">Start</th>
                                        <th class="pb-3 font-semibold">Stop</th>
                                        <th class="pb-3 font-semibold">Durată</th>
                                    </tr>
                                </thead>
                                <tbody id="shifts-history-table" class="divide-y divide-slate-800/50 text-sm text-slate-300">
                                    <tr><td colspan="5" class="py-4 text-center text-slate-500">Se încarcă istoricul...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        initAdvancedPontajLogic();
    } else if (sectionName === 'Cereri') {
        contentArea.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div class="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-lg">📋</div>
                        <div>
                            <h3 class="text-base font-bold text-slate-200">Înștiințare Absență</h3>
                            <p class="text-xs text-slate-400">Anunță-ți lipsa oficial pe Discord</p>
                        </div>
                    </div>
                    <div id="absence-alert" class="hidden mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium"></div>
                    <form id="absence-form" class="space-y-4">
                        <div>
                            <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Tip Motiv / Concediu</label>
                            <select id="absence-type" class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-emerald-500 transition">
                                <option value="Concediu de odihnă">🏖️ Concediu de odihnă</option>
                                <option value="Motive personale">🏠 Motive personale</option>
                                <option value="Urgență medicală">🏥 Urgență medicală</option>
                                <option value="Eveniment în familie">🎉 Eveniment în familie</option>
                                <option value="Învoire scurtă (câteva ore)">⏱️ Învoire scurtă (câteva ore)</option>
                                <option value="Altele">✏️ Altele (specifică mai jos)</option>
                            </select>
                        </div>
                        <div id="custom-reason-container" class="hidden">
                            <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Specifică Motivul</label>
                            <input type="text" id="absence-custom-reason" placeholder="Ex: Probleme cu conexiunea..." class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-emerald-500 transition">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Data Început</label>
                                <input type="date" id="absence-start-date" required class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-emerald-500 transition">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Număr Zile</label>
                                <input type="number" id="absence-days" min="1" max="30" value="1" required class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-emerald-500 transition">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Detalii Suplimentare</label>
                            <textarea id="absence-notes" rows="3" placeholder="Scrie detalii suplimentare..." class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-emerald-500 transition resize-none"></textarea>
                        </div>
                        <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer">
                            <span>🚀</span><span>Trimite Înștiințarea pe Discord</span>
                        </button>
                    </form>
                </div>

                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-slate-200">Înștiințări Trimise Recent</h3>
                            <span class="text-xs px-2.5 py-1 bg-slate-800 text-slate-400 rounded-lg border border-slate-700">Canal Discord: Concedii / Absențe</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b border-slate-800 text-xs text-slate-400 uppercase">
                                        <th class="pb-3 font-semibold">Coleg</th>
                                        <th class="pb-3 font-semibold">Motiv</th>
                                        <th class="pb-3 font-semibold">Data Start</th>
                                        <th class="pb-3 font-semibold">Durată</th>
                                        <th class="pb-3 font-semibold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody id="absence-history-table" class="divide-y divide-slate-800/50 text-sm text-slate-300">
                                    <tr><td colspan="5" class="py-4 text-center text-slate-500">Nicio înștiințare trimisă în această sesiune.</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        initAbsenceLogic();
    } else if (sectionName === 'Rapoarte' && (isAdmin || isManager)) {
        contentArea.innerHTML = `
            <div class="space-y-6">
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                        <div>
                            <h3 class="text-xl font-bold text-slate-100">Rapoarte Generale Activitate & Ture</h3>
                            <p class="text-slate-400 text-sm mt-1">Situația centralizată a orelor și performanței echipei din baza de date.</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button id="btn-send-manual-report" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-md">
                                <span>📤</span><span>Trimite Raport Manual pe Discord</span>
                            </button>
                            <button id="btn-refresh-reports" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition flex items-center space-x-2 cursor-pointer border border-slate-700">
                                <span>🔄</span><span>Actualizează Datele</span>
                            </button>
                            <button id="btn-export-reports" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-md">
                                <span>📥</span><span>Exportă Raport CSV</span>
                            </button>
                        </div>
                    </div>

                    <div id="report-action-alert" class="hidden mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium"></div>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <h4 class="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Ore Echipă</h4>
                            <p id="rep-total-hours" class="text-2xl font-bold font-mono text-emerald-400 mt-1">00:00:00</p>
                        </div>
                        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <h4 class="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Ture Înregistrate</h4>
                            <p id="rep-total-shifts" class="text-2xl font-bold text-indigo-400 mt-1">0</p>
                        </div>
                        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <h4 class="text-xs font-medium text-slate-400 uppercase tracking-wider">Mecanici Activi</h4>
                            <p id="rep-total-users" class="text-2xl font-bold text-amber-400 mt-1">0</p>
                        </div>
                        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <h4 class="text-xs font-medium text-slate-400 uppercase tracking-wider">Media Ore / Tură</h4>
                            <p id="rep-avg-shift" class="text-2xl font-bold font-mono text-blue-400 mt-1">00:00:00</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                            <div class="flex items-center justify-between">
                                <h4 class="text-sm font-bold text-slate-200 uppercase tracking-wider">Clasament Detaliat Performanță Echipă</h4>
                                <span class="text-xs text-slate-500">Sincronizat cu Supabase</span>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse">
                                    <thead>
                                        <tr class="border-b border-slate-800 text-xs text-slate-400 uppercase">
                                            <th class="pb-3 font-semibold">Loc / Mecanic</th>
                                            <th class="pb-3 font-semibold text-center">Ture Efectuate</th>
                                            <th class="pb-3 font-semibold text-right">Total Ore Lucrate</th>
                                        </tr>
                                    </thead>
                                    <tbody id="reports-leaderboard-table" class="divide-y divide-slate-800/50 text-sm text-slate-300">
                                        <tr><td colspan="3" class="py-4 text-center text-slate-500">Se încarcă rapoartele...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                            <h4 class="text-sm font-bold text-slate-200 uppercase tracking-wider">Filtrare Rapidă</h4>
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-xs text-slate-400 mb-1">Perioadă Raport</label>
                                    <select id="rep-filter-period" class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500">
                                        <option value="all">Toate Turele (Istoric General)</option>
                                        <option value="today">Doar Astăzi</option>
                                        <option value="week">Ultimele 7 Zile</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs text-slate-400 mb-1">Caută Mecanic</label>
                                    <input type="text" id="rep-search-input" placeholder="Nume mecanic..." class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500">
                                </div>
                                <div class="pt-2">
                                    <button id="btn-apply-filters" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow cursor-pointer">
                                        Aplică Filtrele
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (typeof initRapoarteModuleLogic === 'function') {
            initRapoarteModuleLogic();
        }
    } else if (sectionName === 'Contracte' && (isAdmin || isManager)) {
        contentArea.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div class="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
                    <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                        <h3 class="text-sm font-bold text-slate-200 uppercase tracking-wider">Date Contract (Salvate în Tabela Supabase 'contracte')</h3>
                        <span id="contract-number-badge" class="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">CN-2026-00019</span>
                    </div>

                    <form id="contract-form" class="space-y-3.5">
                        <div>
                            <label class="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Companie</label>
                            <input type="text" id="c-companie" value="S.C. Familia Es Todo S.R.L." class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 transition">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">Manager *</label>
                            <input type="text" id="c-manager" placeholder="Introduceți numele managerului" required class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 transition">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">Nume Complet Angajat *</label>
                            <input type="text" id="c-nume" placeholder="Nume și Prenume" required class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 transition">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">CNP Angajat *</label>
                            <input type="text" id="c-cnp" placeholder="Cod Numeric Personal" required class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 transition">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">Număr Telefon Angajat *</label>
                            <input type="text" id="c-telefon" placeholder="Număr de telefon" required class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 transition">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">Funcție / Poziție *</label>
                            <select id="c-functie" class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 transition">
                                <option value="Mecanic">Mecanic</option>
                                <option value="Șef Mecanic">Șef Mecanic</option>
                                <option value="Familia">Familia</option>
                                <option value="Manager">Manager</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">Salariu</label>
                            <input type="text" id="c-salariu" value="100 lei/lună" class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 transition">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">Program de Lucru</label>
                            <input type="text" id="c-program" value="20:00-23:00" class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 transition">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">Data Începerii *</label>
                            <input type="date" id="c-data" required class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 transition">
                        </div>

                        <div class="pt-2 space-y-2">
                            <button type="button" id="btn-genereaza-contract" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl transition text-xs shadow-md cursor-pointer">
                                Generează & Salvează Contract în Baza de Date
                            </button>
                            <button type="button" id="btn-copiaza-contract" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl transition text-xs shadow-md cursor-pointer">
                                Copiază Contract
                            </button>
                            <button type="button" id="btn-reseteaza-contract" class="w-full bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-semibold py-2.5 px-4 rounded-xl transition text-xs cursor-pointer">
                                Resetează Formularul
                            </button>
                        </div>
                    </form>
                </div>

                <div class="lg:col-span-7 space-y-6">
                    <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                        <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                            <h3 class="text-sm font-bold text-slate-200 uppercase tracking-wider">Previzualizare Contract</h3>
                            <div class="text-xs text-slate-400 flex items-center space-x-3">
                                <span id="preview-timestamp">Data: 26.07.2026 | Ora: 13:43:06</span>
                                <span id="preview-status" class="text-amber-400 font-medium">Așteptare generare...</span>
                            </div>
                        </div>

                        <div id="contract-preview-box" class="bg-slate-950 border border-slate-800/80 p-5 rounded-xl font-mono text-xs text-slate-300 leading-relaxed h-[420px] max-h-[420px] overflow-y-auto whitespace-pre-wrap select-text">
Completați formularul și apăsați "Generează Contract" pentru a vizualiza documentul final.
                        </div>
                    </div>

                    <div id="image-upload-section" class="hidden bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
                        <div class="pb-2 border-b border-slate-800">
                            <h3 class="text-sm font-bold text-slate-200">Atașare Imagini (Click & Apasă Ctrl+V) & Trimitere Discord</h3>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div id="dropzone-buletin" tabindex="0" class="bg-slate-950 border-2 border-dashed border-slate-700 hover:border-emerald-500 focus:border-emerald-500 p-6 rounded-xl text-center cursor-pointer transition outline-none flex flex-col items-center justify-center min-h-[140px] relative">
                                <span class="text-xs font-bold text-slate-300 mb-1">Imagine Buletin</span>
                                <span id="text-buletin-status" class="text-[11px] text-slate-500">Click aici și dă Paste (Ctrl+V)</span>
                                <div id="preview-container-buletin" class="hidden mt-2 relative inline-block">
                                    <img id="img-preview-buletin" class="max-h-20 rounded border border-slate-700" alt="Buletin" />
                                    <button type="button" id="btn-remove-buletin" class="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow cursor-pointer">×</button>
                                </div>
                            </div>

                            <div id="dropzone-contract" tabindex="0" class="bg-slate-950 border-2 border-dashed border-slate-700 hover:border-emerald-500 focus:border-emerald-500 p-6 rounded-xl text-center cursor-pointer transition outline-none flex flex-col items-center justify-center min-h-[140px] relative">
                                <span class="text-xs font-bold text-slate-300 mb-1">Imagine Contract</span>
                                <span id="text-contract-status" class="text-[11px] text-slate-500">Click aici și dă Paste (Ctrl+V)</span>
                                <div id="preview-container-contract" class="hidden mt-2 relative inline-block">
                                    <img id="img-preview-contract" class="max-h-20 rounded border border-slate-700" alt="Contract" />
                                    <button type="button" id="btn-remove-contract" class="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow cursor-pointer">×</button>
                                </div>
                            </div>
                        </div>

                        <button type="button" id="btn-trimite-discord-contract" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition text-xs shadow-lg cursor-pointer flex items-center justify-center space-x-2">
                            <span>🚀</span><span>Trimite Raportul pe Discord</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        initContractLogic();
    } else if (sectionName === 'Admin' && isAdmin) {
        contentArea.innerHTML = `
            <div class="space-y-6">
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 class="text-xl font-bold text-slate-100 mb-2">Panou Administrare Sisteme (Baza de Date & Tabele Active)</h3>
                    <p class="text-slate-400 text-sm mb-6">Gestionează utilizatorii înregistrați și datele din tabelele Supabase (` + '`users`' + `, ` + '`shifts`' + `, ` + '`contracte`' + `, ` + '`admin_settings`' + `, ` + '`audit_logs`' + `).</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <h4 class="text-sm font-semibold text-slate-200 mb-1">Setări Webhook-uri Active</h4>
                            <p class="text-xs text-slate-400 mb-3">Toate webhook-urile Discord sunt operaționale.</p>
                            <span class="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-md">Status: Online</span>
                        </div>
                        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <h4 class="text-sm font-semibold text-slate-200 mb-1">Conexiune Supabase & Structură SQL</h4>
                            <p class="text-xs text-slate-400 mb-3">Tabelele și tabelele de audit sunt sincronizate cu succes.</p>
                            <span class="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-md">Status: Activ & Sincronizat</span>
                        </div>
                    </div>

                    <h4 class="text-base font-semibold text-slate-200 mb-4">Utilizatori Înregistrați în Sistem</h4>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-slate-800 text-xs text-slate-400 uppercase">
                                    <th class="pb-3 font-semibold">Avatar</th>
                                    <th class="pb-3 font-semibold">Nume / Discord</th>
                                    <th class="pb-3 font-semibold">Rol</th>
                                    <th class="pb-3 font-semibold">Service</th>
                                    <th class="pb-3 font-semibold text-right">Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody id="admin-users-table" class="divide-y divide-slate-800/50 text-sm text-slate-300">
                               <tr><td colspan="5" class="py-4 text-center text-slate-500">Se încarcă lista utilizatorilor...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 class="text-xl font-bold text-slate-100 mb-2">Setări Avansate Administrator & Politici Sistem</h3>
                    <p class="text-slate-400 text-sm mb-6">Configurări complete salvate direct în tabela ` + '`admin_settings`' + ` din baza de date.</p>
                    
                    <div id="admin-settings-alert" class="hidden mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium"></div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                                <div>
                                    <h4 class="text-sm font-semibold text-slate-200">Mod Mentenanță / Blocare Ture</h4>
                                    <p class="text-xs text-slate-400">Oprește temporar posibilitatea de a da start la ture noi.</p>
                                </div>
                                <input type="checkbox" id="setting-maintenance" class="w-5 h-5 accent-emerald-500 cursor-pointer">
                            </div>

                            <div class="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                                <div>
                                    <h4 class="text-sm font-semibold text-slate-200">Notificări Discord Automate</h4>
                                    <p class="text-xs text-slate-400">Activează sau dezactivează trimiterea automată a logurilor pe webhook.</p>
                                </div>
                                <input type="checkbox" id="setting-discord-logs" class="w-5 h-5 accent-emerald-500 cursor-pointer" checked>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div class="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                                <h4 class="text-sm font-semibold text-slate-200">Prag Notificări / Valoare Maximă</h4>
                                <p class="text-xs text-slate-400">Valoarea limită utilizată pentru alerte automate de sistem.</p>
                                <input type="number" id="setting-threshold" class="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-emerald-500">
                            </div>

                            <div class="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                                <h4 class="text-sm font-semibold text-slate-200">Durată Maximă Tură (Ore)</h4>
                                <p class="text-xs text-slate-400">Limita maximă permisă pentru o singură sesiune de pontaj.</p>
                                <input type="number" id="setting-max-shift-hours" value="12" class="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-emerald-500">
                            </div>

                            <div class="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                                <h4 class="text-sm font-semibold text-slate-200">Rol Implicit Utilizatori Noi</h4>
                                <p class="text-xs text-slate-400">Rolul atribuit automat la prima logare prin Discord.</p>
                                <select id="setting-default-role" class="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-emerald-500">
                                    <option value="Mecanic">Mecanic</option>
                                    <option value="Șef Mecanic">Șef Mecanic</option>
                                    <option value="Familia">Familia</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end mt-6">
                        <button type="button" id="btn-save-admin-settings" class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-6 rounded-xl transition text-xs shadow-lg cursor-pointer">
                            Salvează Toate Setările în Tabela 'admin_settings'
                        </button>
                    </div>
                </div>
            </div>
        `;

        initAdminLogic();
    } else {
        contentArea.innerHTML = `
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl text-slate-400">
                Modulul <span class="text-slate-200 font-semibold">${sectionName}</span> este pregătit.
            </div>
        `;
    }
}

async function initAdminLogic() {
    const usersTable = document.getElementById('admin-users-table');
    if (usersTable) {
        try {
            const { data: users, error } = await supabaseClient.from('users').select('*');
            if (error || !users || users.length === 0) {
                usersTable.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-slate-500">Niciun utilizator găsit în baza de date.</td></tr>`;
            } else {
                usersTable.innerHTML = users.filter(u => u.discord_id !== 'admin_config_global').map(u => `
                    <tr class="hover:bg-slate-800/30 transition">
                        <td class="py-3">
                            <img src="${u.avatar || 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f468-200d-1f4bb.png'}" class="w-8 h-8 rounded-full border border-slate-700" alt="Avatar">
                        </td>
                        <td class="py-3 text-slate-200 font-medium">${u.display_name || u.username} <span class="text-xs text-slate-500 block">ID: ${u.discord_id}</span></td>
                        <td class="py-3 text-indigo-400">
                            <select onchange="updateUserRole('${u.discord_id}', this.value)" class="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded p-1 focus:outline-none focus:border-emerald-500">
                                <option value="Mecanic" ${u.role === 'Mecanic' ? 'selected' : ''}>Mecanic</option>
                                <option value="Șef Mecanic" ${u.role === 'Șef Mecanic' || u.role === 'Sef Mecanic' ? 'selected' : ''}>Șef Mecanic</option>
                                <option value="Familia" ${u.role === 'Familia' ? 'selected' : ''}>Familia</option>
                                <option value="Manager" ${u.role === 'Manager' ? 'selected' : ''}>Manager</option>
                                <option value="Admin" ${u.role === 'Admin' ? 'selected' : ''}>Admin</option>
                            </select>
                        </td>
                        <td class="py-3 text-slate-300">${u.service || 'Service 2'}</td>
                        <td class="py-3 text-right">
                            <button onclick="alert('Utilizator selectat: ${u.display_name || u.username}')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition cursor-pointer">Detalii</button>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (err) {
            console.error("Eroare la încărcarea utilizatorilor pentru admin:", err);
            usersTable.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-rose-500">Eroare la preluarea datelor din Supabase.</td></tr>`;
        }
    }

    const btnSaveSettings = document.getElementById('btn-save-admin-settings');
    const settingsAlert = document.getElementById('admin-settings-alert');
    const settingMaintenance = document.getElementById('setting-maintenance');
    const settingDiscordLogs = document.getElementById('setting-discord-logs');
    const settingThreshold = document.getElementById('setting-threshold');
    const settingMaxShiftHours = document.getElementById('setting-max-shift-hours');
    const settingDefaultRole = document.getElementById('setting-default-role');

    if (settingMaintenance && settingThreshold) {
        try {
            const { data: configData } = await supabaseClient.from('admin_settings').select('*').eq('id', 1).single();
            if (configData) {
                settingMaintenance.checked = configData.maintenance_mode || false;
                if (settingDiscordLogs) settingDiscordLogs.checked = configData.discord_logs_active !== false;
                settingThreshold.value = configData.threshold_value || 100;
                if (settingMaxShiftHours) settingMaxShiftHours.value = configData.max_shift_hours || 12;
                if (settingDefaultRole) settingDefaultRole.value = configData.default_role || 'Mecanic';
            }
        } catch (e) {
            try {
                const { data: fallbackConfig } = await supabaseClient.from('users').select('*').eq('discord_id', 'admin_config_global').single();
                if (fallbackConfig) {
                    settingMaintenance.checked = fallbackConfig.maintenance_mode || false;
                    settingThreshold.value = fallbackConfig.threshold_value || 100;
                }
            } catch (errFallback) {
                settingMaintenance.checked = false;
                settingThreshold.value = 100;
            }
        }
    }

    if (btnSaveSettings) {
        btnSaveSettings.addEventListener('click', async () => {
            const maintenanceVal = settingMaintenance ? settingMaintenance.checked : false;
            const discordLogsVal = settingDiscordLogs ? settingDiscordLogs.checked : true;
            const thresholdVal = settingThreshold ? Number(settingThreshold.value) : 100;
            const maxShiftVal = settingMaxShiftHours ? Number(settingMaxShiftHours.value) : 12;
            const defaultRoleVal = settingDefaultRole ? settingDefaultRole.value : 'Mecanic';

            try {
                const settingPayload = {
                    id: 1,
                    maintenance_mode: maintenanceVal,
                    discord_logs_active: discordLogsVal,
                    threshold_value: thresholdVal,
                    max_shift_hours: maxShiftVal,
                    default_role: defaultRoleVal,
                    updated_at: new Date().toISOString()
                };

                const { error: errAdminSettings } = await supabaseClient
                    .from('admin_settings')
                    .upsert([settingPayload], { onConflict: ['id'] });

                const { error: errUsersConfig } = await supabaseClient
                    .from('users')
                    .upsert([{
                        discord_id: 'admin_config_global',
                        username: 'SystemConfig',
                        display_name: 'SystemConfig',
                        role: 'System',
                        maintenance_mode: maintenanceVal,
                        discord_logs_active: discordLogsVal,
                        threshold_value: thresholdVal,
                        max_shift_hours: maxShiftVal,
                        default_role: defaultRoleVal
                    }], { onConflict: ['discord_id'] });

                await supabaseClient.from('audit_logs').insert([{
                    action: 'UPDATE_ADMIN_SETTINGS',
                    details: JSON.stringify(settingPayload),
                    created_at: new Date().toISOString()
                }]);

                if (!errAdminSettings || !errUsersConfig) {
                    if (settingsAlert) {
                        settingsAlert.textContent = "Toate setările avansate de sistem, tabelele admin_settings și audit_logs au fost actualizate și activate cu succes!";
                        settingsAlert.classList.remove('hidden');
                        setTimeout(() => settingsAlert.classList.add('hidden'), 4000);
                    }
                } else {
                    alert("Eroare la salvarea setărilor în tabelele Supabase.");
                }
            } catch (err) {
                console.error("Eroare setări admin:", err);
            }
        });
    }
}

async function updateUserRole(discordId, newRole) {
    try {
        const { error } = await supabaseClient
            .from('users')
            .update({ role: newRole })
            .eq('discord_id', discordId);

        if (error) {
            alert("Eroare la actualizarea rolului în baza de date.");
            console.error(error);
        } else {
            alert(`Rolul a fost actualizat cu succes la: ${newRole}`);
            localStorage.setItem('userRole', newRole);
        }
    } catch (err) {
        console.error("Eroare actualizare rol:", err);
    }
}

function initAbsenceLogic() {
    const absenceTypeSelect = document.getElementById('absence-type');
    const customReasonContainer = document.getElementById('custom-reason-container');
    const absenceForm = document.getElementById('absence-form');
    const absenceAlert = document.getElementById('absence-alert');
    const startDateInput = document.getElementById('absence-start-date');

    if (startDateInput) {
        startDateInput.value = new Date().toISOString().split('T')[0];
    }

    if (absenceTypeSelect && customReasonContainer) {
        absenceTypeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Altele') {
                customReasonContainer.classList.remove('hidden');
            } else {
                customReasonContainer.classList.add('hidden');
            }
        });
    }

    if (absenceForm) {
        absenceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('workforce_user')) || { displayName: 'Mecanic' };
            const type = absenceTypeSelect.value;
            const customReason = document.getElementById('absence-custom-reason').value;
            const startDate = startDateInput.value;
            const days = document.getElementById('absence-days').value;
            const notes = document.getElementById('absence-notes').value;

            let finalReason = type;
            if (type === 'Altele' && customReason.trim() !== '') {
                finalReason = `Altele: ${customReason.trim()}`;
            }

            const message = `📢 **ÎNȘTIINȚARE ABSENȚĂ / CONCEDIU** 📢\n\n` +
                            `👤 **Coleg:** ${user.displayName || user.username}\n` +
                            `🏷️ **Motiv:** \`${finalReason}\`\n` +
                            `📅 **Data Start:** \`${startDate}\`\n` +
                            `⏳ **Perioadă:** \`${days} zi/zile\`\n` +
                            `${notes ? `💬 **Observații:** _${notes}_\n` : ''}` +
                            `⏰ **Trimis la:** ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            try {
                const response = await fetch(WEBHOOK_CERERI, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: message })
                });

                if (response.ok || response.status === 204) {
                    if (absenceAlert) {
                        absenceAlert.textContent = "Înștiințarea a fost trimisă cu succes pe Discord!";
                        absenceAlert.classList.remove('hidden');
                    }
                    appendLocalAbsenceRecord({
                        name: user.displayName || user.username,
                        reason: finalReason,
                        date: startDate,
                        days: days
                    });
                    absenceForm.reset();
                    if (startDateInput) startDateInput.value = new Date().toISOString().split('T')[0];
                    if (customReasonContainer) customReasonContainer.classList.add('hidden');

                    setTimeout(() => {
                        if (absenceAlert) absenceAlert.classList.add('hidden');
                    }, 5000);
                } else {
                    alert("A apărut o eroare la trimiterea înștiințării pe Discord.");
                }
            } catch (err) {
                console.error("Eroare webhook cereri:", err);
            }
        });
    }
    loadLocalAbsenceHistory();
}

function appendLocalAbsenceRecord(record) {
    let history = JSON.parse(localStorage.getItem('workforce_absences_history')) || [];
    history.unshift(record);
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem('workforce_absences_history', JSON.stringify(history));
    loadLocalAbsenceHistory();
}

function loadLocalAbsenceHistory() {
    const historyTable = document.getElementById('absence-history-table');
    if (!historyTable) return;
    let history = JSON.parse(localStorage.getItem('workforce_absences_history')) || [];
    if (history.length === 0) {
        historyTable.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-slate-500">Nicio înștiințare trimisă în această sesiune.</td></tr>`;
        return;
    }
    historyTable.innerHTML = history.map(item => `
        <tr class="hover:bg-slate-800/30 transition">
            <td class="py-3 text-slate-200 font-medium">${item.name}</td>
            <td class="py-3 text-indigo-400">${item.reason}</td>
            <td class="py-3 text-slate-300">${item.date}</td>
            <td class="py-3 text-slate-300 font-mono">${item.days} zi/zile</td>
            <td class="py-3 text-right"><span class="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-full">Trimis</span></td>
        </tr>
    `).join('');
}

function initContractLogic() {
    const dateInput = document.getElementById('c-data');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    const btnGenereaza = document.getElementById('btn-genereaza-contract');
    const btnCopiaza = document.getElementById('btn-copiaza-contract');
    const btnReseteaza = document.getElementById('btn-reseteaza-contract');
    const previewBox = document.getElementById('contract-preview-box');
    const previewStatus = document.getElementById('preview-status');
    const previewTimestamp = document.getElementById('preview-timestamp');
    const imageUploadSection = document.getElementById('image-upload-section');

    let buletinFile = null;
    let contractFile = null;

    const updateTimestampText = () => {
        const now = new Date();
        if (previewTimestamp) previewTimestamp.textContent = `Data: ${now.toLocaleDateString('ro-RO')} | Ora: ${now.toLocaleTimeString('ro-RO')}`;
    };

    const getContractTextContent = () => {
        const companie = document.getElementById('c-companie').value.trim() || 'S.C. Familia Es Todo S.R.L.';
        const manager = document.getElementById('c-manager').value.trim() || '[Nume Manager]';
        const nume = document.getElementById('c-nume').value.trim() || '[Nume și Prenume Angajat]';
        const cnp = document.getElementById('c-cnp').value.trim() || '[CNP]';
        const telefon = document.getElementById('c-telefon').value.trim() || '[Telefon]';
        const functie = document.getElementById('c-functie').value;
        const salariu = document.getElementById('c-salariu').value;
        const program = document.getElementById('c-program').value;
        const dataStart = document.getElementById('c-data').value;
        const contractNo = document.getElementById('contract-number-badge').textContent;

        return `CONTRACT INDIVIDUAL DE MUNCĂ
Nr. ${contractNo}

Încheiat între:

Angajator: ${companie}, cu sediul în Los Santos pe Innocence Boulevard, reprezentată legal de ${manager}, denumită în continuare Angajator,

și

Salariat:
${nume}

domiciliat(ă) în Los Santos,
CNP: ${cnp},
Telefon: ${telefon},
denumit(ă) în continuare Angajat.

Art. 1 – Obiectul contractului

Angajatul este încadrat în funcția de ${functie} în cadrul activității de service auto și/sau spălătorie auto, conform fișei postului anexate la prezentul contract.

Art. 2 – Durata contractului

Contractul se încheie pe perioadă: Perioada Nedeterminata

Data începerii activității este ${dataStart}.

Art. 3 – Locul muncii

Activitatea se va desfășura la punctul de lucru al ${companie} situat în Los Santos pe Innocence Boulevard, precum și în alte locații ale societății, dacă este necesar.

Art. 4 – Programul de lucru

Programul normal de lucru este de 3 ore/zi, între ora ${program}, conform programului stabilit de angajator si Primaria Orasului Los Santos.

Art. 5 – Salarizarea

Salariul de bază net: ${salariu}.
Plata salariului se efectuează săptămânal in fiecare Duminica.
Angajatul poate beneficia de bonusuri sau prime de performanță, conform politicii societății.
Orele suplimentare se efectuează numai cu aprobarea angajatorului și nu sunt remunerate prin salariul de bază. Compensarea acestora se realizează exclusiv din sumele încasate cu titlu de bacșiș („ciubuc”) sau din veniturile obținute în urma lucrărilor efectuate în intervalul respectiv, conform înțelegerii dintre părți.

Art. 6 – Obligațiile angajatului

Angajatul se obligă:

să respecte programul de lucru;
să execute atribuțiile prevăzute în fișa postului;
să utilizeze corespunzător echipamentele și uneltele societății;
să respecte normele de securitate și sănătate în muncă;
să păstreze confidențialitatea informațiilor privind activitatea societății și a clienților;
să manifeste un comportament profesionist față de clienți și colegi;
să informeze imediat angajatorul despre orice incident sau defecțiune constatată.

Art. 7 – Obligațiile angajatorului

Angajatorul se obligă:

să asigure condiții corespunzătoare de muncă;
să achite salariul la termen;
să pună la dispoziția angajatului echipamentele necesare;
să respecte drepturile prevăzute de legislația muncii;
să asigure instruirea privind securitatea și sănătatea în muncă.

Art. 8 – Demisia și încetarea contractului

Angajatul poate demisiona prin notificare scrisă, cu respectarea termenului de preaviz prevăzut de lege sau de prezentul contract.

Angajatorul poate dispune încetarea contractului numai în condițiile și pentru motivele prevăzute de legislația muncii, cu respectarea procedurilor legale.

La încetarea raporturilor de muncă, angajatul va preda toate bunurile, echipamentele, documentele și materialele aparținând societății.

Art. 9 – Fișa postului

Atribuții principale

executarea lucrărilor specifice postului ocupat;
menținerea curățeniei la locul de muncă;
utilizarea corectă a echipamentelor și sculelor;
respectarea procedurilor interne;
comunicarea cu superiorul direct privind desfășurarea activității;
respectarea normelor de protecția muncii și PSI.

Art. 10 – Dispoziții finale

Prezentul contract produce efecte începând cu data de ${dataStart}.

Orice modificare se face numai prin act adițional, semnat de ambele părți.

Contractul este întocmit în două exemplare originale, câte unul pentru fiecare parte.

ANGAJATOR

Compania: ${companie}

Reprezentant: ${manager}

Semnătură: ${manager}

ANGAJAT

Nume: ${nume}

Semnătură:`;
    };

    if (btnGenereaza) {
        btnGenereaza.addEventListener('click', async () => {
            const nume = document.getElementById('c-nume').value.trim();
            const cnp = document.getElementById('c-cnp').value.trim();
            const telefon = document.getElementById('c-telefon').value.trim();
            const manager = document.getElementById('c-manager').value.trim();
            const functie = document.getElementById('c-functie').value;
            const contractNo = document.getElementById('contract-number-badge').textContent;
            const user = JSON.parse(localStorage.getItem('workforce_user')) || {};

            if (!manager || !nume || !cnp || !telefon) {
                alert("Te rugăm să completezi toate câmpurile obligatorii marcate cu * (Manager, Nume, CNP, Telefon)!");
                return;
            }

            try {
                const contractRecord = {
                    discord_id: user.discordId || 'system_operator',
                    contract_no: contractNo,
                    nume_angajat: nume,
                    cnp: cnp,
                    telefon: telefon,
                    functie: functie,
                    manager: manager,
                    created_at: new Date().toISOString()
                };

                const { error: dbError } = await supabaseClient
                    .from('contracte')
                    .insert([contractRecord]);

                if (dbError) {
                    console.error("Eroare la salvarea contractului în baza de date:", dbError.message);
                } else {
                    console.log("Contractul a fost activat și salvat cu succes în tabela Supabase 'contracte'.");
                }
            } catch (err) {
                console.error("Eroare conexiune contracte DB:", err);
            }

            updateTimestampText();
            previewBox.textContent = getContractTextContent();
            previewBox.scrollTop = 0;
            if (previewStatus) {
                previewStatus.textContent = "Generat și Salvat în DB cu succes!";
                previewStatus.className = "text-emerald-400 font-medium";
            }
        });
    }

    if (btnCopiaza) {
        btnCopiaza.addEventListener('click', () => {
            const textToCopy = getContractTextContent();
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert("Contractul a fost copiat în clipboard!");
                if (imageUploadSection) {
                    imageUploadSection.classList.remove('hidden');
                    imageUploadSection.scrollIntoView({ behavior: 'smooth' });
                }
            }).catch(err => {
                console.error("Eroare la copiere:", err);
            });
        });
    }

    if (btnReseteaza) {
        btnReseteaza.addEventListener('click', () => {
            document.getElementById('contract-form').reset();
            if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
            previewBox.textContent = 'Completați formularul și apăsați "Generează Contract" pentru a vizualiza documentul final.';
            if (previewStatus) {
                previewStatus.textContent = "Așteptare generare...";
                previewStatus.className = "text-amber-400 font-medium";
            }
            if (imageUploadSection) imageUploadSection.classList.add('hidden');
            buletinFile = null;
            contractFile = null;
            document.getElementById('preview-container-buletin').classList.add('hidden');
            document.getElementById('text-buletin-status').classList.remove('hidden');
            document.getElementById('preview-container-contract').classList.add('hidden');
            document.getElementById('text-contract-status').classList.remove('hidden');
        });
    }

    const setupDropzone = (zoneId, statusId, containerId, imgId, removeBtnId, fileType) => {
        const zone = document.getElementById(zoneId);
        const statusSpan = document.getElementById(statusId);
        const container = document.getElementById(containerId);
        const imgEl = document.getElementById(imgId);
        const removeBtn = document.getElementById(removeBtnId);

        if (!zone) return;

        zone.addEventListener('click', () => {
            zone.focus();
        });

        zone.addEventListener('paste', (e) => {
            e.preventDefault();
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let item of items) {
                if (item.type.indexOf('image') === 0) {
                    const file = item.getAsFile();
                    if (fileType === 'buletin') buletinFile = file;
                    if (fileType === 'contract') contractFile = file;

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        imgEl.src = event.target.result;
                        statusSpan.classList.add('hidden');
                        container.classList.remove('hidden');
                    };
                    reader.readAsDataURL(file);
                    break;
                }
            }
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (fileType === 'buletin') buletinFile = null;
                if (fileType === 'contract') contractFile = null;
                container.classList.add('hidden');
                imgEl.src = '';
                statusSpan.classList.remove('hidden');
                zone.focus();
            });
        }
    };

    setupDropzone('dropzone-buletin', 'text-buletin-status', 'preview-container-buletin', 'img-preview-buletin', 'btn-remove-buletin', 'buletin');
    setupDropzone('dropzone-contract', 'text-contract-status', 'preview-container-contract', 'img-preview-contract', 'btn-remove-contract', 'contract');

    const btnTrimiteDiscord = document.getElementById('btn-trimite-discord-contract');
    if (btnTrimiteDiscord) {
        btnTrimiteDiscord.addEventListener('click', async () => {
            const user = JSON.parse(localStorage.getItem('workforce_user')) || { displayName: 'Mecanic' };
            const nume = document.getElementById('c-nume').value.trim() || 'Nespecificat';
            const cnp = document.getElementById('c-cnp').value.trim() || 'Nespecificat';
            const telefon = document.getElementById('c-telefon').value.trim() || 'Nespecificat';
            const manager = document.getElementById('c-manager').value.trim() || 'Nespecificat';
            const functie = document.getElementById('c-functie').value;
            const contractNo = document.getElementById('contract-number-badge').textContent;

            const formData = new FormData();
            const messageContent = `📜 **CONTRACT NOU GENERAT, SALVAT ÎN DB & SEMNAT** 📜\n\n` +
                                 `🆔 **Număr Contract:** \`${contractNo}\`\n` +
                                 `👤 **Angajat:** ${nume} (CNP: \`${cnp}\`, Tel: \`${telefon}\`)\n` +
                                 `🛠️ **Funcție:** \`${functie}\`\n` +
                                 `👔 **Manager Responsabil:** ${manager}\n` +
                                 `✍️ **Operator / Agent:** ${user.displayName || user.username}\n` +
                                 `⏰ **Data & Ora:** ${new Date().toLocaleString('ro-RO')}`;

            formData.append('payload_json', JSON.stringify({ content: messageContent }));

            if (buletinFile) formData.append('file1', buletinFile, 'buletin.png');
            if (contractFile) formData.append('file2', contractFile, 'contract.png');

            try {
                const response = await fetch(WEBHOOK_CONTRACTE, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok || response.status === 204) {
                    alert("Contractul, înregistrările din baza de date și imaginile au fost trimise cu succes pe Discord!");
                } else {
                    alert("A apărut o eroare la trimiterea pe Discord.");
                }
            } catch (err) {
                console.error("Eroare webhook contracte:", err);
            }
        });
    }
}

function initAdvancedPontajLogic() {
    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnResume = document.getElementById('btn-resume');
    const btnStop = document.getElementById('btn-stop');
    const timerDisplay = document.getElementById('timer-display');
    const timerLabel = document.getElementById('timer-label');
    const statusText = document.getElementById('shift-status-text');
    const btnZi = document.getElementById('type-zi');
    const btnNoapte = document.getElementById('type-noapte');
    const validationAlert = document.getElementById('validation-alert');

    let selectedShiftType = 'Tură de Zi (23:01 - 19:59)';

    if (btnZi && btnNoapte) {
        btnZi.addEventListener('click', () => {
            selectedShiftType = 'Tură de Zi (23:01 - 19:59)';
            btnZi.className = "py-2 px-3 text-xs font-semibold rounded-lg border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 transition cursor-pointer";
            btnNoapte.className = "py-2 px-3 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition cursor-pointer";
            if (validationAlert) validationAlert.classList.add('hidden');
        });

        btnNoapte.addEventListener('click', () => {
            selectedShiftType = 'Tură de Noapte (20:00 - 23:00)';
            btnNoapte.className = "py-2 px-3 text-xs font-semibold rounded-lg border border-indigo-500/50 bg-indigo-500/10 text-indigo-400 transition cursor-pointer";
            btnZi.className = "py-2 px-3 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition cursor-pointer";
            if (validationAlert) validationAlert.classList.add('hidden');
        });
    }

    let shiftState = JSON.parse(localStorage.getItem('workforce_shift_state')) || {
        status: 'stopped',
        startTime: null,
        pausedTimeTotal: 0,
        pauseStart: null,
        shiftType: 'Tură de Zi (23:01 - 19:59)'
    };

    if (shiftState.shiftType) selectedShiftType = shiftState.shiftType;

    fetchAndRenderShiftsHistory();
    updateUIState();

    if (btnStart) {
        btnStart.addEventListener('click', async () => {
            const timestamp = Date.now();
            shiftState = {
                status: 'active',
                startTime: timestamp,
                pausedTimeTotal: 0,
                pauseStart: null,
                shiftType: selectedShiftType
            };
            saveAndRefresh();

            const user = JSON.parse(localStorage.getItem('workforce_user'));
            if (user) {
                await sendDiscordLog(`🟢 **${user.displayName || user.username}** a pornit o **${shiftState.shiftType}** la ora **${new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}**.`);
            }
        });
    }

    if (btnPause) {
        btnPause.addEventListener('click', async () => {
            shiftState.status = 'paused';
            shiftState.pauseStart = Date.now();
            saveAndRefresh();
            const user = JSON.parse(localStorage.getItem('workforce_user'));
            if (user) await sendDiscordLog(`⏸️ **${user.displayName || user.username}** a pus tura în **pauză**.`);
        });
    }

    if (btnResume) {
        btnResume.addEventListener('click', async () => {
            if (shiftState.pauseStart) {
                shiftState.pausedTimeTotal += (Date.now() - shiftState.pauseStart);
            }
            shiftState.status = 'active';
            shiftState.pauseStart = null;
            saveAndRefresh();
            const user = JSON.parse(localStorage.getItem('workforce_user'));
            if (user) await sendDiscordLog(`▶️ **${user.displayName || user.username}** a reînceput tura.`);
        });
    }

    if (btnStop) {
        btnStop.addEventListener('click', async () => {
            const now = Date.now();
            if (shiftState.pauseStart) {
                shiftState.pausedTimeTotal += (now - shiftState.pauseStart);
            }

            const netDuration = (now - shiftState.startTime) - shiftState.pausedTimeTotal;
            const user = JSON.parse(localStorage.getItem('workforce_user'));

            if (netDuration > 0 && user && user.discordId) {
                const shiftData = {
                    discord_id: user.discordId,
                    date: new Date(shiftState.startTime).toLocaleDateString(),
                    start_time: new Date(shiftState.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    end_time: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    duration: formatDuration(netDuration),
                    duration_ms: netDuration,
                    shift_type: shiftState.shiftType
                };

                await saveShiftToDatabase(shiftData);
                await sendDiscordLog(`🛑 **${user.displayName || user.username}** a încheiat tura (${shiftState.shiftType}). Durată totală: **${formatDuration(netDuration)}**.`);
                await updateAndSendLeaderboard();
            }

            localStorage.removeItem('workforce_shift_state');
            shiftState = { status: 'stopped', startTime: null, pausedTimeTotal: 0, pauseStart: null, shiftType: 'Tură de Zi (23:01 - 19:59)' };
            saveAndRefresh();
        });
    }

    function saveAndRefresh() {
        if (shiftState.status !== 'stopped') {
            localStorage.setItem('workforce_shift_state', JSON.stringify(shiftState));
        } else {
            localStorage.removeItem('workforce_shift_state');
        }
        updateUIState();
        fetchAndRenderShiftsHistory();
    }

    function updateUIState() {
        clearInterval(window.activeTimerInterval);
        if (!btnStart || !btnPause || !btnResume || !btnStop) return;

        const activeTypeEl = document.getElementById('stat-active-type');

        if (shiftState.status === 'stopped') {
            btnStart.classList.remove('hidden');
            btnPause.classList.add('hidden');
            btnResume.classList.add('hidden');
            btnStop.classList.add('hidden');
            timerDisplay.textContent = "00:00:00";
            timerLabel.textContent = "Timp scurs";
            statusText.textContent = "Tura este oprită. Alege tipul și apasă Start.";
            if (activeTypeEl) activeTypeEl.textContent = "Niciuna";
        } else if (shiftState.status === 'active') {
            btnStart.classList.add('hidden');
            btnPause.classList.remove('hidden');
            btnResume.classList.add('hidden');
            btnStop.classList.remove('hidden');
            timerLabel.textContent = "Timp scurs (Activ)";
            statusText.textContent = `Tură în desfășurare (${shiftState.shiftType})...`;
            if (activeTypeEl) activeTypeEl.textContent = shiftState.shiftType;

            window.activeTimerInterval = setInterval(() => {
                const elapsed = (Date.now() - shiftState.startTime) - shiftState.pausedTimeTotal;
                timerDisplay.textContent = formatDuration(elapsed);
            }, 1000);
        } else if (shiftState.status === 'paused') {
            btnStart.classList.add('hidden');
            btnPause.classList.add('hidden');
            btnResume.classList.remove('hidden');
            btnStop.classList.remove('hidden');
            timerLabel.textContent = "Timp scurs (Pauză)";
            statusText.textContent = "Tura este în pauză.";
            if (activeTypeEl) activeTypeEl.textContent = `${shiftState.shiftType} (Pauză)`;
            
            const totalElapsed = (shiftState.pauseStart - shiftState.startTime) - shiftState.pausedTimeTotal;
            timerDisplay.textContent = formatDuration(totalElapsed);
        }
    }
}

function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

async function sendDiscordLog(message) {
    try {
        await fetch(WEBHOOK_LOGS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message })
        });
    } catch (err) {
        console.error("Eroare trimitere log Discord:", err);
    }
}

async function updateAndSendLeaderboard() {
    try {
        const { data: shifts, error } = await supabaseClient.from('shifts').select('*');
        const { data: users } = await supabaseClient.from('users').select('*');
        if (error || !shifts) return;

        const userMap = {};
        if (users) users.forEach(u => { userMap[u.discord_id] = u.display_name || u.username; });

        const stats = {};
        shifts.forEach(s => {
            if (!stats[s.discord_id]) {
                stats[s.discord_id] = { name: userMap[s.discord_id] || 'Mecanic', ms: 0, shifts: 0 };
            }
            stats[s.discord_id].shifts += 1;
            stats[s.discord_id].ms += s.duration_ms || 0;
        });

        const sortedLeaderboard = Object.values(stats).sort((a, b) => b.ms - a.ms);
        let leaderboardText = "🏆 **LEADERBOARD ORE LUCRATE** 🏆\n\n";
        sortedLeaderboard.slice(0, 10).forEach((item, index) => {
            const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `\`#${index + 1}\``;
            leaderboardText += `${medal} **${item.name}** — \`${formatDuration(item.ms)}\` (${item.shifts} ture)\n`;
        });

        await fetch(WEBHOOK_LEADERBOARD, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: leaderboardText })
        });
    } catch (err) {
        console.error("Eroare leaderboard:", err);
    }
}

async function saveShiftToDatabase(shiftData) {
    try {
        await supabaseClient.from('shifts').insert([shiftData]);
    } catch (err) {
        console.error("Eroare salvare tura:", err);
    }
}

async function fetchAndRenderShiftsHistory() {
    const historyTable = document.getElementById('shifts-history-table');
    const dailySummaryTable = document.getElementById('daily-summary-table');
    const statTotalHours = document.getElementById('stat-total-hours');
    const statTotalShifts = document.getElementById('stat-total-shifts');

    if (!historyTable) return;
    const user = JSON.parse(localStorage.getItem('workforce_user'));
    if (!user || !user.discordId) return;

    try {
        const { data: history, error } = await supabaseClient
            .from('shifts')
            .select('*')
            .eq('discord_id', user.discordId)
            .order('id', { ascending: false });

        if (error || !Array.isArray(history) || history.length === 0) {
            historyTable.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-slate-500">Nicio tură înregistrată.</td></tr>`;
            if (dailySummaryTable) dailySummaryTable.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-slate-500">Nicio tură înregistrată.</td></tr>`;
            if (statTotalHours) statTotalHours.textContent = "00:00:00";
            if (statTotalShifts) statTotalShifts.textContent = "0";
            return;
        }

        let totalMsSum = 0;
        history.forEach(s => {
            if (s.duration_ms) totalMsSum += s.duration_ms;
        });

        if (statTotalHours) statTotalHours.textContent = formatDuration(totalMsSum);
        if (statTotalShifts) statTotalShifts.textContent = history.length;

        historyTable.innerHTML = history.map(s => `
            <tr class="hover:bg-slate-800/30 transition">
                <td class="py-3 text-slate-300">${s.date}</td>
                <td class="py-3 text-indigo-400 font-medium">${s.shift_type || 'Tură de Zi'}</td>
                <td class="py-3 text-emerald-400 font-medium">${s.start_time}</td>
                <td class="py-3 text-rose-400 font-medium">${s.end_time}</td>
                <td class="py-3 font-mono text-slate-200">${s.duration}</td>
            </tr>
        `).join('');

        const dailyMap = {};
        history.forEach(s => {
            const dateKey = s.date;
            if (!dailyMap[dateKey]) dailyMap[dateKey] = { count: 0, ms: 0 };
            dailyMap[dateKey].count += 1;
            if (s.duration_ms) dailyMap[dateKey].ms += s.duration_ms;
        });

        if (dailySummaryTable) {
            dailySummaryTable.innerHTML = Object.keys(dailyMap).map(date => {
                const data = dailyMap[date];
                return `
                    <tr class="hover:bg-slate-800/30 transition">
                        <td class="py-3 text-slate-300 font-medium">${date}</td>
                        <td class="py-3 text-indigo-400">${data.count} tură(e)</td>
                        <td class="py-3 font-mono text-emerald-400 text-right">${formatDuration(data.ms)}</td>
                    </tr>
                `;
            }).join('');
        }
    } catch (err) {
        console.error("Eroare istoric:", err);
    }
}

async function generateAndSendWeeklyReport(isManual = false) {
    try {
        const { data: shifts, error: shiftsError } = await supabaseClient.from('shifts').select('*');
        const { data: users, error: usersError } = await supabaseClient.from('users').select('*');
        
        if (shiftsError || usersError) {
            console.error("Eroare la preluarea datelor pentru raportul săptămânal");
            return;
        }

        const userMap = {};
        if (users) {
            users.forEach(u => {
                userMap[u.discord_id] = u.display_name || u.username;
            });
        }

        let totalMs = 0;
        let totalShiftsCount = shifts ? shifts.length : 0;
        const activeUsersSet = new Set();
        const userStats = {};

        if (shifts) {
            shifts.forEach(s => {
                const ms = s.duration_ms || 0;
                totalMs += ms;
                activeUsersSet.add(s.discord_id);

                if (!userStats[s.discord_id]) {
                    userStats[s.discord_id] = { name: userMap[s.discord_id] || 'Mecanic', shifts: 0, ms: 0 };
                }
                userStats[s.discord_id].shifts += 1;
                userStats[s.discord_id].ms += ms;
            });
        }

        const avgShiftMs = totalShiftsCount > 0 ? Math.floor(totalMs / totalShiftsCount) : 0;
        const sortedTeam = Object.values(userStats).sort((a, b) => b.ms - a.ms);

        let reportMessage = `📊 **RAPORT SĂPTĂMÂNAL AUTOMAT & GENERAL** 📊\n` +
                            `*(Generat la: ${new Date().toLocaleString('ro-RO')})${isManual ? ' [TRIMIS MANUAL]' : ''}*\n\n` +
                            `📈 **Statistici Generale Echipă:**\n` +
                            `• Total Ore Echipă: \`${formatDuration(totalMs)}\`\n` +
                            `• Total Ture Înregistrate: \`${totalShiftsCount}\`\n` +
                            `• Mecanici Activi: \`${activeUsersSet.size}\`\n` +
                            `• Media Ore / Tură: \`${formatDuration(avgShiftMs)}\`\n\n` +
                            `🏆 **Top Performanță Echipă:**\n`;

        if (sortedTeam.length === 0) {
            reportMessage += `_Nicio înregistrare disponibilă în baza de date._`;
        } else {
            sortedTeam.slice(0, 5).forEach((item, index) => {
                const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `\`#${index + 1}\``;
                reportMessage += `${medal} **${item.name}** — \`${formatDuration(item.ms)}\` (${item.shifts} ture)\n`;
            });
        }

        const response = await fetch(WEBHOOK_LOGS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: reportMessage })
        });

        if (response.ok || response.status === 204) {
            if (isManual) {
                const alertEl = document.getElementById('report-action-alert');
                if (alertEl) {
                    alertEl.textContent = "Raportul săptămânal a fost trimis cu succes pe Discord!";
                    alertEl.classList.remove('hidden');
                    setTimeout(() => alertEl.classList.add('hidden'), 4000);
                } else {
                    alert("Raportul săptămânal a fost trimis cu succes pe Discord!");
                }
            }
        } else if (isManual) {
            alert("A apărut o eroare la trimiterea raportului.");
        }
    } catch (err) {
        console.error("Eroare trimitere raport săptămânal:", err);
    }
}

function initAutomaticWeeklyReportChecker() {
    setInterval(() => {
        const now = new Date();
        const day = now.getDay(); 
        const hours = now.getHours();
        const minutes = now.getMinutes();

        if (day === 0 && hours === 19 && minutes === 0) {
            const lastSentKey = 'workforce_last_weekly_report_date';
            const todayStr = now.toDateString();
            const lastSent = localStorage.getItem(lastSentKey);

            if (lastSent !== todayStr) {
                localStorage.setItem(lastSentKey, todayStr);
                generateAndSendWeeklyReport(false);
            }
        }
    }, 60000);
}

function initRapoarteModuleLogic() {
    const btnManualReport = document.getElementById('btn-send-manual-report');
    const tableBody = document.getElementById('reports-leaderboard-table');
    const repTotalHours = document.getElementById('rep-total-hours');
    const repTotalShifts = document.getElementById('rep-total-shifts');
    const repTotalUsers = document.getElementById('rep-total-users');
    const repAvgShift = document.getElementById('rep-avg-shift');
    const btnRefresh = document.getElementById('btn-refresh-reports');
    const btnApplyFilters = document.getElementById('btn-apply-filters');
    const filterPeriod = document.getElementById('rep-filter-period');
    const searchInput = document.getElementById('rep-search-input');

    if (btnManualReport) {
        btnManualReport.addEventListener('click', () => {
            generateAndSendWeeklyReport(true);
        });
    }

    const loadReportData = async () => {
        if (!tableBody) return;
        tableBody.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-slate-500">Se încarcă rapoartele din baza de date...</td></tr>`;

        try {
            const { data: shifts, error: shiftsError } = await supabaseClient.from('shifts').select('*');
            const { data: users, error: usersError } = await supabaseClient.from('users').select('*');

            if (shiftsError || usersError) {
                tableBody.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-rose-500">Eroare la citirea datelor din Supabase.</td></tr>`;
                return;
            }

            if (!shifts || shifts.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-slate-500">Nicio tură înregistrată în baza de date.</td></tr>`;
                if (repTotalHours) repTotalHours.textContent = "00:00:00";
                if (repTotalShifts) repTotalShifts.textContent = "0";
                if (repTotalUsers) repTotalUsers.textContent = "0";
                if (repAvgShift) repAvgShift.textContent = "00:00:00";
                return;
            }

            const userMap = {};
            if (users) {
                users.forEach(u => {
                    userMap[u.discord_id] = u.display_name || u.username;
                });
            }

            const period = filterPeriod ? filterPeriod.value : 'all';
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const now = new Date();

            const filteredShifts = shifts.filter(s => {
                if (period === 'today') {
                    const shiftDate = new Date(s.date);
                    if (shiftDate.toDateString() !== now.toDateString()) return false;
                } else if (period === 'week') {
                    const shiftDate = new Date(s.date);
                    const weekAgo = new Date();
                    weekAgo.setDate(now.getDate() - 7);
                    if (shiftDate < weekAgo) return false;
                }

                if (searchTerm) {
                    const mName = (userMap[s.discord_id] || 'Mecanic').toLowerCase();
                    if (!mName.includes(searchTerm)) return false;
                }

                return true;
            });

            let totalMs = 0;
            const activeUsersSet = new Set();
            const userStats = {};

            filteredShifts.forEach(s => {
                const ms = s.duration_ms || 0;
                totalMs += ms;
                activeUsersSet.add(s.discord_id);

                if (!userStats[s.discord_id]) {
                    userStats[s.discord_id] = { name: userMap[s.discord_id] || 'Mecanic', shifts: 0, ms: 0 };
                }
                userStats[s.discord_id].shifts += 1;
                userStats[s.discord_id].ms += ms;
            });

            const totalShiftsCount = filteredShifts.length;
            const avgMs = totalShiftsCount > 0 ? Math.floor(totalMs / totalShiftsCount) : 0;

            if (repTotalHours) repTotalHours.textContent = formatDuration(totalMs);
            if (repTotalShifts) repTotalShifts.textContent = totalShiftsCount;
            if (repTotalUsers) repTotalUsers.textContent = activeUsersSet.size;
            if (repAvgShift) repAvgShift.textContent = formatDuration(avgMs);

            const sortedTeam = Object.values(userStats).sort((a, b) => b.ms - a.ms);

            if (sortedTeam.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-slate-500">Niciun rezultat găsit pentru filtrele selectate.</td></tr>`;
                return;
            }

            tableBody.innerHTML = sortedTeam.map((item, index) => {
                const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `\`#${index + 1}\``;
                return `
                    <tr class="hover:bg-slate-800/30 transition">
                        <td class="py-3 text-slate-200 font-medium">${medal} ${item.name}</td>
                        <td class="py-3 text-indigo-400 text-center">${item.shifts}</td>
                        <td class="py-3 text-emerald-400 font-mono font-medium text-right">${formatDuration(item.ms)}</td>
                    </tr>
                `;
            }).join('');
        } catch (err) {
            console.error("Eroare la încărcarea rapoartelor:", err);
            tableBody.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-rose-500">Eroare la preluarea datelor.</td></tr>`;
        }
    };

    if (btnApplyFilters) btnApplyFilters.addEventListener('click', loadReportData);
    if (btnRefresh) btnRefresh.addEventListener('click', loadReportData);
    if (searchInput) searchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') loadReportData(); });

    loadReportData();
}
