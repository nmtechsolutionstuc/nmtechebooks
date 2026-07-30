-- Esquema de base de datos para nmtech solutions - Biblioteca de Ebooks
-- Ejecutar en el SQL editor de Supabase (proyecto nuevo, plan free).
-- Este proyecto usa siempre la service_role key desde el servidor (Route Handlers /
-- Server Components), nunca desde el browser, por lo que no dependemos de RLS para
-- la seguridad de los datos sensibles. Igualmente dejamos RLS activado y sin policies
-- públicas como capa extra de defensa.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- ebooks
-- ---------------------------------------------------------------------------
create table if not exists ebooks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null,
  long_description text not null,
  -- mensaje corto y persuasivo para la sección destacada del Home (distinto
  -- de las descripciones "informativas" de arriba)
  promo_message text not null default '',
  category text not null,
  cover_image_url text not null,
  free_chapter text not null default '',
  -- URL pública del PDF del capítulo gratis (bucket free-chapters), alternativa/complemento al texto de arriba
  free_chapter_pdf_url text not null default '',
  original_price numeric(10, 2) not null,
  current_price numeric(10, 2) not null,
  hotmart_sale_url text not null default '',
  hotmart_affiliate_url text not null default '',
  tiendanube_sale_url text not null default '',
  bank_alias text not null default '',
  bank_cbu text not null default '',
  bank_name text not null default '',
  -- path dentro del bucket privado "ebook-files" (NUNCA una URL pública fija)
  private_file_path text not null default '',
  featured boolean not null default false,
  -- false = borrador: queda oculto del sitio público (catálogo, home, página
  -- del ebook y el form de leads), pero sigue visible y editable en /admin.
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table ebooks enable row level security;

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null,
  -- campo libre y opcional: algo más que el lead quiera contarnos, aparte de la temática elegida
  interests text not null default '',
  -- qué eligió en el formulario: "leer" el capítulo gratis primero, o ir directo a "comprar"
  intent text not null default 'leer' check (intent in ('leer', 'comprar')),
  -- código de descuento aplicado (si hubo uno válido; solo afecta al precio por transferencia)
  discount_code text,
  ebook_id uuid references ebooks(id) on delete set null,
  status text not null default 'nuevo' check (status in ('nuevo', 'contactado', 'comprado')),
  payment_method text check (payment_method in ('hotmart', 'transferencia', 'tiendanube')),
  payment_confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists leads_ebook_id_idx on leads (ebook_id);
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_email_idx on leads (email);

alter table leads enable row level security;

-- ---------------------------------------------------------------------------
-- mail_log: historial de mails enviados a cada lead (manuales y automáticos),
-- para poder verlo en la ficha del lead y evitar duplicar envíos.
-- ---------------------------------------------------------------------------
create table if not exists mail_log (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  subject text not null,
  -- nombre de la plantilla usada, o una etiqueta fija para los automáticos
  -- ("Capítulo gratis", "Ebook completo (pago confirmado)")
  template_name text not null,
  sent_at timestamptz not null default now()
);

create index if not exists mail_log_lead_id_idx on mail_log (lead_id);

alter table mail_log enable row level security;

-- ---------------------------------------------------------------------------
-- mail_templates
-- ---------------------------------------------------------------------------
create table if not exists mail_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table mail_templates enable row level security;

-- ---------------------------------------------------------------------------
-- site_settings (fila única, id fijo = 1)
-- ---------------------------------------------------------------------------
create table if not exists site_settings (
  id smallint primary key default 1 check (id = 1),

  -- Hero (Home)
  hero_kicker text not null default 'nmtech solutions',
  hero_heading text not null default 'Aprendé haciendo',
  hero_tagline text not null default
    'software, datos e ia explicados por quienes los aplican todos los días — probá gratis el primer capítulo',
  hero_cta_label text not null default 'Ver Ebooks',
  -- si está vacío, se muestra el ícono por defecto en vez de una imagen
  hero_image_url text not null default '',
  hero_image_style text not null default 'circle' check (hero_image_style in ('circle', 'banner')),

  -- Visibilidad de secciones del Home
  marquee_visible boolean not null default true,
  featured_ebook_visible boolean not null default true,
  why_visible boolean not null default true,
  also_interested_visible boolean not null default true,
  about_visible boolean not null default true,

  -- Formulario de captura de lead
  lead_topics jsonb not null default
    '["IA", "SQL", "Marketing", "Automatizaciones", "Desarrollo de software", "Otro"]'::jsonb,

  -- Mail automático con el capítulo gratis, disparado al completar el formulario.
  -- Variables disponibles: {nombre}, {ebook}, {capitulo}
  free_chapter_email_subject text not null default 'Tu capítulo gratis de {ebook}',
  free_chapter_email_body text not null default
    'Hola {nombre},

Gracias por tu interés en {ebook}. Acá tenés el primer capítulo, completo y gratis:

{capitulo}

Cuando quieras seguir leyendo, en la página del ebook vas a encontrar las opciones para comprarlo completo.

Saludos,
nmtech solutions',

  -- "Por qué nuestros ebooks"
  why_heading text not null default 'Por qué nuestros ebooks',
  why_reasons jsonb not null default '[
    {"title":"Probalo antes de comprar","description":"El primer capítulo completo es gratis en cada ebook. Lo leés y recién después decidís."},
    {"title":"Escrito por quienes lo hacen","description":"Nada de teoría genérica: es lo que aplicamos día a día en proyectos reales de software, datos e IA."},
    {"title":"100% práctico","description":"Directo al grano, con ejemplos concretos para aplicar desde el primer capítulo."},
    {"title":"Precio justo","description":"Pagás una vez y es tuyo para siempre. Cuando hay oferta, la vas a ver clara en cada ebook."}
  ]'::jsonb,

  -- "Quiénes somos"
  about_heading text not null default 'Quiénes somos',
  about_text text not null default
    'Somos una ingeniera en sistemas y un ingeniero en sistemas orientado a datos, pareja y socios de trabajo. Estos ebooks son lo que sabemos, aplicado en proyectos reales.',

  -- Bloque "¿Necesitás una solución a medida?" (Home y Contacto)
  custom_solution_enabled boolean not null default true,
  custom_solution_text text not null default
    'Si te interesa que te desarrollemos una solución tecnológica a medida, conocé nuestros servicios de desarrollo.',
  custom_solution_url text not null default 'https://nmtechsolutions.vercel.app/',

  -- Footer
  footer_text text not null default 'nmtech solutions — Biblioteca de Ebooks',

  -- Contacto
  contact_heading text not null default 'Contacto',
  contact_text text not null default
    '¿Tenés dudas sobre alguno de nuestros ebooks, o necesitás que te ayudemos con desarrollo de software o automatización a medida? Escribinos, te respondemos nosotros mismos.',
  contact_email text not null default 'hola@nmtechsolutions.com',
  -- solo números con código de país, ej "5493811234567". Vacío = no se muestra el link de WhatsApp
  contact_whatsapp text not null default '',

  -- Se agrega al final de TODOS los mails que manda el sitio. Variable: {contact_email}
  email_footer_note text not null default
    'Si no encontrás este mail en tu bandeja de entrada, revisá la carpeta de spam o correo no deseado. Ante cualquier problema, escribinos a {contact_email}.',

  -- Compra y entrega del capítulo (mostrado tras completar el formulario de un ebook)
  buy_heading text not null default 'Comprá el ebook completo',
  transfer_instructions text not null default
    'Una vez que hagas la transferencia, mandanos el comprobante para confirmarte el pago y enviarte el ebook completo:',
  chapter_heading text not null default 'Primer capítulo gratis',
  chapter_missing_text text not null default
    'El capítulo gratis todavía no fue cargado. Escribinos y te lo mandamos.',
  chapter_email_note text not null default 'También te lo mandamos por mail.',

  -- Código de descuento (solo aplica al pago por transferencia)
  discount_field_label text not null default '¿Tenés un código de descuento?',
  discount_field_hint text not null default '(opcional, solo aplica si pagás por transferencia)',
  discount_field_placeholder text not null default 'Ej: BIENVENIDA10',
  transfer_amount_label text not null default 'Monto a transferir:',
  discount_applied_note text not null default 'con tu código',

  terms_notice_text text not null default 'Al comprar, aceptás nuestros Términos y Condiciones.',

  -- Términos y condiciones (página /terminos)
  terms_heading text not null default 'Términos y Condiciones',
  terms_content text not null default
    'Última actualización: 2026.

Estos Términos y Condiciones ("Términos") regulan el uso de este sitio y la compra de los ebooks ofrecidos por nmtech solutions ("nosotros"). Al enviar el formulario de este sitio, comprar un ebook, o descargar cualquier contenido, aceptás estos Términos en su totalidad. Si no estás de acuerdo, no debés usar el sitio ni comprar nuestros productos.

1. PRODUCTO. Los ebooks son productos digitales (PDF y/o texto) entregados exclusivamente por medios electrónicos. No se realiza ningún envío físico. La compra no incluye soporte técnico, consultoría personalizada ni actualizaciones futuras del contenido, salvo que se indique expresamente en la página del producto.

2. MEDIOS DE PAGO. 2.1. Hotmart: la compra se procesa íntegramente en la plataforma Hotmart, que actúa como intermediario de pago y aplica sus propios términos y política de reembolsos, ajenos a nosotros. No somos responsables por errores, demoras o fallas de la plataforma Hotmart. 2.2. Transferencia bancaria: es un medio de pago manual. El envío de un comprobante NO constituye ni implica la confirmación del pago. El acceso al ebook completo se habilita ÚNICAMENTE una vez que el dinero impacta de forma efectiva y verificada en la cuenta bancaria informada. Mientras el pago no esté confirmado de esta manera, no se entrega ningún contenido, cualquiera sea el motivo de la demora, error o inconveniente en la acreditación.

3. ENTREGA. 3.1. Una vez confirmado el pago (por Hotmart, o por transferencia verificada según el punto 2.2), el ebook se envía por mail a la dirección provista por el comprador. 3.2. El tiempo de entrega es orientativo y no constituye una obligación de plazo fijo. Podemos demorar la entrega sin que ello genere derecho a reembolso, reclamo ni compensación alguna, especialmente en situaciones de alto volumen de pedidos, mantenimiento, causas de fuerza mayor, o cualquier circunstancia ajena a nuestra voluntad. 3.3. Es responsabilidad del comprador proporcionar una dirección de mail válida y revisar la carpeta de spam/promociones. No nos responsabilizamos por la no recepción del mail debido a errores de tipeo, filtros de spam, o casillas llenas.

4. PRECIOS Y OFERTAS. Los precios pueden modificarse sin previo aviso. El precio válido es el vigente al momento de confirmarse el pago. Las ofertas y descuentos son por tiempo limitado y a nuestra entera discreción, pudiendo finalizar o modificarse en cualquier momento.

5. POLÍTICA DE REEMBOLSOS. 5.1. Por tratarse de un producto digital con acceso inmediato y completo al contenido, no se realizan reembolsos una vez entregado el ebook completo, salvo que la normativa vigente aplicable lo exija de forma imperativa. 5.2. Las compras hechas a través de Hotmart se rigen exclusivamente por la política de reembolsos de Hotmart; cualquier reclamo por reembolso debe gestionarse directamente con Hotmart. 5.3. En compras por transferencia, cualquier reclamo debe realizarse dentro de las 48 horas de recibido el ebook, por los canales de contacto oficiales. La evaluación del reclamo y su eventual resolución quedan a nuestro exclusivo criterio.

6. PROPIEDAD INTELECTUAL. 6.1. Todo el contenido de los ebooks (textos, estructura, diseño, marca) es propiedad exclusiva de nmtech solutions y está protegido por las leyes de propiedad intelectual vigentes. 6.2. La compra otorga una licencia de uso personal, individual e intransferible. Queda expresamente prohibido reproducir, distribuir, revender, compartir, publicar, subir a internet, prestar o poner a disposición de terceros el contenido, en forma total o parcial, por cualquier medio, sin autorización previa y por escrito de nmtech solutions. 6.3. El incumplimiento habilita a iniciar las acciones legales que correspondan y a reclamar los daños y perjuicios ocasionados, sin perjuicio de la suspensión inmediata de cualquier acceso otorgado al infractor.

7. AUSENCIA DE GARANTÍAS DE RESULTADO. El contenido de los ebooks tiene fines educativos e informativos. No garantizamos resultados específicos, económicos o de otra índole, derivados de la aplicación de la información contenida. La implementación de cualquier consejo, técnica o estrategia descripta es responsabilidad exclusiva del comprador.

8. LIMITACIÓN DE RESPONSABILIDAD. En la máxima medida permitida por la ley aplicable, no seremos responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, ni por lucro cesante, pérdida de datos o de oportunidades de negocio, derivados del uso o la imposibilidad de uso del sitio o de los ebooks. En ningún caso nuestra responsabilidad total frente al comprador superará el monto efectivamente abonado por el producto en cuestión.

9. DATOS PERSONALES. Los datos que nos proporcionás (nombre, mail, temática de interés y cualquier comentario opcional) se usan exclusivamente para gestionar la entrega del ebook, dar seguimiento a tu consulta o compra, y comunicarte novedades relacionadas. No vendemos ni cedemos tus datos a terceros, salvo lo estrictamente necesario para procesar el pago a través de Hotmart cuando corresponda. Podés solicitar la baja o eliminación de tus datos escribiéndonos por los canales de contacto.

10. MODIFICACIONES. Nos reservamos el derecho de modificar estos Términos, el contenido, los precios o la disponibilidad de los ebooks en cualquier momento y sin previo aviso. Las modificaciones no afectan a las compras ya confirmadas al momento del cambio.

11. FUERZA MAYOR. No seremos responsables por incumplimientos o demoras derivados de causas fuera de nuestro control razonable, incluyendo fallas de plataformas de terceros (Hotmart, proveedores de mail, bancos), cortes de servicio de internet o energía, o cualquier otro caso fortuito o de fuerza mayor.

12. LEY APLICABLE Y JURISDICCIÓN. Estos Términos se rigen por las leyes de la República Argentina. Para cualquier controversia derivada de estos Términos, las partes se someten a los tribunales ordinarios competentes, renunciando a cualquier otro fuero o jurisdicción que pudiera corresponder.

13. DIVISIBILIDAD. Si alguna cláusula de estos Términos fuera declarada inválida o inaplicable, las restantes cláusulas mantendrán plena vigencia.

14. ACEPTACIÓN. El uso del sitio, el envío del formulario de contacto/captura de datos, y/o la compra de un ebook implican la aceptación plena e incondicional de estos Términos y Condiciones.

15. CONTACTO. Ante cualquier duda sobre estos Términos, podés escribirnos por los medios indicados en la sección Contacto del sitio.',

  -- Afiliados
  affiliates_heading text not null default 'Afiliados',
  affiliates_intro text not null default
    '¿Nunca vendiste como afiliado? Es más simple de lo que parece: te sumás a un programa, te dan un link, y ganás una comisión por cada venta que se haga con ese link. Así funciona con nuestros ebooks a través de Hotmart.',
  affiliates_steps jsonb not null default '[
    {"title":"Te sumás al programa","description":"Elegís el ebook que quieras promocionar y te sumás a su programa de afiliados en Hotmart, gratis."},
    {"title":"Compartís tu link único","description":"Hotmart te da un link personal para ese ebook. Lo compartís donde quieras: redes, mail, tu propia web."},
    {"title":"Cobrás tu comisión","description":"Cada venta hecha con tu link te deja una comisión que te paga Hotmart automáticamente. Nosotros no gestionamos nada de esto: es todo entre vos y Hotmart."}
  ]'::jsonb,

  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

insert into site_settings (id)
values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- admin_users (login simple para nosotros dos)
-- ---------------------------------------------------------------------------
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;

-- Para crear un usuario admin, generar el hash con:
--   node scripts/hash-password.js "tu-contraseña"
-- y luego correr:
--   insert into admin_users (username, password_hash) values ('usuario', 'HASH_GENERADO');

-- ---------------------------------------------------------------------------
-- rate_limit_log (rate limiting simple sin depender de un servicio externo)
-- ---------------------------------------------------------------------------
create table if not exists rate_limit_log (
  id bigserial primary key,
  key text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_log_key_created_idx on rate_limit_log (key, created_at);

alter table rate_limit_log enable row level security;

-- ---------------------------------------------------------------------------
-- discount_codes (códigos de descuento, solo aplican a compras por transferencia)
-- ---------------------------------------------------------------------------
create table if not exists discount_codes (
  id uuid primary key default gen_random_uuid(),
  -- se guarda en mayúsculas, la comparación es case-insensitive
  code text unique not null,
  discount_percent numeric(5, 2) not null check (discount_percent > 0 and discount_percent <= 100),
  active boolean not null default true,
  -- null = aplica a cualquier ebook
  ebook_id uuid references ebooks(id) on delete cascade,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists discount_codes_code_idx on discount_codes (code);

alter table discount_codes enable row level security;

-- No hay policies públicas: todo el acceso a estas tablas se hace exclusivamente
-- desde el servidor con la service_role key (ver src/lib/supabase.ts).
