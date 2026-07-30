-- Historial de mails enviados a cada lead (manuales desde /admin y
-- automáticos: capítulo gratis, ebook al confirmar pago), para poder ver en
-- la ficha del lead qué ya se le mandó y evitar duplicar envíos.
-- Ejecutar en el SQL editor de Supabase.

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
