# Prompt para Claude Code: Landing + Biblioteca de Ebooks + Panel Admin (con identidad visual)

Copiá y pegá el siguiente prompt en Claude Code para crear el proyecto Next.js nuevo, desde cero (separado de nmtechsolutions):

---

Quiero crear un proyecto Next.js nuevo, desde cero, que sea una landing page de presentación de nosotros dos como equipo (una ingeniera en sistemas y un ingeniero en sistemas orientado a datos, pareja y socios de trabajo), con una "Biblioteca de Ebooks" que capture leads en una base de datos propia, y un panel de administración privado para gestionar esos leads y enviarles mails manualmente con plantillas precargadas. No vamos a usar ningún servicio externo de automatización de mails (nada de Mailchimp, Systeme.io, etc.): todo lo manejamos nosotros desde nuestro propio panel.

## IDENTIDAD VISUAL Y SISTEMA DE DISEÑO

Base: tema oscuro tipo "creative portfolio" (dark, editorial, con gradientes sutiles y animaciones al hacer scroll), adaptado a un proyecto de desarrollo de software + ebooks, no a un portfolio 3D. Usar React/Next.js, TypeScript, Tailwind CSS, Framer Motion y Lucide React.

**Estilos globales:**
- Fondo: `#0C0C0C` en html, body y el wrapper principal.
- Tipografía: 'Kanit' (Google Fonts, pesos 300-900), sans-serif en todo el sitio.
- Reset global: box-sizing border-box, margin 0, padding 0.
- Clase `.gradient-heading` para títulos grandes: `background: linear-gradient(180deg, #FFE3A3 0%, #FF7A00 100%)` (dorado cálido a naranja) con `-webkit-background-clip: text` y `-webkit-text-fill-color: transparent`.
- Texto de cuerpo sobre fondo oscuro: color `#D7E2EA`.
- Wrapper principal con `overflow-x: clip` para evitar scroll horizontal por las animaciones.
- Las páginas públicas (Home, /ebooks, /ebooks/[slug], /contacto, /afiliados) usan este tema oscuro. El panel **/admin** usa el mismo sistema de tipografía y colores de marca, pero priorizando legibilidad y densidad de información sobre el efecto visual: menos animación, tablas y formularios claros, fondo claro u oscuro simple sin gradientes decorativos.

**Componentes reutilizables:**
- `BotonPrincipal` (CTA principal, ej. "Ver Ebooks", "Comprar", "Escribinos"): píldora redondeada, fondo con gradiente `linear-gradient(123deg, #3A1B00 7%, #E85D00 37%, #FF9500 72%, #FFD166 100%)` (tonos naranja/amarillo), box-shadow interior `0px 4px 4px rgba(255,149,0,0.25), 4px 4px 12px #E85D00 inset`, borde blanco 2px con offset -3px. Texto blanco, font-medium, uppercase, tracking-widest. Padding responsive (px-8 py-3 en mobile hasta px-12 py-4 en desktop).
- `BotonSecundario` (ghost, ej. "Ver ebook completo", "Sumarme como afiliado"): píldora con borde 2px `#D7E2EA`, texto `#D7E2EA`, mismo tipografiado uppercase/tracking-widest, hover con fondo `#D7E2EA`/10.
- `FadeIn`: wrapper de Framer Motion con `whileInView` (once: true), delay/duration/x/y configurables, easing `[0.25, 0.1, 0.25, 1]`. Usarlo en casi todos los bloques de texto e imágenes para que aparezcan al hacer scroll.
- `Magnet`: efecto de imán al mover el mouse cerca de un elemento (por ejemplo el gráfico/ilustración del hero, ver nota más abajo), con transform suave de entrada (0.3s ease-out) y salida (0.6s ease-in-out). Usarlo con moderación, en un solo elemento por página como máximo, para que se sienta como un detalle y no distraiga.
- `AnimatedText`: animación de texto letra por letra según el progreso de scroll (opacity 0.2 → 1), para párrafos destacados (por ejemplo el texto de "Sobre nosotros").
- `TarjetasApiladas`: efecto de tarjetas sticky que se van apilando y escalando levemente hacia abajo a medida que se hace scroll (useScroll + useTransform de Framer Motion), bordes muy redondeados, borde 2px `#D7E2EA`, fondo `#0C0C0C`. Se usa para destacar ebooks (ver Home más abajo).
- `Marquee`: dos filas de imágenes que se desplazan horizontalmente según el scroll de la página (una fila hacia la derecha, la otra hacia la izquierda), tiles con `border-radius` grande, `object-cover`, lazy loading, `will-change: transform` y listener de scroll pasivo para performance.

**Nota sobre assets decorativos:** el diseño de referencia usaba imágenes 3D personalizadas (íconos flotantes en las esquinas de la sección "About") y un retrato fotográfico en el hero. Como este proyecto no es un portfolio 3D y **no queremos mostrar nuestras caras**, todas esas imágenes se reemplazan por íconos de Lucide React a gran escala (por ejemplo: `Code2`, `Database`, `BrainCircuit`, `BookOpen`) con opacidad baja o tratamiento monocromo (en tonos naranja/amarillo de la paleta), posicionados de forma similar (esquinas, hero, con FadeIn desde los costados), para mantener el mismo efecto de composición sin depender de fotos personales ni renders 3D que no tenemos.

## ESTRUCTURA GENERAL DEL SITIO (con su tratamiento visual)

**1. Página de inicio (/):** el Home está enfocado 100% en vender los ebooks, no en presentar la empresa. Orden de secciones:
- Hero: navbar con 4 links (Inicio, Ebooks, Afiliados, Contacto), uppercase, tracking-wide, color `#D7E2EA`. Título gigante con `.gradient-heading` con un gancho corto orientado al lector (ej. "Aprendé haciendo"), font-black, uppercase, tamaño fluido con `vw`, con "nmtech solutions" como texto pequeño arriba (kicker). Debajo, texto corto y persuasivo (qué vas a aprender, que el primer capítulo es gratis) y `BotonPrincipal` hacia la biblioteca de ebooks. En vez del retrato del ejemplo, un ícono/ilustración abstracta con el efecto `Magnet` — **sin fotos de nuestras caras**.
- Marquee: fila(s) de portadas de los ebooks disponibles (tomadas dinámicamente de la base de datos), desplazándose con el scroll.
- **Ebook destacado**: como por ahora hay un solo ebook (de IA), se muestra en grande arriba de todo: portada grande, categoría, título, un `promo_message` corto y persuasivo destacado con borde (ej. "Dejá de tenerle miedo a la IA y empezá a usarla a tu favor"), descripción larga, precio, y **el formulario de captura de lead embebido ahí mismo** (no hace falta ir a `/ebooks/[slug]` para completarlo — al enviarlo se revela el capítulo gratis y las opciones de compra sin salir del Home). Tanto el `promo_message` como el resto de los textos y la portada son editables desde `/admin → Ebooks`. Cuando haya más de un ebook marcado como destacado, se muestra el primero.
- Sección "Por qué nuestros ebooks" (fondo claro `#FFFFFF`, esquinas superiores redondeadas): 4 razones cortas con ícono (probalo gratis primero, escrito por quienes lo aplican, práctico, precio justo) — reemplaza la vieja sección de "servicios" tipo empresa.
- "También te puede interesar": grid con el resto de los ebooks (si hay más de uno), mismas tarjetas que el catálogo, cada uno con su propia página en `/ebooks/[slug]` (esto ya soporta cualquier cantidad de ebooks a futuro, no hace falta programar nada nuevo por cada uno nuevo).
- Sección compacta "Quiénes somos": una sola sección corta (no la elaborada de antes) con `AnimatedText`, y ahí mismo, el bloque configurable con el link a nmtechsolutions.

**2. Página catálogo (/ebooks):** grid responsive de tarjetas (no el efecto de apilado, que queda solo para el teaser del Home) con portada, título, descripción corta, categoría/temática como tag, y precio (ver lógica de precios/ofertas más abajo). Mismo fondo oscuro y tipografía Kanit, con `FadeIn` escalonado por tarjeta.

**3. Página individual por ebook (/ebooks/[slug]):** portada grande, descripción larga, y el primer capítulo completo GRATIS (texto o imagen, se entrega completo, no cortado) una vez que la persona completa el formulario de captura de lead. Después del capítulo gratis, mensaje claro tipo "Si querés seguir leyendo, comprá el ebook completo" con las opciones de compra (Hotmart / transferencia, ver formulario más abajo). Formulario y CTAs con los componentes `BotonPrincipal`/`BotonSecundario`.

**4. Página o sección de contacto:** mail y breve texto invitando a escribir por dudas de los ebooks o para desarrollo/automatización a medida, con `BotonPrincipal` tipo "Escribinos".

**4bis. Sección "¿Necesitás una solución a medida?":** un bloque (en Home, cerca de "Qué hacemos", y también visible en /contacto) que invite a quien le interese que le desarrollemos una solución tecnológica a visitar una página externa con nuestros servicios de desarrollo (actualmente `https://nmtechsolutions.vercel.app/`, donde se explican los servicios, se puede pedir presupuesto y ver ejemplos de trabajos ya hechos). El texto del bloque y la URL del link **deben ser editables desde `/admin`** (no hardcodeados en el componente), por si el link cambia en el futuro. Se guarda en una tabla/registro de configuración del sitio (`site_settings`: texto del bloque, URL, y un flag para mostrarlo u ocultarlo).

**5. Página /afiliados:** sección informativa (no hay que programar ningún sistema de afiliados propio, todo lo gestiona Hotmart) explicando en lenguaje simple qué es un programa de afiliados, cómo funciona (te sumás, te dan un link único, cada venta con ese link deja una comisión que paga Hotmart automáticamente), y `BotonPrincipal` para sumarse al programa de afiliados en Hotmart. Se puede usar el mismo tratamiento de íconos Lucide grandes (`Link2`, `Percent`, `Handshake`) a modo ilustrativo.

**6. El primer capítulo gratis NO debe mostrarse** hasta que la persona complete el formulario de captura. A partir de ahí, para acceder al resto del ebook, la persona tiene que comprarlo.

**7. Panel de administración en /admin**, protegido con login (usuario y contraseña simple, solo para nosotros dos), con las secciones descriptas en "PANEL DE ADMINISTRACIÓN" más abajo. Visualmente más sobrio que el resto del sitio (ver nota en "Identidad visual").

## BASE DE DATOS PROPIA

Usar una base de datos simple, fácil de mantener y gratuita para el volumen que vamos a tener al principio (por ejemplo SQLite, o el plan free de Postgres en Vercel/Neon/Supabase) con al menos estas tablas:
- **Leads:** nombre, mail, temática de interés, ebook desde el que se registró, fecha de registro, estado (nuevo / contactado / comprado), método de pago elegido si compró (Hotmart / transferencia), fecha de pago confirmado.
- **Ebooks:** id/slug, título, descripción corta, descripción larga, categoría/temática, imagen de portada, primer capítulo gratis (texto o link a archivo), precio original, precio actual/de oferta, link de venta en Hotmart, datos de transferencia (alias/CBU) y archivo o link del ebook completo para enviar por mail una vez pagado.
- **Plantillas de mail:** nombre de la plantilla, asunto, cuerpo del mensaje (con variables como `{nombre}` y `{ebook}` para autocompletar).
- **Configuración del sitio (site_settings):** registro único editable con el texto y la URL de la sección "¿Necesitás una solución a medida?" (por defecto apuntando a `https://nmtechsolutions.vercel.app/`) y un flag para mostrarla u ocultarla.

## MODELO DE DATOS DE UN EBOOK (para que sea reutilizable a futuro sin tocar código)

- id / slug
- título
- descripción corta (para la tarjeta del catálogo)
- descripción larga (para la página individual)
- mensaje de convencimiento / promo_message (frase corta y persuasiva para la sección destacada del Home, distinta de las descripciones)
- categoría/temática (ej: "IA", "SQL", "Marketing")
- imagen de portada
- primer capítulo gratis (texto completo, o link a un PDF/imagen)
- precio original (para mostrar tachado cuando hay oferta)
- precio actual/de oferta (el que se cobra realmente; si es igual al original, no se muestra tachado ni cartel de oferta)
- link de venta en Hotmart
- link para sumarse al programa de afiliados de ese ebook en Hotmart
- datos de transferencia bancaria (alias, CBU, banco)
- archivo o link privado del ebook completo (para adjuntar/enviar una vez confirmado el pago)

## PRECIOS Y OFERTAS

En la tarjeta del catálogo y en la página individual del ebook, mostrar el precio de forma llamativa: si hay oferta (precio original ≠ precio actual), mostrar el precio original tachado al lado del precio actual, y un cartelito tipo "Oferta" o el porcentaje de descuento. Si no hay oferta, mostrar solo el precio actual. Esto tiene que poder cargarse/editarse fácilmente desde la base de datos (no hardcodeado), idealmente desde el panel de administración.

## FORMULARIO DE CAPTURA DE LEAD

Campos: nombre, mail, y un select o checkboxes de "¿qué temática te interesa?".
Al enviar el formulario:
1. Guardar el lead en la base de datos propia (nombre, mail, temática, ebook de origen, fecha, estado "nuevo").
2. Mostrar en pantalla el fragmento gratis del ebook (sin recargar la página).
3. Mostrar las dos opciones de compra del ebook completo: un botón "Comprar por Hotmart" (redirige al link de Hotmart) y una opción "Pagar por transferencia" que muestra los datos bancarios y un texto claro tipo "Una vez que hagas la transferencia, mandanos el comprobante a este mail/WhatsApp para que te enviemos el ebook completo".

## PANEL DE ADMINISTRACIÓN (/admin, con login)

1. Listado de leads con filtros (por ebook, por temática, por estado: nuevo / contactado / comprado).
2. Desde cada lead, poder:
   - Ver sus datos.
   - Elegir una plantilla de mail precargada (de una lista editable de plantillas guardadas en la base de datos), que se autocompleta con el nombre del lead y el ebook correspondiente, y enviarla con un clic.
   - Marcar el lead como "contactado".
   - Si el lead avisó que pagó por transferencia, marcarlo como "pago confirmado", lo cual dispara automáticamente el envío de un mail con el ebook completo adjunto o con el link privado de descarga.
3. Una sección simple de "Plantillas de mail" donde se puedan crear, editar y borrar plantillas (asunto + cuerpo con variables `{nombre}` y `{ebook}`), para reusarlas en distintos leads sin reescribir cada vez.
3bis. Una sección "Configuración del sitio" donde se pueda editar el texto y la URL de la sección "¿Necesitás una solución a medida?" (link a nmtechsolutions u otro), y activarla/desactivarla.
3ter. Una sección "Ebooks" donde se puedan editar los ebooks que ya existen: título, descripción corta y larga, categoría, precios, si está destacado, links de Hotmart, datos bancarios, y **subir/reemplazar la imagen de portada** (sube el archivo a Supabase Storage y actualiza el link automáticamente, no hay que pegar una URL a mano). Cargar un ebook completamente nuevo se sigue haciendo con un registro nuevo en la tabla `ebooks` de Supabase, como está definido más arriba.
4. El envío real de los mails puede hacerse con un servicio simple de envío transaccional, priorizando siempre la opción gratuita (por ejemplo, el plan free de Resend, que suele alcanzar para unos cientos de mails por mes). Dejar la API key en variable de entorno, no hardcodeada. Indicame en el código o en un comentario cuál es el límite mensual/diario del plan gratuito elegido, para saber hasta cuántos mails podemos mandar sin pagar. Si en algún momento se supera ese límite (por ejemplo, si vendemos muchos ebooks de golpe), no hace falta automatizar nada extra: en ese caso mandamos esos mails puntuales de forma manual desde nuestra casilla normal, usando el mismo texto de la plantilla.

## REQUISITOS TÉCNICOS

- Next.js, deploy en Vercel.
- Login simple y seguro para el panel /admin (solo nosotros dos vamos a entrar ahí).
- Formulario con validación básica de mail (formato correcto) y campos obligatorios.
- Mensajes claros de éxito o error en cada acción (formulario público y panel admin).
- Diseño responsive (mobile-first), siguiendo el sistema de diseño definido arriba (tema oscuro, Kanit, gradientes, animaciones con Framer Motion) como identidad visual propia del proyecto, separada de nmtechsolutions.
- Que agregar un ebook nuevo en el futuro sea simple: un registro nuevo en la tabla de ebooks, sin tocar componentes.

## SEGURIDAD (importante, aplicar en todo el proyecto)

- El archivo o link del ebook completo NUNCA debe ser público ni adivinable: no exponer URLs directas y fijas a los archivos. Usar links firmados/temporales o servir el archivo desde una API route que valide primero que ese lead tiene el pago confirmado antes de entregarlo.
- El acceso al panel /admin debe estar protegido con autenticación real (contraseña hasheada, nunca en texto plano) y las rutas de API del admin también deben validar la sesión en el backend, no solo ocultar el botón en el frontend.
- Validar y sanitizar todos los datos que vienen de formularios (lead, plantillas de mail, etc.) tanto en frontend como en backend, para evitar inyección de código o de SQL (usar consultas parametrizadas u ORM, nunca concatenar strings en queries).
- Agregar rate limiting (límite de intentos por IP/tiempo) en el formulario de captura de lead y en el login del admin, para evitar spam masivo de mails falsos y ataques de fuerza bruta al login.
- Agregar protección básica anti-bots en el formulario público (por ejemplo un captcha simple o un honeypot) para que no se pueda automatizar la creación de leads falsos.
- Todas las variables sensibles (contraseñas, API keys, credenciales de base de datos, credenciales del servicio de mail) van en variables de entorno, nunca hardcodeadas ni subidas al repositorio.
- Todo el sitio debe servirse por HTTPS (por defecto en Vercel) y las cookies de sesión del admin deben ser seguras (httpOnly, secure).
- Los mails que se envían desde el panel (con las plantillas) deben tratarse como contenido de confianza limitada: sanitizar cualquier dato variable que se inserte (`{nombre}`, `{ebook}`) para evitar que alguien intente inyectar código a través de su nombre en el formulario.
- Hacer un manejo de errores prolijo: no mostrar mensajes de error técnicos ni detalles del sistema al usuario final (solo mensajes genéricos), y loggear los errores reales solo del lado del servidor.

## CRITERIO GENERAL

Priorizar siempre las opciones gratuitas o de plan free en cualquier servicio que haga falta (base de datos, envío de mails, hosting, etc.), ya que al principio el volumen de ventas va a ser bajo. Antes de programar, preguntame el nombre que le vamos a poner al proyecto/marca, qué servicio de base de datos y de envío de mails preferimos usar (priorizando siempre el plan gratuito y explicándome sus límites), y cualquier duda sobre el diseño visual o los assets (fotos, portadas de ebooks) a usar.

---
