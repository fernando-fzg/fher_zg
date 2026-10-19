/* Página pública: renderiza CONTENT y maneja el selector ES/EN */
(function () {
  const C = window.CONTENT;

  const UI = {
    es: {
      "nav.about": "Sobre mí", "nav.projects": "Proyectos", "nav.experience": "Trayectoria",
      "nav.skills": "Habilidades", "nav.publications": "Publicaciones", "nav.contact": "Contacto",
      "hero.more": "Leer más", "hero.hi": "Hola, soy", "hero.cv": "Descargar CV",
      "hero.projects": "Ver proyectos",
      "sec.about": "Sobre mí", "sec.interests": "Intereses de investigación", "sec.projects": "Proyectos",
      "sec.experience": "Trayectoria", "sec.skills": "Habilidades",
      "sec.publications": "Publicaciones", "sec.certs": "Certificaciones y premios", "sec.contact": "Hablemos",
      "proj.problem": "Problema", "proj.solution": "Solución", "proj.result": "Resultado", "proj.all": "Todos",
      "proj.link": "Ver más →", "proj.noimg": "[ imagen del proyecto ]",
      "contact.intro": "¿Tienes una propuesta de investigación, prácticas o colaboración? Escríbeme.",
      "contact.name": "Nombre", "contact.email": "Correo", "contact.message": "Mensaje", "contact.send": "Enviar mensaje",
      "contact.noform": "Formulario aún no configurado (ver README).", "contact.sent": "¡Gracias! Mensaje enviado.",
      "contact.error": "No se pudo enviar. Intenta por correo.",
      "footer.built": "Hecho con HTML, CSS y JS", "footer.private": "privado", "todo": "Por completar"
    },
    en: {
      "nav.about": "About", "nav.projects": "Projects", "nav.experience": "Journey",
      "nav.skills": "Skills", "nav.publications": "Publications", "nav.contact": "Contact",
      "hero.more": "Read more", "hero.hi": "Hi, I'm", "hero.cv": "Download CV",
      "hero.projects": "See projects",
      "sec.about": "About me", "sec.interests": "Research interests", "sec.projects": "Projects",
      "sec.experience": "Journey", "sec.skills": "Skills",
      "sec.publications": "Publications", "sec.certs": "Certifications & awards", "sec.contact": "Let's talk",
      "proj.problem": "Problem", "proj.solution": "Solution", "proj.result": "Result", "proj.all": "All",
      "proj.link": "Learn more →", "proj.noimg": "[ project image ]",
      "contact.intro": "Have a research, internship or collaboration opportunity? Get in touch.",
      "contact.name": "Name", "contact.email": "Email", "contact.message": "Message", "contact.send": "Send message",
      "contact.noform": "Form not configured yet (see README).", "contact.sent": "Thanks! Message sent.",
      "contact.error": "Could not send. Please email me instead.",
      "footer.built": "Built with HTML, CSS & JS", "footer.private": "private", "todo": "To be completed"
    }
  };

  let lang = "es";
  try { lang = localStorage.getItem("lang") || (navigator.language || "es").slice(0, 2); } catch (e) {}
  if (!UI[lang]) lang = "es";
  let filter = "all";

  const $ = (s) => document.querySelector(s);
  const t = (v) => (v == null ? "" : typeof v === "object" ? (v[lang] ?? v.es ?? "") : v);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const todo = (o) => (o && o.todo ? ` <span class="todo">${UI[lang].todo}</span>` : "");

  const svg = (d) => `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">${d}</svg>`;
  const ICONS = {
    linkedin: svg('<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.95 1.32-1.95 2.69V21h-4z"/>'),
    github: svg('<path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/>'),
    mail: svg('<path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4 7.4V17h16V7.4z"/>'),
    orcid: svg('<path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22zM8.2 17.2H6.6V8.4h1.6zM7.4 7.3a1 1 0 1 1 0-2.1 1 1 0 0 1 0 2.1zm3 9.9V8.4h3.2c3 0 4.4 2.2 4.4 4.4 0 2.4-1.9 4.4-4.4 4.4zm1.6-1.4h1.5c2.2 0 2.9-1.7 2.9-3 0-2.1-1.3-3-3-3H12z"/>')
  };

  function render() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = UI[lang][el.dataset.i18n] || ""));
    document.querySelectorAll("[data-c]").forEach((el) => (el.textContent = t(C[el.dataset.c])));
    document.querySelectorAll(".lang-toggle button").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));

    $("#cvBtn").href = t(C.cv);

    const S = C.links;
    $("#socials").innerHTML = [
      ["LinkedIn", S.linkedin, ICONS.linkedin], ["GitHub", S.github, ICONS.github],
      ["Email", S.email && "mailto:" + S.email, ICONS.mail], ["ORCID", S.orcid, ICONS.orcid]
    ].map(([n, u, svg]) => u
      ? `<a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${n}" title="${n}">${svg}</a>`
      : `<span class="off" title="${n} — ${UI[lang].todo}">${svg}</span>`).join("");

    $("#aboutText").innerHTML = (C.about[lang] || []).map((p) => `<p>${esc(p)}</p>`).join("") + todo(C.about);
    $("#facts").innerHTML = C.facts.map((f) => `<div class="fact"><span>${esc(t(f.k))}</span><span>${esc(t(f.v))}${todo(f)}</span></div>`).join("");
    $("#interests").innerHTML = C.interests.map((i) =>
      `<div class="card interest reveal"><div class="ico">${i.ico}</div><h3>${esc(t(i.t))}</h3><p>${esc(t(i.d))}</p></div>`).join("");

    const cats = [...new Set(C.projects.map((p) => p.category))];
    $("#filters").innerHTML = [["all", UI[lang]["proj.all"]], ...cats.map((c) => [c, t(C.categories[c]) || c])]
      .map(([k, l]) => `<button data-f="${k}" class="${k === filter ? "active" : ""}">${esc(l)}</button>`).join("");
    renderProjects();

    $("#timeline").innerHTML = C.experience.map((e) => `
      <div class="tl-item ${e.type}">
        <div class="period">${esc(e.period)}</div>
        <h3>${esc(t(e.title))}${todo(e)}</h3>
        <div class="org">${esc(e.org)}</div>
        <p>${esc(t(e.desc))}</p>
      </div>`).join("");

    $("#skillList").innerHTML = C.skills.map((s) =>
      `<div class="card reveal"><h3><span>${s.ico}</span>${esc(t(s.g))}</h3><ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("");

    $("#pubList").innerHTML = C.publications.map((p) => `
      <div class="card pub reveal"><div class="year">${esc(p.year)}</div>
        <div><div class="title">${p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title)}${todo(p)}</div>
        <div class="meta">${esc(p.meta)}</div></div></div>`).join("");

    const L = C.links;
    const idLinks = [["ORCID", L.orcid], ["Google Scholar", L.scholar], ["ResearchGate", L.researchgate]];
    $("#ids").innerHTML = idLinks.map(([n, u]) => u
      ? `<a class="btn sm" href="${esc(u)}" target="_blank" rel="noopener">${n}</a>`
      : `<span class="btn sm" style="opacity:.5">${n} <span class="todo">—</span></span>`).join("");

    $("#certList").innerHTML = C.certifications.map((c) => `
      <div class="card cert reveal"><div class="ico">${c.ico}</div><div>
        <div class="title">${c.link ? `<a href="${esc(c.link)}" target="_blank" rel="noopener">${esc(c.title)}</a>` : esc(c.title)}${todo(c)}</div>
        <div class="meta">${esc(c.meta)}</div></div></div>`).join("");

    const contacts = [["Email", L.email && "mailto:" + L.email, L.email], ["LinkedIn", L.linkedin], ["GitHub", L.github]];
    $("#contactLinks").innerHTML = contacts.map(([k, u, label]) => u
      ? `<a href="${esc(u)}" target="_blank" rel="noopener"><span class="k">${k}</span>${esc(label || u.replace(/^https?:\/\/(www\.)?/, ""))}</a>`
      : `<a aria-disabled="true" style="opacity:.6"><span class="k">${k}</span><span class="todo">${UI[lang].todo}</span></a>`).join("");

    $("#formNote").textContent = C.formEndpoint ? "" : UI[lang]["contact.noform"];
    observe();
  }

  function renderProjects() {
    const list = C.projects.filter((p) => filter === "all" || p.category === filter);
    $("#projectList").innerHTML = list.map((p) => `
      <article class="card project reveal">
        <div class="thumb">${p.image ? `<img src="${esc(p.image)}" alt="">` : `<span>${UI[lang]["proj.noimg"]}</span>`}</div>
        <div class="body">
          <div class="period">${esc(p.period)} · ${esc(t(C.categories[p.category]) || "")}</div>
          <h3>${esc(t(p.title))}${todo(p)}</h3>
          <dl>
            <div><dt>${UI[lang]["proj.problem"]}</dt><dd>${esc(t(p.problem))}</dd></div>
            <div><dt>${UI[lang]["proj.solution"]}</dt><dd>${esc(t(p.solution))}</dd></div>
            <div><dt>${UI[lang]["proj.result"]}</dt><dd>${esc(t(p.result))}</dd></div>
          </dl>
          <div class="tags">${p.tags.map((x) => `<span class="tag">${esc(x)}</span>`).join("")}</div>
          ${p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">${UI[lang]["proj.link"]}</a>` : ""}
        </div>
      </article>`).join("");
    observe();
  }

  let io;
  function observe() {
    if (!("IntersectionObserver" in window)) { document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in")); return; }
    io = io || new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .1 });
    document.querySelectorAll(".reveal:not(.in)").forEach((e) => io.observe(e));
  }

  document.addEventListener("click", (e) => {
    const lb = e.target.closest(".lang-toggle button");
    if (lb) { lang = lb.dataset.lang; try { localStorage.setItem("lang", lang); } catch (_) {} render(); }
    const fb = e.target.closest("#filters button");
    if (fb) { filter = fb.dataset.f; document.querySelectorAll("#filters button").forEach((b) => b.classList.toggle("active", b === fb)); renderProjects(); }
    if (e.target.closest("[data-theme-toggle]")) toggleTheme();
    if (e.target.closest("#menuBtn")) setMenu($("#overlay").hidden);
    else if (e.target.closest("#overlay a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  function setMenu(open) {
    $("#overlay").hidden = !open;
    $("#menuBtn").setAttribute("aria-expanded", open);
    document.body.classList.toggle("menu-open", open);
  }

  function toggleTheme() {
    const dark = document.documentElement.dataset.theme !== "dark";
    if (dark) document.documentElement.dataset.theme = "dark"; else delete document.documentElement.dataset.theme;
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (_) {}
  }

  $("#contactForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!C.formEndpoint) return;
    try {
      const r = await fetch(C.formEndpoint, { method: "POST", body: new FormData(e.target), headers: { Accept: "application/json" } });
      $("#formNote").textContent = UI[lang][r.ok ? "contact.sent" : "contact.error"];
      if (r.ok) e.target.reset();
    } catch (_) { $("#formNote").textContent = UI[lang]["contact.error"]; }
  });

  $("#photo").src = C.photo;
  if (C.photoCutout) $("#heroPhoto").classList.add("cutout");
  $("#year").textContent = new Date().getFullYear();
  render();
})();
