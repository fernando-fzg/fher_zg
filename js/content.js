/* =====================================================================
   CONTENIDO DE LA PÁGINA PÚBLICA
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas editar para cambiar el texto.
   - Cada texto traducible es { es: "...", en: "..." }.
   - `todo: true` muestra una etiqueta "Por completar" (bórralo al terminar).
   - Para agregar un proyecto/experiencia, copia un bloque y edítalo.
   ===================================================================== */
window.CONTENT = {
  name: "Fernando Zela",
  initials: "FZ",
  role: { es: "Ingeniería Biomédica", en: "Biomedical Engineering" },
  location: "Lima, Perú",
  photo: "assets/foto.jpg",            // coloca tu foto en assets/foto.jpg
  // true = foto SIN fondo (PNG transparente, ej. assets/foto.png) que "sale" del círculo amarillo.
  // false = foto normal recortada dentro del círculo.
  photoCutout: false,
  cv: { es: "assets/cv-es.pdf", en: "assets/cv-en.pdf" },

  tagline: {
    es: "Diseño soluciones que conectan la ingeniería con la salud: señales biomédicas, modelado fisiológico y dispositivos médicos.",
    en: "I design solutions that bridge engineering and health: biomedical signals, physiological modeling and medical devices."
  },

  about: {
    todo: true,
    es: [
      "Soy estudiante de octavo ciclo de Ingeniería Biomédica en la Pontificia Universidad Católica del Perú (PUCP). Antes de la universidad trabajé como técnico mecánico en Ferreyros, y desde 2022 he dado soporte técnico a equipos audiovisuales y electrónicos en las aulas de la PUCP.",
      "[Completa aquí: qué te motiva, en qué área te quieres especializar y qué tipo de oportunidades buscas.]"
    ],
    en: [
      "I am an eighth-semester Biomedical Engineering student at Pontificia Universidad Católica del Perú (PUCP). Before university I worked as a mechanical technician at Ferreyros, and since 2022 I have provided technical support for audiovisual and electronic classroom equipment at PUCP.",
      "[To complete: what drives you, which area you want to specialize in and the opportunities you are looking for.]"
    ]
  },

  facts: [
    { k: { es: "Universidad", en: "University" }, v: "Pontificia Universidad Católica del Perú (PUCP)" },
    { k: { es: "Ciclo", en: "Semester" }, v: { es: "Octavo ciclo (VIII)", en: "Eighth semester (VIII)" } },
    { k: { es: "Ubicación", en: "Location" }, v: "Lima, Perú" },
    { k: { es: "Idiomas", en: "Languages" }, v: { es: "Español (nativo), Inglés (intermedio)", en: "Spanish (native), English (intermediate)" } },
    { k: { es: "Estado", en: "Status" }, v: { es: "Abierto a prácticas e investigación", en: "Open to internships & research" } }
  ],

  interests: [
    { ico: "〰", t: { es: "Procesamiento de señales", en: "Signal processing" }, d: { es: "ECG, EMG, EEG: adquisición, filtrado y análisis.", en: "ECG, EMG, EEG: acquisition, filtering and analysis." } },
    { ico: "⚙", t: { es: "Modelado fisiológico", en: "Physiological modeling" }, d: { es: "Modelos matemáticos y control de sistemas biológicos.", en: "Mathematical models and control of biological systems." } },
    { ico: "✚", t: { es: "Dispositivos médicos", en: "Medical devices" }, d: { es: "Diseño, prototipado y normativa (ISO 13485, IEC 60601).", en: "Design, prototyping and regulation (ISO 13485, IEC 60601)." } },
    { ico: "⬡", t: { es: "Ingeniería de tejidos", en: "Tissue engineering" }, d: { es: "Biomateriales y andamios para medicina regenerativa.", en: "Biomaterials and scaffolds for regenerative medicine." } }
  ],

  projects: [
    {
      todo: true,
      title: { es: "Proyecto 1 — [Nombre]", en: "Project 1 — [Name]" },
      period: "2025",
      category: "devices",
      image: "",                       // ej. "assets/proyecto1.jpg"
      link: "",                        // ej. repo de GitHub o póster
      problem: { es: "[¿Qué problema clínico o técnico resolvía?]", en: "[What clinical or technical problem did it address?]" },
      solution: { es: "[¿Qué construiste o diseñaste? ¿Cuál fue tu rol?]", en: "[What did you build or design? What was your role?]" },
      result: { es: "[Resultado medible: precisión, costo, premio, publicación…]", en: "[Measurable outcome: accuracy, cost, award, publication…]" },
      tags: ["Arduino", "Python"]
    },
    {
      todo: true,
      title: { es: "Proyecto 2 — [Nombre]", en: "Project 2 — [Name]" },
      period: "2025",
      category: "modeling",
      image: "", link: "",
      problem: { es: "[Problema]", en: "[Problem]" },
      solution: { es: "[Solución]", en: "[Solution]" },
      result: { es: "[Resultado]", en: "[Result]" },
      tags: ["MATLAB", "Simulink"]
    },
    {
      todo: true,
      title: { es: "Proyecto 3 — [Nombre]", en: "Project 3 — [Name]" },
      period: "2024",
      category: "research",
      image: "", link: "",
      problem: { es: "[Problema]", en: "[Problem]" },
      solution: { es: "[Solución]", en: "[Solution]" },
      result: { es: "[Resultado]", en: "[Result]" },
      tags: ["Biomateriales"]
    }
  ],

  // Categorías para el filtro de proyectos
  categories: {
    devices: { es: "Dispositivos", en: "Devices" },
    modeling: { es: "Modelado", en: "Modeling" },
    signals: { es: "Señales", en: "Signals" },
    research: { es: "Investigación", en: "Research" }
  },

  experience: [
    {
      type: "work",
      period: { es: "Sep 2022 — Ago 2026 · 5 periodos", en: "Sep 2022 — Aug 2026 · 5 terms" },
      title: { es: "Auxiliar de Intendencia de Aulas", en: "Classroom Services Assistant" },
      org: "PUCP",
      desc: { es: "Soporte técnico de equipos audiovisuales y electrónicos en aulas; atención de incidencias.", en: "Technical support for audiovisual and electronic classroom equipment; incident response." }
    },
    {
      type: "edu",
      period: { es: "Feb 2018 — Actualidad", en: "Feb 2018 — Present" },
      title: { es: "Ingeniería Biomédica", en: "Biomedical Engineering" },
      org: "PUCP",
      desc: { es: "Estudiante de octavo ciclo. Facultad de Ciencias e Ingeniería.", en: "Eighth-semester student. Faculty of Science and Engineering." }
    },
    {
      type: "work",
      period: { es: "Nov 2014 — Ago 2016 · 4 periodos", en: "Nov 2014 — Aug 2016 · 4 terms" },
      title: { es: "Técnico Mecánico Nivel 4", en: "Level 4 Mechanical Technician" },
      org: "Ferreyros S.A.",
      desc: {
        es: "Reparación y mantenimiento preventivo y correctivo de maquinaria pesada Caterpillar (CAT) en taller: diagnóstico de fallas, desmontaje, inspección y montaje de componentes (motores, transmisiones y sistemas hidráulicos) siguiendo los manuales y procedimientos del fabricante, con normas de seguridad y registro de los trabajos realizados.",
        en: "Preventive and corrective repair and maintenance of Caterpillar (CAT) heavy machinery in the workshop: fault diagnosis, disassembly, inspection and reassembly of components (engines, transmissions and hydraulic systems) following the manufacturer's manuals and procedures, under safety standards and with records of the work performed."
      }
    }
  ],

  // Revisa los grupos de ejemplo: solo "Soporte y ofimática" viene de tus documentos.
  skills: [
    {
      ico: "▣",
      g: { es: "Soporte y ofimática", en: "Support & office tools" },
      items: [
        { es: "Equipos audiovisuales", en: "Audiovisual equipment" },
        { es: "Equipos electrónicos", en: "Electronic equipment" },
        { es: "Atención de incidencias", en: "Incident response" },
        { es: "Excel (intermedio)", en: "Excel (intermediate)" },
        { es: "Word (intermedio)", en: "Word (intermediate)" }
      ]
    },
    { ico: "〰", g: { es: "Señales e instrumentación", en: "Signals & instrumentation" }, items: ["ECG/EMG", "Filtros digitales", "Amplificadores", "Adquisición de datos"] },
    { ico: "⌘", g: { es: "Programación", en: "Programming" }, items: ["Python", "MATLAB", "C/C++", "Git"] },
    { ico: "⚙", g: { es: "Diseño y prototipado", en: "Design & prototyping" }, items: ["SolidWorks", "Impresión 3D", "Arduino", "ESP32", "KiCad"] },
    { ico: "✚", g: { es: "Normativa y gestión", en: "Regulation & management" }, items: ["ISO 13485", "IEC 60601", "ISO 14971", "Gestión de tecnología"] }
  ],

  publications: [
    { todo: true, year: "2025", title: "[Título del póster / artículo]", meta: "[Autores] · [Congreso o revista]", link: "" }
  ],

  certifications: [
    {
      ico: "◈",
      title: { es: "Excel Intermedio", en: "Intermediate Excel" },
      meta: { es: "UPC · Becas Grupo Romero · 20 horas · Nov 2026", en: "UPC · Becas Grupo Romero · 20 hours · Nov 2026" },
      link: "assets/certificados/excel-intermedio.pdf"
    },
    {
      ico: "◈",
      title: { es: "Word Intermedio", en: "Intermediate Word" },
      meta: { es: "UPC · Becas Grupo Romero · 15 horas · Nov 2026", en: "UPC · Becas Grupo Romero · 15 hours · Nov 2026" },
      link: "assets/certificados/word-intermedio.pdf"
    },
    {
      ico: "◈",
      title: { es: "Prevención de Riesgos Laborales", en: "Occupational Risk Prevention" },
      meta: { es: "Ministerio de Trabajo y Promoción del Empleo · 16 horas · Nota 20/20 · Oct 2026", en: "Peru's Ministry of Labor · 16 hours · Grade 20/20 · Oct 2026" },
      link: ""   // sin PDF público: el certificado muestra el número de DNI
    },
    {
      ico: "◈",
      title: { es: "Salud y seguridad para ambientes de trabajo moderno", en: "Health and Safety for Modern Workplaces" },
      meta: { es: "Fundación Romero · Becas Grupo Romero · 16 horas · Oct 2026", en: "Fundación Romero · Becas Grupo Romero · 16 hours · Oct 2026" },
      link: "assets/certificados/salud-y-seguridad.pdf"
    }
  ],

  links: {
    email: "",          // tu correo de contacto
    linkedin: "",       // https://www.linkedin.com/in/...
    github: "",         // https://github.com/...
    orcid: "",          // https://orcid.org/...
    scholar: "",        // Google Scholar
    researchgate: ""
  },

  // Formulario de contacto: crea uno gratis en https://formspree.io y pega aquí la URL
  formEndpoint: ""
};
