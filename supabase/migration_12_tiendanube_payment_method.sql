-- Permite guardar "tiendanube" como medio de pago elegido por un lead
-- (hasta ahora el check constraint solo permitía 'hotmart' o 'transferencia').
-- Ejecutar en el SQL editor de Supabase.

alter table leads drop constraint if exists leads_payment_method_check;

alter table leads
  add constraint leads_payment_method_check
  check (payment_method in ('hotmart', 'transferencia', 'tiendanube'));
