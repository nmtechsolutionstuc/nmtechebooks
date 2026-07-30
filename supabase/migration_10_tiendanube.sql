-- Agrega el link de venta en Tiendanube como segundo medio de compra online
-- (además de Hotmart). Ejecutar en el SQL editor de Supabase.

alter table ebooks
  add column if not exists tiendanube_sale_url text not null default '';
