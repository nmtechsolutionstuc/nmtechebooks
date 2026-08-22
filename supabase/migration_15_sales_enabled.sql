-- Permite deshabilitar la compra de un ebook puntual (mientras solo esté
-- lista la versión gratis, por ejemplo). Con sales_enabled = false, el sitio
-- público solo deja pedir el capítulo/versión gratis: no se muestra el botón
-- "Ya lo quiero comprar" ni ninguna opción de pago para ese ebook. Por
-- default todos quedan con la venta habilitada (no se desactiva solo).
-- Ejecutar en el SQL editor de Supabase.

alter table ebooks
  add column if not exists sales_enabled boolean not null default true;
