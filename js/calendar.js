/* =====================================================================
   Módulo: Calendario de actividades importantes
   Datos: [{id,title,date,time,cat,course,notes,done}]
   ===================================================================== */
(function () {
  const CATS = {
    exam: { n: "Examen", c: "#e63946" },
    deliver: { n: "Entrega", c: "#f4a261" },
    present: { n: "Exposición", c: "#8338ec" },
    lab: { n: "Laboratorio", c: "#0a9396" },
    meeting: { n: "Reunión", c: "#3a86ff" },
    personal: { n: "Personal", c: "#6a994e" },
    other: { n: "Otro", c: "#6c757d" }
  };
  const E = () => Store.get("events", []);
  let cursor = new Date(); cursor.setDate(1);
  let editing = null;

  $("#eventCat").innerHTML = Object.entries(CATS).map(([k, v]) => `<option value="${k}">${v.n}</option>`).join("");
  $("#calCats").innerHTML = Object.values(CATS).map((v) => `<span class="chip" style="background:${v.c}">${v.n}</span>`).join("");

  const sortEv = (a, b) => (a.date + (a.time || "99")).localeCompare(b.date + (b.time || "99"));

  function render() {
    const y = cursor.getFullYear(), m = cursor.getMonth();
    $("#calTitle").textContent = `${MONTHS[m]} ${y}`;
    const first = new Date(y, m, 1);
    const start = new Date(first); start.setDate(1 - dowMon(first));
    const today = ymd(new Date());
    const byDate = {};
    E().slice().sort(sortEv).forEach((e) => (byDate[e.date] ||= []).push(e));

    let html = DAYS.map((d) => `<div class="dow">${d}</div>`).join("");
    for (let i = 0; i < 42; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      if (i === 35 && d.getMonth() !== m) break;
      const key = ymd(d), list = byDate[key] || [];
      html += `<div class="cell ${d.getMonth() !== m ? "out" : ""} ${key === today ? "today" : ""}" data-date="${key}">
        <span class="n">${d.getDate()}</span>
        ${list.slice(0, 3).map((e) => `<div class="chip ${e.done ? "done" : ""}" data-id="${e.id}" style="background:${CATS[e.cat]?.c || "#666"}" title="${esc(e.title)}">${e.time ? e.time + " " : ""}${esc(e.title)}</div>`).join("")}
        ${list.length > 3 ? `<span class="note">+${list.length - 3} más</span>` : ""}
      </div>`;
    }
    $("#cal").innerHTML = html;
    renderUpcoming();
  }

  function renderUpcoming() {
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const t1 = new Date(t0.getTime() + 14 * 864e5);
    const list = E().filter((e) => !e.done && parseYmd(e.date) >= t0 && parseYmd(e.date) <= t1).sort(sortEv);
    const courses = Modules.schedule.courses();
    $("#upcoming").innerHTML = list.map((e) => {
      const d = parseYmd(e.date), days = Math.round((d - t0) / 864e5);
      const when = days === 0 ? "hoy" : days === 1 ? "mañana" : `en ${days} días`;
      const course = courses.find((c) => c.id === e.course);
      return `<div class="up" data-id="${e.id}">
        <div class="d" style="background:${CATS[e.cat]?.c}"><big>${d.getDate()}</big>${MONTHS[d.getMonth()].slice(0, 3)}</div>
        <div><div class="t">${esc(e.title)}</div><div class="c">${CATS[e.cat]?.n} · ${when}${e.time ? " · " + e.time : ""}${course ? " · " + esc(course.name) : ""}</div></div>
      </div>`;
    }).join("") || `<p class="note">Nada pendiente en los próximos 14 días. 🎉</p>`;
  }

  function openEvent(idOrNull, date) {
    const ev = idOrNull ? E().find((e) => e.id === idOrNull) : null;
    editing = ev ? { ...ev } : { id: uid(), title: "", date: date || ymd(new Date()), time: "", cat: "exam", course: "", notes: "", done: false };
    const f = $("#eventForm");
    $("#eventCourse").innerHTML = `<option value="">—</option>` + Modules.schedule.courses().map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
    ["title", "date", "time", "cat", "course", "notes"].forEach((k) => (f.elements[k].value = editing[k] || ""));
    f.elements.done.checked = !!editing.done;
    $("#eventDlgTitle").textContent = ev ? "Editar actividad" : "Nueva actividad";
    $("#delEvent").hidden = !ev;
    if (ev) { const d = parseYmd(ev.date); cursor = new Date(d.getFullYear(), d.getMonth(), 1); render(); }
    $("#eventDlg").showModal();
  }

  $("#eventForm").onsubmit = (e) => {
    const f = e.target;
    Object.assign(editing, { title: f.elements.title.value.trim(), date: f.elements.date.value, time: f.elements.time.value, cat: f.elements.cat.value, course: f.elements.course.value, notes: f.elements.notes.value.trim(), done: f.elements.done.checked });
    const list = E(), i = list.findIndex((x) => x.id === editing.id);
    if (i >= 0) list[i] = editing; else list.push(editing);
    Store.save("events"); render();
  };
  $("#delEvent").onclick = () => {
    if (!confirm(`¿Eliminar "${editing.title}"?`)) return;
    Store.cache.events = E().filter((x) => x.id !== editing.id);
    Store.save("events"); $("#eventDlg").close(); render();
  };

  $("#cal").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) return openEvent(chip.dataset.id);
    const cell = e.target.closest(".cell");
    if (cell) openEvent(null, cell.dataset.date);
  });
  $("#upcoming").addEventListener("click", (e) => { const u = e.target.closest(".up"); if (u) openEvent(u.dataset.id); });
  $("#addEvent").onclick = () => openEvent(null);
  $("#calPrev").onclick = () => { cursor.setMonth(cursor.getMonth() - 1); render(); };
  $("#calNext").onclick = () => { cursor.setMonth(cursor.getMonth() + 1); render(); };
  $("#calToday").onclick = () => { cursor = new Date(); cursor.setDate(1); render(); };

  Modules.calendar = { render, openEvent };
})();
