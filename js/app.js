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
  let email = "", entered = false, pollTimer = null;
  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const RSA = { name: "RSA-OAEP", hash: "SHA-256" };

  // Error devuelto por un enlace vencido o ya usado (#error_description=...)
  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.get("error_description")) loginMsg("El enlace no es válido o ya venció. Pide uno nuevo.", "err");

  // ?approve=<id>: este enlace se pidió desde otro dispositivo
  let approveId = new URLSearchParams(location.search).get("approve");
  let pendingHere = null;
  try { pendingHere = localStorage.getItem("fz-login-request"); } catch (_) {}
  if (approveId && approveId === pendingHere) approveId = null; // se abrió en el mismo navegador: entrar normal

  const enter = async (session) => {
    if (!session || entered || approveId) return;
    entered = true;
    clearInterval(pollTimer);
    try { localStorage.removeItem("fz-login-request"); } catch (_) {}
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
  if (location.hash || location.search) history.replaceState(null, "", location.pathname);
  if (data.session && approveId) return showApprove(data.session);
  if (data.session) return enter(data.session);

  if (location.protocol === "file:") {
    loginMsg("Para iniciar sesión abre la página desde un servidor (localhost) o desde GitHub Pages, no con doble clic.", "err");
  }

  /* ----- Autorización desde otro dispositivo -----
     La PC genera un par de claves RSA; la privada nunca sale de esta ventana.
     El celular cifra su token de sesión con la clave pública y la PC lo descifra. */
  async function createRequest() {
    const keys = await crypto.subtle.generateKey({ ...RSA, modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]) }, false, ["encrypt", "decrypt"]);
    const id = crypto.randomUUID();
    const pub = b64(await crypto.subtle.exportKey("spki", keys.publicKey));
    const { error } = await sb.rpc("create_login_request", { p_id: id, p_public_key: pub });
    if (error) throw error;
    return { id, privateKey: keys.privateKey };
  }

  function waitForApproval(req) {
    const until = Date.now() + 15 * 60e3;
    clearInterval(pollTimer);
    pollTimer = setInterval(async () => {
      if (entered || Date.now() > until) {
        clearInterval(pollTimer);
        if (!entered) loginMsg("La solicitud venció. Pide un enlace nuevo.", "err");
        return;
      }
      const { data: payload } = await sb.rpc("poll_login_request", { p_id: req.id });
      if (!payload) return;
      clearInterval(pollTimer);
      try {
        const refresh_token = new TextDecoder().decode(await crypto.subtle.decrypt(RSA, req.privateKey, unb64(payload)));
        const { data: s, error } = await sb.auth.refreshSession({ refresh_token });
        if (error) throw error;
        enter(s.session);
      } catch (e) {
        console.error(e);
        loginMsg("No se pudo completar el inicio de sesión. Pide un enlace nuevo.", "err");
      }
    }, 3000);
  }

  function showApprove(session) {
    $("#stepEmail").hidden = true;
    $("#stepApprove").hidden = false;
    $("#approveEmail").textContent = session.user.email;
    const id = approveId;

    $("#approveHere").onclick = () => { approveId = null; enter(session); };
    $("#approveBtn").onclick = async () => {
      $("#approveBtn").disabled = true;
      try {
        sb.auth.stopAutoRefresh();
        const { data: pub, error } = await sb.rpc("get_login_request_key", { p_id: id });
        if (error) throw error;
        if (!pub) { loginMsg("La solicitud venció o ya fue usada. Pide un enlace nuevo desde el otro dispositivo.", "err"); return; }
        const key = await crypto.subtle.importKey("spki", unb64(pub), RSA, false, ["encrypt"]);
        const payload = b64(await crypto.subtle.encrypt(RSA, key, new TextEncoder().encode(session.refresh_token)));
        const { data: ok, error: e2 } = await sb.rpc("complete_login_request", { p_id: id, p_payload: payload });
        if (e2) throw e2;
        if (!ok) { loginMsg("La solicitud venció o ya fue usada.", "err"); return; }
        // Entregamos la sesión: se borra de este dispositivo SIN cerrarla en el servidor
        // (signOut la invalidaría también en la PC).
        Object.keys(localStorage).filter((k) => k.startsWith("sb-") && k.endsWith("-auth-token")).forEach((k) => localStorage.removeItem(k));
        $("#approveActions").hidden = true;
        loginMsg("✓ Listo. La sesión se abrirá en tu otro dispositivo. Ya puedes cerrar esta ventana.", "ok");
      } catch (e) {
        console.error(e);
        loginMsg("No se pudo autorizar: " + (e.message || e), "err");
      } finally {
        $("#approveBtn").disabled = false;
      }
    };
  }

  $("#sendCode").onclick = async () => {
    email = $("#loginEmail").value.trim();
    if (!email) return loginMsg("Escribe tu correo.", "err");
    // No revelamos si el correo es el autorizado; simplemente no se envía nada a otros.
    $("#sendCode").disabled = true;
    let redirect = location.origin + location.pathname, req = null;
    if (isOwner(email)) {
      try {
        req = await createRequest();
        redirect += "?approve=" + req.id;
        try { localStorage.setItem("fz-login-request", req.id); } catch (_) {}
      } catch (e) {
        console.warn("Autorización remota no disponible (¿falta ejecutar supabase/login-requests.sql?)", e);
      }
    }
    const { error } = isOwner(email)
      ? await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: redirect } })
      : { error: null };
    $("#sendCode").disabled = false;
    if (error) return loginMsg("No se pudo enviar el correo: " + error.message, "err");
    $("#stepEmail").hidden = true; $("#stepCode").hidden = false;
    if (req) {
      waitForApproval(req);
      loginMsg("Te enviamos un enlace. Ábrelo en cualquier dispositivo (por ejemplo tu celular) y esta ventana entrará sola. Esperando…", "ok");
    } else {
      loginMsg("Si el correo está autorizado, te llegará un enlace. Ábrelo en este mismo dispositivo.", "ok");
    }
  };
  $("#loginEmail").addEventListener("keydown", (e) => e.key === "Enter" && $("#sendCode").click());

  $("#verifyCode").onclick = async () => {
    const token = $("#loginCode").value.trim();
    const { data, error } = await sb.auth.verifyOtp({ email, token, type: "email" });
    if (error) return loginMsg("Código inválido o vencido.", "err");
    enter(data.session);
  };
  $("#loginCode").addEventListener("keydown", (e) => e.key === "Enter" && $("#verifyCode").click());
  $("#backEmail").onclick = () => { clearInterval(pollTimer); $("#stepEmail").hidden = false; $("#stepCode").hidden = true; loginMsg(""); };
})();

if (!CONFIGURED) $("#logoutBtn").onclick = () => location.reload();
