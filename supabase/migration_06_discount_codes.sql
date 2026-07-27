-- Migración: códigos de descuento (solo aplican a compras por transferencia).
-- Segura de correr en un proyecto existente.

alter table leads add column if not exists discount_code text;

create table if not exists discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_percent numeric(5, 2) not null check (discount_percent > 0 and discount_percent <= 100),
  active boolean not null default true,
  ebook_id uuid references ebooks(id) on delete cascade,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists discount_codes_code_idx on discount_codes (code);

alter table discount_codes enable row level security;
