# Hi, I'm Fernando Zela

Sitio personal estático (HTML, CSS y JS, sin compilación) con dos partes:

| Página | Qué contiene | Acceso |
|---|---|---|
| `index.html` | Perfil profesional, proyectos, trayectoria, habilidades, publicaciones y contacto (ES/EN) | Público |
| `privado.html` | Horario, calendario, registro corporal, despensa y menú semanal | Solo tú (Supabase) |

## Estructura

```
index.html            Página pública
privado.html          Panel privado
css/base.css          Colores, tipografía y botones (modo claro/oscuro)
css/public.css        Estilos de la página pública
css/private.css       Estilos del panel
js/content.js         ← TODO el contenido de la página pública (editar aquí)
js/public.js          Renderizado + selector ES/EN
js/supabase-config.js ← URL, clave pública y tu correo
js/app.js             Login, almacenamiento y navegación
js/schedule.js        Horario semanal
js/calendar.js        Calendario de actividades
js/health.js          Registro corporal y metas
js/recipes.js         ← Base de recetas e ingredientes (editable)
js/menu.js            Generador de menú (motor de reglas, sin IA)
supabase/schema.sql   Tabla y reglas de seguridad
assets/               Foto, CV y fotos de proyectos
```

## 1. Probar en tu computadora

Abre `privado.html` con doble clic. Mientras Supabase no esté configurado, aparece el botón **Entrar en modo local**: los datos se guardan solo en ese navegador. Este modo solo funciona en tu PC, no en GitHub Pages.

Para la página pública, coloca:
- `assets/foto.jpg`: tu foto, cuadrada y de al menos 800×800 px. Aparece en blanco y negro dentro del círculo amarillo.
  - **Efecto de la referencia** (la persona "sale" del círculo): quítale el fondo a tu foto (por ejemplo con remove.bg o Canva), guárdala como `assets/foto.png`, y en `js/content.js` pon `photo: "assets/foto.png"` y `photoCutout: true`.
- `assets/cv-es.pdf` y `assets/cv-en.pdf`: tu CV en cada idioma.

## 2. Configurar Supabase (gratis)

1. Crea un proyecto en <https://supabase.com>.
2. Abre **SQL Editor**, pega `supabase/schema.sql`, cambia `TU_CORREO@ejemplo.com` por tu correo y presiona **Run**.
3. En **Authentication → Users → Add user → Create new user**, crea tu usuario con ese mismo correo. Así solo existe tu cuenta.
4. En **Authentication → Sign In / Providers**, desactiva **Allow new users to sign up**.
5. En **Authentication → URL Configuration**:
   - *Site URL*: la dirección de tu sitio en GitHub Pages (por ejemplo `https://fernandozela.github.io`).
   - *Redirect URLs*: agrega `https://fernandozela.github.io/**` y, para probar en tu PC, `http://localhost:8765/**`.
6. En **Project Settings → API Keys**, copia la *Project URL* y la *anon public key* en `js/supabase-config.js`, junto con tu correo en `OWNER_EMAIL`.

Para entrar, escribes tu correo, te llega un **enlace** y al abrirlo entras directamente. La plantilla de correo de Supabase no necesita cambios.

> **Opcional: entrar con código en vez de enlace.** Supabase solo deja editar la plantilla si configuras un SMTP propio (por ejemplo Gmail con una "contraseña de aplicación"). Si lo haces, pon `{{ .Token }}` en la plantilla *Magic Link* y la página aceptará el código de 6 dígitos. Un SMTP propio también aumenta el límite de correos por hora.

> La *anon key* es pública por diseño. La seguridad la dan las reglas RLS: aunque alguien vea el código de la página, sin acceso a tu correo no puede leer ni escribir nada.

## 3. Publicar en GitHub Pages

1. Crea un repositorio, por ejemplo `fernandozela.github.io`, que queda publicado directamente en esa dirección.
2. Sube todos los archivos.
3. Ve a **Settings → Pages → Source: Deploy from a branch → main / (root)**.
4. Comprueba que la dirección de tu sitio esté en Supabase → **Authentication → URL Configuration** (paso 5 de la sección anterior).

## 4. Formulario de contacto (opcional)

Crea un formulario gratis en <https://formspree.io> y pega la URL en `formEndpoint`, dentro de `js/content.js`.

## Motor del menú

El menú se genera con reglas, sin depender de ninguna IA:
1. Lo que escribes en la despensa se traduce a ingredientes de la base (con sinónimos: "pechuga" = pollo, "palta" = aguacate, etc.).
2. Se filtran las recetas según cuántos ingredientes faltantes permites.
3. Se eligen 7 desayunos, almuerzos y cenas sin repetir, variando la proteína entre almuerzo y cena.
4. Las porciones se ajustan (×0.75 a ×1.75) a tus calorías objetivo: 25 % desayuno, 40 % almuerzo y 35 % cena.

Para agregar recetas, edita `js/recipes.js`. Si en el futuro conectas una IA, basta con reemplazar `generateWeek()` en `js/menu.js`.
