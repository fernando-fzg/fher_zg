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
    es: [
      "Soy estudiante de octavo ciclo de Ingeniería Biomédica en la Pontificia Universidad Católica del Perú (PUCP). Antes de la universidad trabajé como técnico mecánico en Ferreyros, y desde 2022 he dado soporte técnico a equipos audiovisuales y electrónicos en las aulas de la PUCP.",
      "Mi meta es desarrollarme en Ingeniería Clínica: que la tecnología médica de un hospital esté siempre disponible, segura y bien gestionada, porque detrás de cada equipo hay un paciente que depende de él. Mi experiencia laboral me enseñó la disciplina del mantenimiento preventivo y correctivo; la ingeniería biomédica me da las bases para aplicarla a dispositivos médicos. Actualmente, busco prácticas en hospitales, empresas de equipamiento médico o áreas de gestión de tecnología sanitaria."
    ],
    en: [
      "I am an eighth-semester Biomedical Engineering student at Pontificia Universidad Católica del Perú (PUCP). Before university I worked as a mechanical technician at Ferreyros, and since 2022 I have provided technical support for audiovisual and electronic classroom equipment at PUCP.",
      "My goal is to grow in Clinical Engineering: making sure a hospital's medical technology is always available, safe and well managed, because behind every device there is a patient who depends on it. My work experience taught me the discipline of preventive and corrective maintenance; biomedical engineering gives me the foundation to apply it to medical devices. I am currently looking for internships in hospitals, medical equipment companies or healthcare technology management."
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
    { ico: "✚", t: { es: "Ingeniería clínica", en: "Clinical engineering" }, d: { es: "Tecnología médica segura y disponible en hospitales y centros de salud.", en: "Safe, available medical technology in hospitals and health centers." } },
    { ico: "♥", t: { es: "Dispositivos biomédicos", en: "Biomedical devices" }, d: { es: "Funcionamiento, evaluación y seguridad de equipos de diagnóstico y terapia.", en: "Operation, evaluation and safety of diagnostic and therapy equipment." } },
    { ico: "⚙", t: { es: "Gestión y mantenimiento de equipos médicos", en: "Medical equipment management & maintenance" }, d: { es: "Inventario, mantenimiento preventivo y correctivo, y ciclo de vida de la tecnología.", en: "Inventory, preventive and corrective maintenance, and technology life cycle." } },
    { ico: "⬡", t: { es: "Biomecánica", en: "Biomechanics" }, d: { es: "Análisis del movimiento humano y aplicaciones en rehabilitación.", en: "Human movement analysis and rehabilitation applications." } }
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
      points: [
        { es: "Soporte técnico de equipos audiovisuales y electrónicos en aulas.", en: "Technical support for audiovisual and electronic classroom equipment." },
        { es: "Atención de incidencias durante las clases.", en: "Incident response during classes." }
      ],
      // Imagen referencial tomada de PuntoEdu PUCP (se muestra desde su servidor, con enlace a la fuente)
      image: {
        src: "https://files.pucp.education/puntoedu/wp-content/uploads/2023/12/11161019/cicloverano2024servicios.jpg",
        source: "PuntoEdu PUCP",
        url: "https://puntoedu.pucp.edu.pe/vida-universitaria/institucional/servicios-pucp-este-ciclo-de-verano-2024/"
      }
    },
    {
      type: "edu",
      period: { es: "Feb 2018 — Actualidad", en: "Feb 2018 — Present" },
      title: { es: "Ingeniería Biomédica", en: "Biomedical Engineering" },
      org: "PUCP",
      points: [
        { es: "Estudiante de octavo ciclo (VIII).", en: "Eighth-semester (VIII) student." },
        { es: "Facultad de Ciencias e Ingeniería.", en: "Faculty of Science and Engineering." },
        { es: "Carrera de 10 semestres: Bachiller en Ciencias con mención en Ingeniería Biomédica y título de Ingeniero Biomédico.", en: "10-semester program: Bachelor of Science in Biomedical Engineering and professional degree as Biomedical Engineer." }
      ],
      image: {
        src: "https://files.pucp.education/puntoedu/wp-content/uploads/2022/09/21173540/1-laboratorio-de-ingenieria-medica_096-1920x1080-1-1024x576.jpg",
        source: "PuntoEdu PUCP",
        url: "https://puntoedu.pucp.edu.pe/investigaciones/investigacion/pucp-tiene-primer-laboratorio-peruano-que-desarrollara-equipos-medicos/"
      }
    },
    {
      type: "work",
      period: { es: "Nov 2014 — Ago 2016 · 4 periodos", en: "Nov 2014 — Aug 2016 · 4 terms" },
      title: { es: "Técnico Mecánico Nivel 4", en: "Level 4 Mechanical Technician" },
      org: "Ferreyros S.A.",
      points: [
        { es: "Reparación y mantenimiento preventivo y correctivo de maquinaria pesada Caterpillar (CAT) en taller.", en: "Preventive and corrective repair and maintenance of Caterpillar (CAT) heavy machinery in the workshop." },
        { es: "Diagnóstico de fallas.", en: "Fault diagnosis." },
        { es: "Desmontaje, inspección y montaje de componentes: motores, transmisiones y sistemas hidráulicos.", en: "Disassembly, inspection and reassembly of components: engines, transmissions and hydraulic systems." },
        { es: "Trabajo según los manuales y procedimientos del fabricante.", en: "Work following the manufacturer's manuals and procedures." },
        { es: "Cumplimiento de normas de seguridad y registro de los trabajos realizados.", en: "Compliance with safety standards and records of the work performed." }
      ],
      image: {
        src: "https://static.ferreyros.com.pe/fcsaprdferreyros01/2018/03/poster.jpg",
        source: "Ferreyros",
        url: "https://www.ferreyros.com.pe/servicios/talleres/"
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
      link: "assets/certificados/prevencion-riesgos-laborales.pdf"
    },
    {
      ico: "◈",
      title: { es: "Salud y seguridad para ambientes de trabajo moderno", en: "Health and Safety for Modern Workplaces" },
      meta: { es: "Fundación Romero · Becas Grupo Romero · 16 horas · Oct 2026", en: "Fundación Romero · Becas Grupo Romero · 16 hours · Oct 2026" },
      link: "assets/certificados/salud-y-seguridad.pdf"
    }
  ],

  links: {
    email: "fernando.zela@pucp.edu.pe",
    linkedin: "",       // https://www.linkedin.com/in/...
    github: "",         // https://github.com/...
    orcid: "",          // https://orcid.org/...
    scholar: "",        // Google Scholar
    researchgate: ""
  },

  // Formulario de contacto: crea uno gratis en https://formspree.io y pega aquí la URL
  formEndpoint: "https://formspree.io/f/mwlljgke"
};
