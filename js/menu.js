/* =====================================================================
   Módulo: Despensa + generador de menú semanal (3 tiempos)
   ---------------------------------------------------------------------
   Motor basado en reglas (sin IA):
   1. Traduce lo que escribes en la despensa a ingredientes canónicos.
   2. Filtra recetas según los ingredientes faltantes permitidos.
   3. Elige 7 desayunos, almuerzos y cenas evitando repeticiones,
      sin repetir el plato del día anterior y variando la proteína
      entre almuerzo y cena.
   4. Ajusta porciones (×0.75 – ×1.75) a tus calorías objetivo.
   Para conectar una IA en el futuro, reemplaza `generateWeek()`
   manteniendo el mismo formato de salida.
   ===================================================================== */
(function () {
  const SPLIT = { d: 0.25, a: 0.40, c: 0.35 };
  const LABEL = { d: "Desayuno", a: "Almuerzo", c: "Cena" };
  const STOP = new Set(["de", "la", "el", "los", "las", "con", "en", "y", "del", "al"]);
  const P = () => Store.get("pantry", { items: [], staples: true, missing: 1, kcal: "" });
  const M = () => Store.get("menu", null);

  /* ---------- Coincidencia de texto ---------- */
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ");
  const stem = (w) => (w.length > 4 && /[lnrdz]es$/.test(w) ? w.slice(0, -2) : w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w);
  const tokens = (s) => norm(s).split(/\s+/).filter((w) => w && !STOP.has(w)).map(stem);
  const INDEX = Object.entries(INGREDIENTS).flatMap(([canon, al]) => [canon, ...al].map((n) => ({ canon, t: tokens(n) })));

  /** Ingredientes canónicos que representa un texto de la despensa */
  function canonOf(item) {
    const it = new Set(tokens(item));
    return [...new Set(INDEX.filter((x) => x.t.length && x.t.every((w) => it.has(w))).map((x) => x.canon))];
  }

  function available() {
    const p = P(), s = new Set();
    p.items.forEach((i) => canonOf(i).forEach((c) => s.add(c)));
    if (p.staples) STAPLES.forEach((c) => s.add(c));
    return s;
  }
  const missingOf = (r, avail) => r.ing.filter((i) => !avail.has(i));

  /* ---------- Generador ---------- */
  function targetKcal() {
    const v = +P().kcal;
    if (v) return v;
    return Modules.health.targets()?.kcal || 2000;
  }
  const factor = (r, type, kcal) => Math.min(1.75, Math.max(0.75, Math.round((kcal * SPLIT[type]) / r.kcal * 4) / 4));

  function candidates(type, avail) {
    const allowed = +P().missing;
    return RECIPES.filter((r) => r.type === type && missingOf(r, avail).length <= allowed);
  }

  function pick(type, cands, avail, used, ctx) {
    let best = null, bestScore = Infinity;
    cands.forEach((r) => {
      if (ctx.exclude === r.id) return;
      let s = (used[r.id] || 0) * 10 + missingOf(r, avail).length * 3 + Math.random() * 2;
      if (ctx.yesterday === r.id) s += 8;
      if (ctx.avoidMain && r.main && ctx.avoidMain === r.main) s += 5;
      if (s < bestScore) { bestScore = s; best = r; }
    });
    return best;
  }

  function generateWeek() {
    const avail = available(), kcal = targetKcal(), used = {};
    const cands = { d: candidates("d", avail), a: candidates("a", avail), c: candidates("c", avail) };
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = {};
      ["d", "a", "c"].forEach((t) => {
        const r = pick(t, cands[t], avail, used, {
          yesterday: days[i - 1]?.[t]?.id,
          avoidMain: t === "c" ? RECIPES.find((x) => x.id === day.a?.id)?.main : null
        });
        if (r) { used[r.id] = (used[r.id] || 0) + 1; day[t] = { id: r.id, f: factor(r, t, kcal) }; }
        else day[t] = null;
      });
      days.push(day);
    }
    return { created: ymd(new Date()), kcal, days };
  }

  function swap(dayIdx, t) {
    const m = M(), avail = available(), used = {};
    m.days.forEach((d) => ["d", "a", "c"].forEach((k) => d[k] && (used[d[k].id] = (used[d[k].id] || 0) + 1)));
    const cur = m.days[dayIdx][t];
    const r = pick(t, candidates(t, avail), avail, used, {
      exclude: cur?.id, yesterday: m.days[dayIdx - 1]?.[t]?.id,
      avoidMain: t === "c" ? RECIPES.find((x) => x.id === m.days[dayIdx].a?.id)?.main : null
    });
    if (!r) return alert("No hay otra receta posible con tu despensa actual.");
    m.days[dayIdx][t] = { id: r.id, f: factor(r, t, m.kcal) };
    Store.save("menu"); render();
  }

  /* ---------- Render ---------- */
  function renderPantry() {
    const p = P();
    $("#pantryChips").innerHTML = p.items.map((it, i) => {
      const known = canonOf(it).length > 0;
      return `<span class="pchip" ${known ? "" : `style="background:var(--surface-2);color:var(--muted)" title="No está en la base de recetas"`}>${esc(it)}${known ? "" : " ?"}<button data-rm="${i}" aria-label="Quitar">×</button></span>`;
    }).join("") || `<span class="note">Tu despensa está vacía. Escribe lo que tienes en casa.</span>`;
    $("#pantryCount").textContent = p.items.length ? `${p.items.length} alimento(s) · "?" = no reconocido por la base` : "";

    const have = available();
    $("#quickAdd").innerHTML = Object.keys(INGREDIENTS).filter((k) => !have.has(k) && !STAPLES.includes(k))
      .map((k) => `<button data-q="${esc(k)}">+ ${esc(k)}</button>`).join("");

    $("#menuKcal").value = p.kcal;
    $("#menuKcal").placeholder = `${Modules.health.targets()?.kcal || 2000} (desde tu perfil)`;
    $("#menuMissing").value = p.missing;
    $("#menuStaples").checked = p.staples;

    const n = ["d", "a", "c"].map((t) => candidates(t, have).length);
    $("#menuInfo").innerHTML = `Recetas posibles con tu despensa: <b>${n[0]}</b> desayunos · <b>${n[1]}</b> almuerzos · <b>${n[2]}</b> cenas (base: ${RECIPES.length} recetas).` +
      (n.some((x) => x < 4) && p.missing < 2 ? ` <span style="color:var(--warn)">Poca variedad: agrega alimentos o permite más faltantes.</span>` : "");
  }

  function render() {
    renderPantry();
    const m = M(), grid = $("#menuGrid");
    if (!m) {
      grid.style.display = "block";
      grid.innerHTML = `<div class="alert info">Agrega tus alimentos y presiona <b>⟳ Generar menú</b>.</div>`;
      $("#shopList").innerHTML = "<li class='note'>—</li>";
      return;
    }
    grid.style.display = "";
    const avail = available(), start = parseYmd(m.created), prot = Modules.health.targets()?.protein;
    let html = `<div></div>` + m.days.map((_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return `<div class="mh">${DAYS[dowMon(d)]} ${d.getDate()}</div>`; }).join("");
    const shop = {};
    ["d", "a", "c"].forEach((t) => {
      html += `<div class="ml">${LABEL[t]}</div>`;
      m.days.forEach((day, i) => {
        const s = day[t], r = s && RECIPES.find((x) => x.id === s.id);
        if (!r) { html += `<div class="meal empty">Sin recetas posibles — agrega más alimentos</div>`; return; }
        const miss = missingOf(r, avail);
        miss.forEach((x) => (shop[x] = (shop[x] || 0) + 1));
        html += `<div class="meal" data-d="${i}" data-t="${t}">
          <button class="swap" data-swap title="Cambiar este plato">⟳</button>
          <b>${esc(r.name)}</b>
          <span class="m">×${s.f} · ${Math.round(r.kcal * s.f)} kcal · ${Math.round(r.p * s.f)} g prot</span>
          ${miss.length ? `<span class="miss">Falta: ${esc(miss.join(", "))}</span>` : ""}
        </div>`;
      });
    });
    html += `<div class="ml">Total</div>` + m.days.map((day) => {
      let k = 0, p = 0;
      ["d", "a", "c"].forEach((t) => { const r = day[t] && RECIPES.find((x) => x.id === day[t].id); if (r) { k += r.kcal * day[t].f; p += r.p * day[t].f; } });
      const ok = Math.abs(k - m.kcal) / m.kcal <= 0.1;
      return `<div class="daytot ${ok ? "ok" : "lo"}">${Math.round(k)} / ${m.kcal} kcal<br>${Math.round(p)}${prot ? " / " + prot : ""} g prot</div>`;
    }).join("");
    grid.innerHTML = html;

    const items = Object.entries(shop).sort((a, b) => b[1] - a[1]);
    $("#shopList").innerHTML = items.length
      ? items.map(([k, n]) => `<li>${esc(k)} <span class="note">(${n} plato${n > 1 ? "s" : ""})</span></li>`).join("")
      : `<li class="note">No necesitas comprar nada: todo sale de tu despensa ✓</li>`;
  }

  function openRecipe(day, t) {
    const s = M().days[day][t], r = RECIPES.find((x) => x.id === s.id), avail = available(), p = P();
    $("#recipeBody").innerHTML = `
      <div class="eyebrow">${LABEL[t]} · ${r.min} min</div>
      <h3 style="margin:.3em 0">${esc(r.name)}</h3>
      <p class="mono note" style="margin:0">Porción ×${s.f} → ${Math.round(r.kcal * s.f)} kcal · ${Math.round(r.p * s.f)} g proteína</p>
      <h4 style="margin:14px 0 6px;font-size:.9rem">Ingredientes</h4>
      <ul class="recipe-ing" style="margin:0;padding-left:18px">${r.ing.map((i) => {
        const staple = STAPLES.includes(i) && p.staples;
        const cls = staple ? "staple" : avail.has(i) ? "have" : "missing";
        return `<li class="${cls}">${esc(i)} ${cls === "have" ? "✓" : cls === "missing" ? "— falta" : "(básico)"}</li>`;
      }).join("")}<li class="staple">sal y pimienta al gusto</li></ul>
      <h4 style="margin:14px 0 6px;font-size:.9rem">Preparación</h4>
      <ol style="margin:0;padding-left:18px">${r.steps.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
      ${s.f !== 1 ? `<p class="note">Multiplica las cantidades por ${s.f} para ajustarte a tus calorías.</p>` : ""}`;
    $("#recipeDlg").showModal();
  }

  /* ---------- Eventos ---------- */
  $("#ingList").innerHTML = Object.entries(INGREDIENTS).flatMap(([k, a]) => [k, ...a]).map((x) => `<option value="${esc(x)}">`).join("");

  function addItems(text) {
    const p = P();
    text.split(/[,;\n]/).map((s) => s.trim().toLowerCase()).filter(Boolean).forEach((s) => { if (!p.items.includes(s)) p.items.push(s); });
    Store.save("pantry"); render();
  }
  $("#pantryAdd").onclick = () => { addItems($("#pantryInput").value); $("#pantryInput").value = ""; $("#pantryInput").focus(); };
  $("#pantryInput").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $("#pantryAdd").click(); } });
  $("#pantryChips").onclick = (e) => { const b = e.target.closest("[data-rm]"); if (!b) return; P().items.splice(+b.dataset.rm, 1); Store.save("pantry"); render(); };
  $("#quickAdd").onclick = (e) => { const b = e.target.closest("[data-q]"); if (b) addItems(b.dataset.q); };
  $("#pantryClear").onclick = () => { if (confirm("¿Vaciar toda la despensa?")) { P().items = []; Store.save("pantry"); render(); } };

  $("#menuKcal").onchange = (e) => { P().kcal = e.target.value; Store.save("pantry"); };
  $("#menuMissing").onchange = (e) => { P().missing = +e.target.value; Store.save("pantry"); render(); };
  $("#menuStaples").onchange = (e) => { P().staples = e.target.checked; Store.save("pantry"); render(); };

  $("#genMenu").onclick = () => {
    if (!P().items.length) return alert("Primero agrega los alimentos que tienes.");
    Store.cache.menu = generateWeek(); Store.save("menu"); render();
  };

  $("#menuGrid").addEventListener("click", (e) => {
    const cell = e.target.closest(".meal[data-d]"); if (!cell) return;
    if (e.target.closest("[data-swap]")) swap(+cell.dataset.d, cell.dataset.t);
    else openRecipe(+cell.dataset.d, cell.dataset.t);
  });

  Modules.menu = { render };
})();
