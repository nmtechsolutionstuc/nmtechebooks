-- Migración: nota de "revisá spam / escribinos a {contact_email}" al pie de
-- todos los mails que manda el sitio. Segura de correr en un proyecto existente.

alter table site_settings add column if not exists email_footer_note text not null default
  'Si no encontrás este mail en tu bandeja de entrada, revisá la carpeta de spam o correo no deseado. Ante cualquier problema, escribinos a {contact_email}.';
