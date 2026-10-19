/* =====================================================================
   Módulo: Registro corporal (peso, talla, cintura, % grasa) y metas
   ===================================================================== */
(function () {
  const H = () => Store.get("health", {
    profile: { sex: "m", age: "", height: "", activity: "1.375", deficit: 400, protein: 2.0, goalWeight: "" },
    entries: []
  });
  const sorted = () => H().entries.slice().sort((a, b) => a.date.localeCompare(b.date));
  const latest = () => sorted().at(-1);

  function bmi(w, hcm) { return w && hcm ? w / ((hcm / 100) ** 2) : null; }
  function bmiCat(b) { return b < 18.5 ? ["Bajo peso", "bad"] : b < 25 ? ["Normal", "good"] : b < 30 ? ["Sobrepeso", "bad"] : ["Obesidad", "bad"]; }

  /** Metas diarias: Mifflin-St Jeor × actividad − déficit; proteína por kg; grasa 0.8 g/kg; resto carbohidratos */
  function targets() {
    const p = H().profile, e = latest();
    if (!e || !p.height || !p.age) return null;
    const w = +e.weight, bmr = 10 * w + 6.25 * +p.height - 5 * +p.age + (p.sex === "f" ? -161 : 5);
    const tdee = bmr * +p.activity;
    const kcal = Math.round((tdee - +p.deficit) / 10) * 10;
    const protein = Math.round(w * +p.protein), fat = Math.round(w * 0.8);
    const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), kcal, protein, fat, carbs };
  }

  function kpi(l, v, unit, s = "", cls = "") {
    return `<div class="card kpi"><div class="l">${l}</div><div class="v">${v}<small> ${unit}</small></div><div class="s ${cls}">${s}</div></div>`;
  }

  function render() {
    const { profile: p } = H();
    const list = sorted(), e = list.at(-1), first = list[0];
    const f = $("#profileForm");
    Object.entries(p).forEach(([k, v]) => f.elements[k] && (f.elements[k].value = v));
    $("#entryForm").elements.date.value ||= ymd(new Date());

    let k = "";
    if (e) {
      const d = first !== e ? (e.weight - first.weight) : 0;
      k += kpi("Peso actual", (+e.weight).toFixed(1), "kg", list.length > 1 ? `${d > 0 ? "+" : ""}${d.toFixed(1)} kg desde ${first.date}` : e.date, d < 0 ? "good" : "");
      const b = bmi(+e.weight, +p.height);
      if (b) { const [c, cls] = bmiCat(b); k += kpi("IMC", b.toFixed(1), "kg/m²", c, cls); }
      if (e.waist && p.height) {
        const r = e.waist / p.height;
        k += kpi("Cintura / talla", r.toFixed(2), "", r < 0.5 ? "Riesgo bajo (< 0.50)" : "Meta: < 0.50", r < 0.5 ? "good" : "bad");
      }
      const lastFat = list.filter((x) => x.fat).at(-1);
      if (lastFat) k += kpi("% grasa", (+lastFat.fat).toFixed(1), "%", lastFat.date);
      if (p.goalWeight) {
        const left = e.weight - p.goalWeight;
        k += kpi("Meta", (+p.goalWeight).toFixed(1), "kg", left > 0 ? `faltan ${left.toFixed(1)} kg` : "¡meta alcanzada!", left > 0 ? "" : "good");
      }
    } else {
      k = `<div class="alert info" style="grid-column:1/-1">Registra tu primer peso y completa tu perfil (edad y talla) para ver tus métricas y metas.</div>`;
    }
    $("#kpis").innerHTML = k;

    const t = targets();
    $("#targets").innerHTML = t ? `
      <div class="kpi" style="padding:0"><div class="l">Calorías objetivo / día</div><div class="v">${t.kcal}<small> kcal</small></div>
      <div class="s">Metabolismo basal ${t.bmr} · gasto total ${t.tdee} kcal</div></div>
      <div class="macro"><span style="flex:${t.protein * 4};background:var(--accent)"></span><span style="flex:${t.carbs * 4};background:#f4a261"></span><span style="flex:${t.fat * 9};background:#8338ec"></span></div>
      <div class="note mono">■ <span style="color:var(--ink);font-weight:600">Proteína ${t.protein} g</span> · <span style="color:#f4a261">Carbohidratos ${t.carbs} g</span> · <span style="color:#8338ec">Grasa ${t.fat} g</span></div>
      <p class="note">Para recomposición corporal: prioriza la proteína, entrena fuerza 3–4 veces por semana y duerme 7–9 h. Un ritmo saludable es perder alrededor de 0.25–0.75 kg por semana.</p>`
      : `<p class="note">Completa edad y talla, y registra un peso para calcular tus metas.</p>`;

    $("#entryTable").innerHTML = list.length ? `<tr><th>Fecha</th><th>Peso</th><th>IMC</th><th>Cintura</th><th>% grasa</th><th></th></tr>` +
      list.slice().reverse().map((x) => {
        const b = bmi(+x.weight, +p.height);
        return `<tr><td>${x.date}</td><td>${(+x.weight).toFixed(1)}</td><td>${b ? b.toFixed(1) : "—"}</td><td>${x.waist || "—"}</td><td>${x.fat || "—"}</td>
          <td><button class="btn sm ghost danger" data-del="${x.id}">✕</button></td></tr>`;
      }).join("") : "";
    drawChart();
  }

  function drawChart() {
    const metric = $("#chartMetric").value;
    const pts = sorted().filter((x) => x[metric]).map((x) => ({ t: parseYmd(x.date).getTime(), y: +x[metric], d: x.date }));
    const svg = $("#chart"), W = 640, Hh = 240, L = 40, R = 12, T = 12, B = 26;
    if (pts.length < 1) { svg.innerHTML = `<text x="${W / 2}" y="${Hh / 2}" text-anchor="middle">Sin datos todavía</text>`; return; }
    const goal = metric === "weight" && H().profile.goalWeight ? +H().profile.goalWeight : null;
    let ys = pts.map((p) => p.y); if (goal) ys.push(goal);
    let y0 = Math.min(...ys), y1 = Math.max(...ys); const padY = Math.max(1, (y1 - y0) * .15); y0 -= padY; y1 += padY;
    const t0 = pts[0].t, t1 = pts.at(-1).t === t0 ? t0 + 864e5 : pts.at(-1).t;
    const X = (t) => L + (t - t0) / (t1 - t0) * (W - L - R), Y = (y) => T + (1 - (y - y0) / (y1 - y0)) * (Hh - T - B);
    let g = `<g class="grid">`;
    for (let i = 0; i <= 4; i++) { const v = y0 + (y1 - y0) * i / 4; g += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${L - 6}" y="${Y(v) + 3}" text-anchor="end">${v.toFixed(1)}</text>`; }
    g += `</g>`;
    const labels = [pts[0], pts[Math.floor(pts.length / 2)], pts.at(-1)].filter((p, i, a) => a.indexOf(p) === i)
      .map((p) => `<text x="${X(p.t)}" y="${Hh - 8}" text-anchor="middle">${p.d.slice(5)}</text>`).join("");
    const line = pts.length > 1 ? `<polyline class="ln" points="${pts.map((p) => `${X(p.t)},${Y(p.y)}`).join(" ")}"/>` : "";
    const goalLn = goal ? `<line class="ln2" x1="${L}" x2="${W - R}" y1="${Y(goal)}" y2="${Y(goal)}"/><text x="${W - R}" y="${Y(goal) - 4}" text-anchor="end" style="fill:var(--warn)">meta ${goal}</text>` : "";
    const dots = pts.map((p) => `<circle class="pt" cx="${X(p.t)}" cy="${Y(p.y)}" r="3.5"><title>${p.d}: ${p.y}</title></circle>`).join("");
    svg.innerHTML = g + goalLn + line + dots + labels;
  }

  $("#chartMetric").onchange = drawChart;

  $("#entryForm").onsubmit = (e) => {
    e.preventDefault();
    const f = e.target, h = H();
    const entry = { id: uid(), date: f.elements.date.value, weight: +f.elements.weight.value, waist: f.elements.waist.value ? +f.elements.waist.value : null, fat: f.elements.fat.value ? +f.elements.fat.value : null };
    const same = h.entries.findIndex((x) => x.date === entry.date);
    if (same >= 0 && !confirm("Ya hay un registro en esa fecha. ¿Reemplazarlo?")) return;
    if (same >= 0) h.entries.splice(same, 1);
    h.entries.push(entry);
    f.elements.weight.value = f.elements.waist.value = f.elements.fat.value = "";
    Store.save("health"); render();
  };

  $("#entryTable").onclick = (e) => {
    const b = e.target.closest("[data-del]"); if (!b || !confirm("¿Eliminar este registro?")) return;
    const h = H(); h.entries = h.entries.filter((x) => x.id !== b.dataset.del);
    Store.save("health"); render();
  };

  $("#profileForm").onsubmit = (e) => {
    e.preventDefault();
    const f = e.target, p = H().profile;
    Object.keys(p).forEach((k) => f.elements[k] && (p[k] = f.elements[k].value));
    Store.save("health"); render();
  };

  Modules.health = { render, targets };
})();
