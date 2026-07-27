# nmtech solutions — Biblioteca de Ebooks

Landing page + biblioteca de ebooks con captura de leads y panel de administración
propio. Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + Supabase
+ Gmail (para el envío de mails).

## 1. Setup de Supabase (plan free)

1. Creá un proyecto nuevo en [supabase.com](https://supabase.com) (plan free).
2. En **SQL Editor**, corré todo el contenido de [`supabase/schema.sql`](supabase/schema.sql).
3. En **Storage**, creá tres buckets:
   - `covers` → **público** (portadas de ebooks).
   - `ebook-files` → **privado** (PDFs completos; nunca se expone una URL fija, se
     generan links firmados y temporales desde el servidor).
   - `site-assets` → **público** (imagen del hero y otros assets generales del sitio,
     configurables desde `/admin → Configuración`).

   Se puede hacer a mano desde el dashboard, o corriendo (con `.env.local` ya
   completado con `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`):
   ```bash
   node scripts/create-buckets.mjs
   ```
4. En **Project Settings → API**, copiá `Project URL` y la `service_role` key
   (¡nunca la `anon` key para esto, y nunca subir la service_role key a git!).

### Crear los usuarios admin

No hay un formulario de registro (a propósito, son solo ustedes dos). Generá el hash
de la contraseña y lo insertás a mano:

```bash
node scripts/hash-password.js "tu-contraseña"
```

Copiá el hash que te imprime y corré en el SQL Editor de Supabase:

```sql
insert into admin_users (username, password_hash)
values ('tu-usuario', 'HASH_GENERADO');
```

Repetir para el segundo usuario.

### Cargar un ebook nuevo

Se hace directo en la tabla `ebooks` desde el Table Editor de Supabase (sin tocar
código): completá título, descripciones, `promo_message` (el mensaje corto y
persuasivo que se muestra en la sección destacada del Home, ej. "Dejá de tenerle
miedo a la IA y empezá a usarla a tu favor"), categoría, `cover_image_url` (subida
al bucket `covers`), precios, links de Hotmart, datos bancarios y
`private_file_path` (la ruta del PDF dentro del bucket privado `ebook-files`, ej.
`mi-ebook/completo.pdf`). Marcá `featured = true` en el que quieras que aparezca
como el ebook destacado del Home (si no marcás ninguno, se usa el más reciente).

Una vez cargado, el título, las descripciones, el `promo_message`, la categoría, los
precios y la portada se pueden seguir editando después desde `/admin → Ebooks`, sin
volver a tocar Supabase.

### Si ya corriste `schema.sql` antes (proyecto existente)

Los textos y la visibilidad de cada sección del sitio (hero, "por qué nuestros
ebooks", "quiénes somos", contacto, afiliados, footer, temáticas del formulario,
etc.) ahora se editan desde `/admin → Configuración`. Si tu proyecto ya tenía
`site_settings` creada con las 3 columnas originales, corré también
[`supabase/migration_02_site_settings_full.sql`](supabase/migration_02_site_settings_full.sql)
en el SQL Editor — usa `add column if not exists`, no borra nada.

## 2. Setup de Gmail (gratis)

Todos los mails (capítulo gratis, plantillas manuales, aviso de pago confirmado) se
mandan desde una cuenta de Gmail real, así llegan con el remitente que la gente
reconoce en vez de un dominio desconocido.

- **Límite:** ~500 mails cada 24hs en una cuenta de Gmail normal (2.000/día si es
  Google Workspace). Si algún mes se supera (ej. pico de ventas), esos mails puntuales
  se mandan a mano desde la casilla normal, usando el mismo texto de la plantilla.
- Necesitás **verificación en 2 pasos activada** en la cuenta de Gmail que vayan a usar
  (Google no deja generar contraseñas de aplicación sin esto).
- Andá a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords),
  generá una contraseña de aplicación para "Mail" (te da un código de 16 letras) y
  usala como `GMAIL_APP_PASSWORD` — **no** es la contraseña normal de la cuenta.

## 3. Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL del proyecto de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (solo servidor, nunca `NEXT_PUBLIC_`) |
| `ADMIN_SESSION_SECRET` | Secreto para firmar la sesión del admin. Generar con `openssl rand -base64 32` |
| `GMAIL_USER` | Cuenta de Gmail desde la que se manda todo |
| `GMAIL_APP_PASSWORD` | Contraseña de aplicación de esa cuenta (no la contraseña normal) |
| `GMAIL_FROM_NAME` | Nombre que se muestra como remitente (opcional, ej. "nmtech solutions") |

En Vercel, cargar las mismas variables en **Project Settings → Environment Variables**.

## 4. Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000). El panel de administración está
en `/admin` (redirige a `/admin/login` si no hay sesión).

## 5. Notas de seguridad

- El archivo completo del ebook nunca se sirve desde una URL pública fija: se genera
  un link firmado y temporal (`src/lib/storage.ts`) recién cuando un lead tiene el pago
  confirmado, y se manda por mail automáticamente.
- Las rutas `/admin/*` y `/api/admin/*` están protegidas por `src/proxy.ts` (el proxy/middleware de Next.js), que valida
  la cookie de sesión (httpOnly, secure en producción) en el servidor — no alcanza con
  ocultar botones en el frontend.
- El formulario de captura de leads y el login de admin tienen rate limiting (tabla
  `rate_limit_log` en Supabase) y el formulario público tiene un honeypot anti-bots.
- Todo dato variable insertado en mails (`{nombre}`, `{ebook}`) se escapa antes de
  mandarse, para evitar inyección de HTML a través del nombre de un lead.

## 6. Estructura

```
src/app/               páginas públicas + rutas de API
src/app/admin/          panel de administración (protegido), incluye edición de ebooks (textos + portada)
src/components/         componentes de UI reutilizables
src/lib/                Supabase, auth, mail, validación, tipos
src/proxy.ts             protege /admin y /api/admin (valida la sesión en cada request)
supabase/schema.sql      esquema de base de datos
scripts/hash-password.js utilidad para generar hashes de admin
```
