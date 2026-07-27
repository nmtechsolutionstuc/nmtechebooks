-- Migración: PDF del capítulo gratis + textos configurables del bloque de
-- compra/entrega + WhatsApp de contacto. Segura de correr en un proyecto
-- existente ("add column if not exists").

alter table ebooks add column if not exists free_chapter_pdf_url text not null default '';

alter table site_settings add column if not exists contact_whatsapp text not null default '';

alter table site_settings add column if not exists buy_heading text not null default
  'Comprá el ebook completo';
alter table site_settings add column if not exists transfer_instructions text not null default
  'Una vez que hagas la transferencia, mandanos el comprobante para confirmarte el pago y enviarte el ebook completo:';
alter table site_settings add column if not exists chapter_heading text not null default
  'Primer capítulo gratis';
alter table site_settings add column if not exists chapter_missing_text text not null default
  'El capítulo gratis todavía no fue cargado. Escribinos y te lo mandamos.';
alter table site_settings add column if not exists chapter_email_note text not null default
  'También te lo mandamos por mail.';
