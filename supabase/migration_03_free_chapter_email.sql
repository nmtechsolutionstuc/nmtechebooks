-- Migración: agrega la plantilla editable del mail automático del capítulo
-- gratis. Segura de correr en un proyecto existente ("add column if not exists").

alter table site_settings add column if not exists free_chapter_email_subject text not null default
  'Tu capítulo gratis de {ebook}';

alter table site_settings add column if not exists free_chapter_email_body text not null default
  'Hola {nombre},

Gracias por tu interés en {ebook}. Acá tenés el primer capítulo, completo y gratis:

{capitulo}

Cuando quieras seguir leyendo, en la página del ebook vas a encontrar las opciones para comprarlo completo.

Saludos,
nmtech solutions';

-- Qué eligió el lead en el formulario: leer el capítulo gratis primero, o ir directo a comprar.
alter table leads add column if not exists intent text not null default 'leer' check (intent in ('leer', 'comprar'));
