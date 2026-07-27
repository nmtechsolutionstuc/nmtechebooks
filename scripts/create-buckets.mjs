// Script de uso único: crea los buckets de Storage que necesita el proyecto.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const buckets = [
  { name: "covers", public: true },
  { name: "ebook-files", public: false },
  { name: "site-assets", public: true },
  { name: "free-chapters", public: true },
];

for (const bucket of buckets) {
  const { error } = await supabase.storage.createBucket(bucket.name, {
    public: bucket.public,
  });
  if (error) {
    console.error(`Error creando "${bucket.name}":`, error.message);
  } else {
    console.log(`Bucket "${bucket.name}" creado (public: ${bucket.public}).`);
  }
}
