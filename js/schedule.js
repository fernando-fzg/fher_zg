/* =====================================================================
   Módulo: Horario semanal editable
   Datos: { courses:[{id,name,type,room,prof,color,blocks:[{day,start,end}]}], settings }
   ===================================================================== */
(function () {
  const HOUR = 52; // px por hora
  const PALETTE = ["#0a9396", "#3a86ff", "#8338ec", "#e76f51", "#2a9d8f", "#f4a261", "#d62828", "#457b9d", "#6a994e", "#bc6c25"];
  const S = () => Store.get("schedule", { courses: [], settings: { startHour: 7, endHour: 22, sunday: false } });

  let editing = null; // curso en edición

  function weekStart(d = new Date()) { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - dowMon(x)); return x; }

  function findConflicts(courses) {
    const byDay = {};
    courses.forEach((c) => c.blocks.forEach((b, i) => (byDay[b.day] ||= []).push({ c, b, key: c.id + ":" + i })));
    const bad = new Set(), msgs = [];
    Object.entries(byDay).forEach(([day, list]) => {
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
        const A = list[i], B = list[j];
        if (toMin(A.b.start) < toMin(B.b.end) && toMin(B.b.start) < toMin(A.b.end)) {
          bad.add(A.key); bad.add(B.key);
          msgs.push(`${DAYS_LONG[day]}: <b>${esc(A.c.name)}</b> (${A.b.start}–${A.b.end}) se cruza con <b>${esc(B.c.name)}</b> (${B.b.start}–${B.b.end})`);
        }
      }
    });
    return { bad, msgs };
  }

  function render() {
    const { courses, settings } = S();
    const nDays = settings.sunday ? 7 : 6;
    const h0 = settings.startHour, h1 = settings.endHour, H = (h1 - h0) * HOUR;
    const grid = $("#sched");
    grid.style.gridTemplateColumns = `48px repeat(${nDays}, 1fr)`;
    grid.style.setProperty("--hour", HOUR + "px");

    const ws = weekStart();
    const todayIdx = dowMon(new Date());
    const events = Store.get("events", []);
    const weekEvents = events.filter((e) => { const d = parseYmd(e.date); return d >= ws && d < new Date(ws.getTime() + 7 * 864e5); });

    let html = `<div class="hcell"></div>`;
    for (let d = 0; d < nDays; d++) {
      const date = new Date(ws); date.setDate(ws.getDate() + d);
      const dayEv = weekEvents.filter((e) => dowMon(parseYmd(e.date)) === d);
      const dot = dayEv.length ? ` <span title="${esc(dayEv.map((e) => e.title).join(" · "))}" style="color:var(--signal)">●${dayEv.length}</span>` : "";
      html += `<div class="hcell">${DAYS[d]} ${date.getDate()}${dot}</div>`;
    }
    html += `<div class="times" style="height:${H}px">`;
    for (let h = h0; h <= h1; h++) html += `<div style="top:${(h - h0) * HOUR}px">${pad(h)}:00</div>`;
    html += `</div>`;

    const { bad, msgs } = findConflicts(courses);
    for (let d = 0; d < nDays; d++) {
      html += `<div class="day ${d === todayIdx ? "today" : ""}" data-day="${d}" style="height:${H}px">`;
      courses.forEach((c) => c.blocks.forEach((b, i) => {
        if (b.day !== d) return;
        const top = Math.max(0, (toMin(b.start) - h0 * 60) / 60 * HOUR);
        const bottom = Math.min(H, (toMin(b.end) - h0 * 60) / 60 * HOUR);
        if (bottom <= 0 || top >= H) return;
        html += `<div class="blk ${bad.has(c.id + ":" + i) ? "conflict" : ""}" data-id="${c.id}" style="top:${top}px;height:${bottom - top - 2}px;background:${c.color}">
          <b>${esc(c.name)}</b><div class="meta">${b.start}–${b.end}${c.room ? " · " + esc(c.room) : ""}</div><div class="meta">${esc(c.type)}</div></div>`;
      }));
      weekEvents.filter((e) => e.time && dowMon(parseYmd(e.date)) === d).forEach((e) => {
        const top = (toMin(e.time) - h0 * 60) / 60 * HOUR;
        if (top < 0 || top >= H) return;
        html += `<div class="blk event" data-ev="${e.id}" style="top:${top}px;height:${Math.min(HOUR * .6, H - top)}px;left:auto;width:45%"><b>${esc(e.title)}</b></div>`;
      });
      html += `</div>`;
    }
    grid.innerHTML = html;

    $("#schedAlerts").innerHTML = msgs.length
      ? `<div class="alert err">⚠ Cruces de horario:<br>${msgs.join("<br>")}</div>`
      : courses.length ? "" : `<div class="alert info">Aún no tienes cursos. Usa “+ Curso” o haz clic en la cuadrícula.</div>`;

    let total = 0;
    $("#legend").innerHTML = courses.map((c) => {
      const hrs = c.blocks.reduce((a, b) => a + (toMin(b.end) - toMin(b.start)) / 60, 0);
      total += hrs;
      return `<div class="item" data-id="${c.id}"><span class="dot" style="background:${c.color}"></span><span>${esc(c.name)}<br><span class="note">${esc(c.type)}${c.prof ? " · " + esc(c.prof) : ""}</span></span><span class="hrs">${hrs.toFixed(1)} h</span></div>`;
    }).join("") || `<p class="note">Sin cursos.</p>`;
    $("#schedTotal").textContent = courses.length ? `Total semanal: ${total.toFixed(1)} h en ${courses.length} curso(s)` : "";
  }

  /* ---------- Diálogo de curso ---------- */
  function blockRow(b) {
    const nDays = S().settings.sunday ? 7 : 6;
    return `<div class="block-row">
      <select data-f="day">${DAYS_LONG.slice(0, nDays).map((n, i) => `<option value="${i}" ${i === b.day ? "selected" : ""}>${n}</option>`).join("")}</select>
      <input type="time" data-f="start" value="${b.start}" step="900">
      <input type="time" data-f="end" value="${b.end}" step="900">
      <button type="button" class="btn sm danger" data-rm>✕</button></div>`;
  }

  function openCourse(course, preset) {
    const st = S();
    editing = course ? structuredClone(course) : {
      id: uid(), name: "", type: "Teoría", room: "", prof: "",
      color: PALETTE[st.courses.length % PALETTE.length],
      blocks: [preset || { day: 0, start: "08:00", end: "10:00" }]
    };
    const f = $("#courseForm");
    $("#courseDlgTitle").textContent = course ? "Editar curso" : "Nuevo curso";
    ["name", "type", "room", "prof", "color"].forEach((k) => (f.elements[k].value = editing[k]));
    $("#blocksList").innerHTML = editing.blocks.map(blockRow).join("");
    $("#delCourse").hidden = !course;
    $("#courseDlg").showModal();
    f.elements.name.focus();
  }

  $("#addBlock").onclick = () => {
    const last = $$("#blocksList .block-row").pop();
    const b = last ? { day: Math.min(+$("[data-f=day]", last).value + 2, 5), start: $("[data-f=start]", last).value, end: $("[data-f=end]", last).value } : { day: 0, start: "08:00", end: "10:00" };
    $("#blocksList").insertAdjacentHTML("beforeend", blockRow(b));
  };
  $("#blocksList").onclick = (e) => { if (e.target.closest("[data-rm]")) e.target.closest(".block-row").remove(); };

  $("#courseForm").onsubmit = (e) => {
    const f = e.target;
    const blocks = $$("#blocksList .block-row").map((r) => ({ day: +$("[data-f=day]", r).value, start: $("[data-f=start]", r).value, end: $("[data-f=end]", r).value }));
    if (!blocks.length || blocks.some((b) => !b.start || !b.end || toMin(b.end) <= toMin(b.start))) {
      e.preventDefault(); alert("Revisa los horarios: la hora de fin debe ser mayor que la de inicio."); return;
    }
    Object.assign(editing, { name: f.elements.name.value.trim(), type: f.elements.type.value, room: f.elements.room.value.trim(), prof: f.elements.prof.value.trim(), color: f.elements.color.value, blocks });
    const list = S().courses, i = list.findIndex((c) => c.id === editing.id);
    if (i >= 0) list[i] = editing; else list.push(editing);
    Store.save("schedule"); render();
  };

  $("#delCourse").onclick = () => {
    if (!confirm(`¿Eliminar "${editing.name}"?`)) return;
    const st = S(); st.courses = st.courses.filter((c) => c.id !== editing.id);
    Store.save("schedule"); $("#courseDlg").close(); render();
  };

  /* ---------- Interacciones ---------- */
  $("#addCourse").onclick = () => openCourse(null);
  $("#printSched").onclick = () => window.print();
  $("#sched").addEventListener("click", (e) => {
    const ev = e.target.closest("[data-ev]");
    if (ev) { showView("calendar"); Modules.calendar.openEvent(ev.dataset.ev); return; }
    const blk = e.target.closest(".blk");
    if (blk) return openCourse(S().courses.find((c) => c.id === blk.dataset.id));
    const day = e.target.closest(".day");
    if (!day) return;
    const st = S().settings;
    const min = st.startHour * 60 + Math.floor((e.offsetY / HOUR) * 2) * 30;
    openCourse(null, { day: +day.dataset.day, start: fromMin(min), end: fromMin(Math.min(min + 120, st.endHour * 60)) });
  });
  $("#legend").addEventListener("click", (e) => { const it = e.target.closest(".item"); if (it) openCourse(S().courses.find((c) => c.id === it.dataset.id)); });

  $("#schedSettings").onclick = () => {
    const f = $("#settingsForm"), st = S().settings;
    f.elements.startHour.value = st.startHour; f.elements.endHour.value = st.endHour; f.elements.sunday.checked = st.sunday;
    $("#settingsDlg").showModal();
  };
  $("#settingsForm").onsubmit = (e) => {
    const f = e.target, a = +f.elements.startHour.value, b = +f.elements.endHour.value;
    if (b <= a) { e.preventDefault(); alert("La hora fin debe ser mayor que la de inicio."); return; }
    Object.assign(S().settings, { startHour: a, endHour: b, sunday: f.elements.sunday.checked });
    Store.save("schedule"); render();
  };

  Modules.schedule = { render, courses: () => S().courses };
})();
