-- Modo borrador para ebooks: los que tengan published=false quedan ocultos
-- del sitio público (catálogo, home, /ebooks/[slug] y el form de leads) pero
-- siguen visibles y editables en /admin. Por default todos quedan publicados
-- (los que ya tenías cargados no se ocultan solos).
-- Ejecutar en el SQL editor de Supabase.

alter table ebooks
  add column if not exists published boolean not null default true;
