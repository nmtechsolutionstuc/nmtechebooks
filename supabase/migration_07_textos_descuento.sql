-- Migración: hace configurable el texto del campo de código de descuento y
-- de cómo se muestra el monto con descuento. Segura de correr en un proyecto existente.

alter table site_settings add column if not exists discount_field_label text not null default
  '¿Tenés un código de descuento?';
alter table site_settings add column if not exists discount_field_hint text not null default
  '(opcional, solo aplica si pagás por transferencia)';
alter table site_settings add column if not exists discount_field_placeholder text not null default
  'Ej: BIENVENIDA10';
alter table site_settings add column if not exists transfer_amount_label text not null default
  'Monto a transferir:';
alter table site_settings add column if not exists discount_applied_note text not null default
  'con tu código';
