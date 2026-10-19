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
      "Soy estudiante de Ingeniería Biomédica. [Describe aquí en 2–3 frases quién eres, qué te motiva y en qué área te quieres especializar.]",
      "[Segundo párrafo: experiencia destacada, laboratorio o grupo de investigación, y qué tipo de oportunidades buscas.]"
    ],
    en: [
      "I am a Biomedical Engineering student. [Describe in 2–3 sentences who you are, what drives you and which area you want to specialize in.]",
      "[Second paragraph: key experience, lab or research group, and the opportunities you are looking for.]"
    ]
  },

  facts: [
    { k: { es: "Universidad", en: "University" }, v: "Universidad Peruana Cayetano Heredia", todo: true },
    { k: { es: "Ubicación", en: "Location" }, v: "Lima, Perú" },
    { k: { es: "Idiomas", en: "Languages" }, v: { es: "Español (nativo), Inglés (—)", en: "Spanish (native), English (—)" }, todo: true },
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
    { todo: true, type: "work", period: "2025 — ", title: { es: "[Cargo / Prácticas]", en: "[Role / Internship]" }, org: "[Institución]", desc: { es: "[Qué hiciste y qué lograste]", en: "[What you did and achieved]" } },
    { todo: true, type: "work", period: "2024", title: { es: "[Asistente de laboratorio]", en: "[Lab assistant]" }, org: "[Laboratorio]", desc: { es: "[Descripción]", en: "[Description]" } },
    { todo: true, type: "edu", period: "20XX — 20XX", title: { es: "Ingeniería Biomédica", en: "Biomedical Engineering" }, org: "Universidad Peruana Cayetano Heredia", desc: { es: "[Ciclo actual, menciones, cursos relevantes]", en: "[Current year, honors, relevant courses]" } }
  ],

  skills: [
    { ico: "〰", g: { es: "Señales e instrumentación", en: "Signals & instrumentation" }, items: ["ECG/EMG", "Filtros digitales", "Amplificadores", "Adquisición de datos"] },
    { ico: "⌘", g: { es: "Programación", en: "Programming" }, items: ["Python", "MATLAB", "C/C++", "Git"] },
    { ico: "⚙", g: { es: "Diseño y prototipado", en: "Design & prototyping" }, items: ["SolidWorks", "Impresión 3D", "Arduino", "ESP32", "KiCad"] },
    { ico: "✚", g: { es: "Normativa y gestión", en: "Regulation & management" }, items: ["ISO 13485", "IEC 60601", "ISO 14971", "Gestión de tecnología"] }
  ],

  publications: [
    { todo: true, year: "2025", title: "[Título del póster / artículo]", meta: "[Autores] · [Congreso o revista]", link: "" }
  ],

  certifications: [
    { todo: true, ico: "◈", title: "[Certificación o curso]", meta: "[Entidad] · 2025", link: "" },
    { todo: true, ico: "★", title: "[Premio / Hackathon]", meta: "[Organizador] · 2024", link: "" }
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
