-- Migración: hace todo el contenido del sitio configurable desde /admin.
-- Es seguro correrla en un proyecto que ya tiene site_settings creado con
-- las 3 columnas originales: usa "add column if not exists", no borra nada.

alter table site_settings add column if not exists hero_kicker text not null default 'nmtech solutions';
alter table site_settings add column if not exists hero_heading text not null default 'Aprendé haciendo';
alter table site_settings add column if not exists hero_tagline text not null default
  'software, datos e ia explicados por quienes los aplican todos los días — probá gratis el primer capítulo';
alter table site_settings add column if not exists hero_cta_label text not null default 'Ver Ebooks';
alter table site_settings add column if not exists hero_image_url text not null default '';

alter table site_settings add column if not exists marquee_visible boolean not null default true;
alter table site_settings add column if not exists featured_ebook_visible boolean not null default true;
alter table site_settings add column if not exists why_visible boolean not null default true;
alter table site_settings add column if not exists also_interested_visible boolean not null default true;
alter table site_settings add column if not exists about_visible boolean not null default true;

alter table site_settings add column if not exists lead_topics jsonb not null default
  '["IA", "SQL", "Marketing", "Automatizaciones", "Desarrollo de software", "Otro"]'::jsonb;

alter table leads add column if not exists interests text not null default '';

alter table site_settings add column if not exists why_heading text not null default 'Por qué nuestros ebooks';
alter table site_settings add column if not exists why_reasons jsonb not null default '[
  {"title":"Probalo antes de comprar","description":"El primer capítulo completo es gratis en cada ebook. Lo leés y recién después decidís."},
  {"title":"Escrito por quienes lo hacen","description":"Nada de teoría genérica: es lo que aplicamos día a día en proyectos reales de software, datos e IA."},
  {"title":"100% práctico","description":"Directo al grano, con ejemplos concretos para aplicar desde el primer capítulo."},
  {"title":"Precio justo","description":"Pagás una vez y es tuyo para siempre. Cuando hay oferta, la vas a ver clara en cada ebook."}
]'::jsonb;

alter table site_settings add column if not exists about_heading text not null default 'Quiénes somos';
alter table site_settings add column if not exists about_text text not null default
  'Somos una ingeniera en sistemas y un ingeniero en sistemas orientado a datos, pareja y socios de trabajo. Estos ebooks son lo que sabemos, aplicado en proyectos reales.';

alter table site_settings add column if not exists footer_text text not null default 'nmtech solutions — Biblioteca de Ebooks';

alter table site_settings add column if not exists contact_heading text not null default 'Contacto';
alter table site_settings add column if not exists contact_text text not null default
  '¿Tenés dudas sobre alguno de nuestros ebooks, o necesitás que te ayudemos con desarrollo de software o automatización a medida? Escribinos, te respondemos nosotros mismos.';
alter table site_settings add column if not exists contact_email text not null default 'hola@nmtechsolutions.com';

alter table site_settings add column if not exists affiliates_heading text not null default 'Afiliados';
alter table site_settings add column if not exists affiliates_intro text not null default
  '¿Nunca vendiste como afiliado? Es más simple de lo que parece: te sumás a un programa, te dan un link, y ganás una comisión por cada venta que se haga con ese link. Así funciona con nuestros ebooks a través de Hotmart.';
alter table site_settings add column if not exists affiliates_steps jsonb not null default '[
  {"title":"Te sumás al programa","description":"Elegís el ebook que quieras promocionar y te sumás a su programa de afiliados en Hotmart, gratis."},
  {"title":"Compartís tu link único","description":"Hotmart te da un link personal para ese ebook. Lo compartís donde quieras: redes, mail, tu propia web."},
  {"title":"Cobrás tu comisión","description":"Cada venta hecha con tu link te deja una comisión que te paga Hotmart automáticamente. Nosotros no gestionamos nada de esto: es todo entre vos y Hotmart."}
]'::jsonb;
