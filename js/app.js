/* =====================================================================
   Núcleo del área privada: autenticación, almacenamiento y navegación
   ===================================================================== */
const CFG = window.APP_CONFIG || {};
const CONFIGURED = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase);
const IS_LOCAL_HOST = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);

/* ---------- Utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseYmd = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const fromMin = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const DAYS_LONG = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
/** Lunes = 0 … Domingo = 6 */
const dowMon = (d) => (d.getDay() + 6) % 7;

$$("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  if (dark) document.documentElement.dataset.theme = "dark"; else delete document.documentElement.dataset.theme;
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (_) {}
}));

$$("dialog").forEach((dlg) => dlg.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) dlg.close(); }));

/* ---------- Almacenamiento (Supabase o local) ---------- */
const Store = {
  mode: null, sb: null, user: null, cache: {}, timers: {}, pending: 0,

  async init(mode, sb, user) {
    this.mode = mode; this.sb = sb; this.user = user;
    if (mode === "local") {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith("fz:")) try { this.cache[k.slice(3)] = JSON.parse(localStorage.getItem(k)); } catch (_) {}
      }
    } else {
      const { data, error } = await sb.from("modules").select("key,data");
      if (error) throw error;
      data.forEach((r) => (this.cache[r.key] = r.data));
    }
  },

  get(key, def) {
    if (this.cache[key] === undefined) this.cache[key] = structuredClone(def);
    return this.cache[key];
  },

  /** Guarda con un pequeño retraso para agrupar cambios seguidos */
  save(key) {
    clearTimeout(this.timers[key]);
    setSync("guardando…");
    this.timers[key] = setTimeout(() => this.flush(key), 600);
  },

  async flush(key) {
    delete this.timers[key];
    const val = this.cache[key];
    try {
      if (this.mode === "local") localStorage.setItem("fz:" + key, JSON.stringify(val));
      else {
        const { error } = await this.sb.from("modules").upsert(
          { user_id: this.user.id, key, data: val, updated_at: new Date().toISOString() },
          { onConflict: "user_id,key" });
        if (error) throw error;
      }
      setSync(this.mode === "local" ? "● guardado local" : "● sincronizado");
    } catch (e) {
      console.error(e);
      setSync("⚠ error al guardar");
    }
  }
};
function setSync(t) { $("#syncState").textContent = t; }
window.addEventListener("beforeunload", () => Object.keys(Store.timers).forEach((k) => { clearTimeout(Store.timers[k]); if (Store.mode === "local") Store.flush(k); }));

/* ---------- Navegación entre módulos ---------- */
const Modules = {};   // cada módulo registra { render() }
function showView(name) {
  $$(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
  try { localStorage.setItem("fz-view", name); } catch (_) {}
  Modules[name]?.render();
}
$$(".nav-item").forEach((b) => b.addEventListener("click", () => showView(b.dataset.view)));

async function startApp(mode, sb, user) {
  try {
    await Store.init(mode, sb, user);
  } catch (e) {
    loginMsg("No se pudo leer la base de datos: " + e.message, "err");
    return;
  }
  $("#loginView").hidden = true;
  $("#appView").hidden = false;
  $("#userLabel").textContent = mode === "local" ? "modo local" : user.email;
  setSync(mode === "local" ? "● guardado local" : "● sincronizado");
  let v = "schedule";
  try { v = localStorage.getItem("fz-view") || v; } catch (_) {}
  showView(Modules[v] ? v : "schedule");
}

/* ---------- Autenticación ---------- */
function loginMsg(t, cls = "") { const m = $("#loginMsg"); m.textContent = t; m.className = "msg " + cls; }
const isOwner = (email) => !CFG.OWNER_EMAIL || (email || "").toLowerCase() === CFG.OWNER_EMAIL.toLowerCase();

(async function auth() {
  if (!CONFIGURED) {
    $("#stepEmail").hidden = true;
    if (IS_LOCAL_HOST) {
      $("#localBox").hidden = false;
      $("#localBtn").onclick = () => startApp("local", null, null);
    } else {
      loginMsg("El acceso aún no está configurado.", "err");
    }
    return;
  }

  // flowType "implicit": el enlace del correo funciona aunque lo abras en otro navegador o en el celular
  const sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, {
    auth: { flowType: "implicit", detectSessionInUrl: true, persistSession: true }
  });
  let email = "", entered = false;

  // Error devuelto por un enlace vencido o ya usado (#error_description=...)
  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.get("error_description")) loginMsg("El enlace no es válido o ya venció. Pide uno nuevo.", "err");

  const enter = async (session) => {
    if (!session || entered) return;
    entered = true;
    if (!isOwner(session.user.email)) {
      entered = false;
      await sb.auth.signOut();
      loginMsg("Este correo no tiene acceso.", "err");
      return;
    }
    startApp("cloud", sb, session.user);
  };

  $("#logoutBtn").onclick = async () => { await sb.auth.signOut(); location.reload(); };

  // Si el enlace se abre en otra pestaña del mismo navegador, esta también entra
  sb.auth.onAuthStateChange((_event, session) => { if (session) enter(session); });

  const { data } = await sb.auth.getSession();   // aquí Supabase ya leyó el token del enlace
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  if (data.session) return enter(data.session);

  if (location.protocol === "file:") {
    loginMsg("Para iniciar sesión abre la página desde un servidor (localhost) o desde GitHub Pages, no con doble clic.", "err");
  }

  $("#sendCode").onclick = async () => {
    email = $("#loginEmail").value.trim();
    if (!email) return loginMsg("Escribe tu correo.", "err");
    // No revelamos si el correo es el autorizado; simplemente no se envía nada a otros.
    $("#sendCode").disabled = true;
    const { error } = isOwner(email)
      ? await sb.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname }
        })
      : { error: null };
    $("#sendCode").disabled = false;
    if (error) return loginMsg("No se pudo enviar el correo: " + error.message, "err");
    $("#stepEmail").hidden = true; $("#stepCode").hidden = false;
    loginMsg("Si el correo está autorizado, te llegará un enlace. Ábrelo y entrarás directamente.", "ok");
  };
  $("#loginEmail").addEventListener("keydown", (e) => e.key === "Enter" && $("#sendCode").click());

  $("#verifyCode").onclick = async () => {
    const token = $("#loginCode").value.trim();
    const { data, error } = await sb.auth.verifyOtp({ email, token, type: "email" });
    if (error) return loginMsg("Código inválido o vencido.", "err");
    enter(data.session);
  };
  $("#loginCode").addEventListener("keydown", (e) => e.key === "Enter" && $("#verifyCode").click());
  $("#backEmail").onclick = () => { $("#stepEmail").hidden = false; $("#stepCode").hidden = true; loginMsg(""); };
})();

if (!CONFIGURED) $("#logoutBtn").onclick = () => location.reload();
