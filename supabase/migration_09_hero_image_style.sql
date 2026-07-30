-- Migración: elegir el estilo de la imagen del hero (círculo o banner ancho).
-- Segura de correr en un proyecto existente.

alter table site_settings add column if not exists hero_image_style text not null default 'circle'
  check (hero_image_style in ('circle', 'banner'));
