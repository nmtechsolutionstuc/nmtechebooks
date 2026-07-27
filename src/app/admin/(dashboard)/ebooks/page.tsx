"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import type { Ebook } from "@/lib/types";

const EMPTY_NEW_EBOOK = {
  title: "",
  category: "",
  short_description: "",
  long_description: "",
  promo_message: "",
  original_price: 0,
  current_price: 0,
};

export default function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Ebook>>({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [creating, setCreating] = useState(false);
  const [newEbook, setNewEbook] = useState(EMPTY_NEW_EBOOK);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [createMessage, setCreateMessage] = useState("");
  const [createSaving, setCreateSaving] = useState(false);
  const [uploadingChapterPdf, setUploadingChapterPdf] = useState(false);

  async function fetchEbooks() {
    const res = await fetch("/api/admin/ebooks");
    const data = await res.json();
    setEbooks(res.ok ? data.ebooks : []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos, patrón estándar sin lib de data-fetching.
    fetchEbooks();
  }, []);

  function selectEbook(ebook: Ebook) {
    setCreating(false);
    setSelectedId(ebook.id);
    setForm(ebook);
    setMessage("");
  }

  function startCreating() {
    setSelectedId(null);
    setCreating(true);
    setNewEbook(EMPTY_NEW_EBOOK);
    setNewCoverFile(null);
    setCreateMessage("");
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newCoverFile) {
      setCreateMessage("La portada es obligatoria.");
      return;
    }
    setCreateSaving(true);
    setCreateMessage("");

    const formData = new FormData();
    Object.entries(newEbook).forEach(([key, value]) => formData.append(key, String(value)));
    formData.append("file", newCoverFile);

    const res = await fetch("/api/admin/ebooks", { method: "POST", body: formData });
    const data = await res.json();
    setCreateSaving(false);

    if (!res.ok) {
      setCreateMessage(data.error ?? "No pudimos crear el ebook.");
      return;
    }

    setCreating(false);
    await fetchEbooks();
    selectEbook(data.ebook as Ebook);
  }

  const selected = ebooks.find((e) => e.id === selectedId) ?? null;

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setMessage("");

    const res = await fetch(`/api/admin/ebooks/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        short_description: form.short_description,
        long_description: form.long_description,
        promo_message: form.promo_message,
        free_chapter: form.free_chapter,
        category: form.category,
        original_price: Number(form.original_price),
        current_price: Number(form.current_price),
        hotmart_sale_url: form.hotmart_sale_url,
        hotmart_affiliate_url: form.hotmart_affiliate_url,
        bank_alias: form.bank_alias,
        bank_cbu: form.bank_cbu,
        bank_name: form.bank_name,
        featured: form.featured,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMessage(data.error ?? "Ocurrió un error.");
      return;
    }

    setMessage("Guardado.");
    fetchEbooks();
  }

  async function handleDeleteEbook() {
    if (!selected) return;
    if (
      !window.confirm(
        `¿Borrar "${selected.title}" definitivamente? Esta acción no se puede deshacer. Los leads que ya se generaron desde este ebook no se borran, quedan sin ebook asociado.`
      )
    ) {
      return;
    }

    setSaving(true);
    setMessage("");
    const res = await fetch(`/api/admin/ebooks/${selected.id}`, { method: "DELETE" });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error ?? "No pudimos borrar el ebook.");
      return;
    }

    setSelectedId(null);
    setForm({});
    fetchEbooks();
  }

  async function handleCoverUpload(file: File) {
    if (!selected) return;
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/admin/ebooks/${selected.id}/cover`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setMessage(data.error ?? "No pudimos subir la portada.");
      return;
    }

    setMessage("Portada actualizada.");
    setForm((f) => ({ ...f, cover_image_url: data.ebook.cover_image_url }));
    fetchEbooks();
  }

  async function handleChapterPdfUpload(file: File) {
    if (!selected) return;
    setUploadingChapterPdf(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/admin/ebooks/${selected.id}/free-chapter-pdf`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploadingChapterPdf(false);

    if (!res.ok) {
      setMessage(data.error ?? "No pudimos subir el PDF.");
      return;
    }

    setMessage("PDF del capítulo actualizado.");
    setForm((f) => ({ ...f, free_chapter_pdf_url: data.ebook.free_chapter_pdf_url }));
    fetchEbooks();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/3 flex flex-col gap-3">
        <h1 className="text-[#D7E2EA] font-medium uppercase text-2xl mb-2">Ebooks</h1>
        <button
          onClick={startCreating}
          className={`rounded-2xl border-2 border-dashed px-4 py-3 text-left transition-colors ${
            creating
              ? "border-[#FF9500] bg-[#FF9500]/10 text-[#FF9500]"
              : "border-[#D7E2EA]/30 text-[#D7E2EA]/70 hover:border-[#D7E2EA]/60"
          }`}
        >
          + Nuevo ebook
        </button>
        {ebooks.map((ebook) => (
          <button
            key={ebook.id}
            onClick={() => selectEbook(ebook)}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
              selectedId === ebook.id
                ? "border-[#FF9500] bg-[#FF9500]/10"
                : "border-[#D7E2EA]/15 hover:border-[#D7E2EA]/40"
            }`}
          >
            <div className="relative w-12 h-16 rounded-md overflow-hidden shrink-0 bg-[#D7E2EA]/10">
              {ebook.cover_image_url && (
                <Image
                  src={ebook.cover_image_url}
                  alt={ebook.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              )}
            </div>
            <div>
              <p className="text-[#D7E2EA] text-sm font-medium">{ebook.title}</p>
              <p className="text-[#D7E2EA]/50 text-xs">
                {ebook.category} {ebook.featured && "· Destacado"}
              </p>
            </div>
          </button>
        ))}
        {ebooks.length === 0 && (
          <p className="text-[#D7E2EA]/60 text-sm">Todavía no hay ebooks cargados.</p>
        )}
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="lg:w-2/3 flex flex-col gap-4">
          <h2 className="text-[#D7E2EA] font-medium uppercase text-lg">Nuevo ebook</h2>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Portada (obligatoria, PNG/JPG/WEBP hasta 5MB)
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setNewCoverFile(e.target.files?.[0] ?? null)}
              className="text-[#D7E2EA] text-sm"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Título
            <input
              type="text"
              required
              value={newEbook.title}
              onChange={(e) => setNewEbook({ ...newEbook, title: e.target.value })}
              className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Descripción corta (para la tarjeta del catálogo)
            <textarea
              required
              value={newEbook.short_description}
              onChange={(e) => setNewEbook({ ...newEbook, short_description: e.target.value })}
              rows={2}
              className="rounded-2xl border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Descripción larga (para la página del ebook)
            <textarea
              required
              value={newEbook.long_description}
              onChange={(e) => setNewEbook({ ...newEbook, long_description: e.target.value })}
              rows={5}
              className="rounded-2xl border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Mensaje de convencimiento (sección destacada del Home)
            <textarea
              value={newEbook.promo_message}
              onChange={(e) => setNewEbook({ ...newEbook, promo_message: e.target.value })}
              rows={2}
              placeholder="Ej: Dejá de tenerle miedo a la IA y empezá a usarla a tu favor, en el trabajo, el estudio y tu día a día."
              className="rounded-2xl border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Categoría
            <input
              type="text"
              required
              value={newEbook.category}
              onChange={(e) => setNewEbook({ ...newEbook, category: e.target.value })}
              className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
              Precio original
              <input
                type="number"
                min={0}
                step="0.01"
                required
                value={newEbook.original_price}
                onChange={(e) =>
                  setNewEbook({ ...newEbook, original_price: Number(e.target.value) })
                }
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
              Precio actual / de oferta
              <input
                type="number"
                min={0}
                step="0.01"
                required
                value={newEbook.current_price}
                onChange={(e) =>
                  setNewEbook({ ...newEbook, current_price: Number(e.target.value) })
                }
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
              />
            </label>
          </div>

          <p className="text-[#D7E2EA]/50 text-xs">
            Después de crearlo podés cargar el link de Hotmart, los datos bancarios, el
            capítulo gratis y marcarlo como destacado desde su ficha de edición.
          </p>

          <button
            type="submit"
            disabled={createSaving}
            className="self-start rounded-full bg-[#FF9500] text-[#0C0C0C] font-medium uppercase text-xs tracking-wider px-5 py-2 disabled:opacity-50"
          >
            {createSaving ? "Creando..." : "Crear ebook"}
          </button>

          {createMessage && <p className="text-sm text-[#D7E2EA]/80">{createMessage}</p>}
        </form>
      )}

      {selected && (
        <form onSubmit={handleSave} className="lg:w-2/3 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-[#D7E2EA]/10 shrink-0">
              {form.cover_image_url && (
                <Image
                  src={form.cover_image_url}
                  alt={form.title ?? ""}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase text-[#D7E2EA]/60">
                Cambiar portada (PNG, JPG o WEBP, hasta 5MB)
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverUpload(file);
                }}
                className="text-[#D7E2EA] text-sm"
              />
              {uploading && <p className="text-[#D7E2EA]/60 text-xs">Subiendo...</p>}
            </div>
          </div>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Título
            <input
              type="text"
              value={form.title ?? ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Descripción corta (para la tarjeta del catálogo)
            <textarea
              value={form.short_description ?? ""}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              rows={2}
              className="rounded-2xl border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Descripción larga (para la página del ebook)
            <textarea
              value={form.long_description ?? ""}
              onChange={(e) => setForm({ ...form, long_description: e.target.value })}
              rows={5}
              className="rounded-2xl border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Mensaje de convencimiento (sección destacada del Home)
            <textarea
              value={form.promo_message ?? ""}
              onChange={(e) => setForm({ ...form, promo_message: e.target.value })}
              rows={2}
              placeholder="Ej: Dejá de tenerle miedo a la IA y empezá a usarla a tu favor, en el trabajo, el estudio y tu día a día."
              className="rounded-2xl border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Primer capítulo gratis (texto completo)
            <textarea
              value={form.free_chapter ?? ""}
              onChange={(e) => setForm({ ...form, free_chapter: e.target.value })}
              rows={10}
              placeholder="Pegá acá el texto completo del primer capítulo. Se muestra en pantalla y se manda por mail apenas alguien completa el formulario."
              className="rounded-2xl border border-[#D7E2EA]/30 bg-transparent px-4 py-2 font-mono text-xs"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase text-[#D7E2EA]/60">
              O subí el capítulo como PDF (opcional, hasta 20MB)
            </span>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="application/pdf"
                disabled={uploadingChapterPdf}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleChapterPdfUpload(file);
                }}
                className="text-[#D7E2EA] text-sm"
              />
              {form.free_chapter_pdf_url && (
                <a
                  href={form.free_chapter_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF9500] text-xs uppercase tracking-wider shrink-0"
                >
                  Ver PDF actual
                </a>
              )}
            </div>
            {uploadingChapterPdf && <p className="text-[#D7E2EA]/60 text-xs">Subiendo...</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
              Categoría
              <input
                type="text"
                value={form.category ?? ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-[#D7E2EA] mt-6">
              <input
                type="checkbox"
                checked={form.featured ?? false}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Destacarlo en el Home
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
              Precio original
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.original_price ?? 0}
                onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })}
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
              Precio actual / de oferta
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.current_price ?? 0}
                onChange={(e) => setForm({ ...form, current_price: Number(e.target.value) })}
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Link de venta en Hotmart
            <input
              type="text"
              value={form.hotmart_sale_url ?? ""}
              onChange={(e) => setForm({ ...form, hotmart_sale_url: e.target.value })}
              className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
            Link para sumarse como afiliado (Hotmart)
            <input
              type="text"
              value={form.hotmart_affiliate_url ?? ""}
              onChange={(e) => setForm({ ...form, hotmart_affiliate_url: e.target.value })}
              className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
            />
          </label>

          <div className="grid grid-cols-3 gap-4">
            <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
              Banco
              <input
                type="text"
                value={form.bank_name ?? ""}
                onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
              Alias
              <input
                type="text"
                value={form.bank_alias ?? ""}
                onChange={(e) => setForm({ ...form, bank_alias: e.target.value })}
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
              CBU
              <input
                type="text"
                value={form.bank_cbu ?? ""}
                onChange={(e) => setForm({ ...form, bank_cbu: e.target.value })}
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="self-start rounded-full bg-[#FF9500] text-[#0C0C0C] font-medium uppercase text-xs tracking-wider px-5 py-2 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <button
              type="button"
              onClick={handleDeleteEbook}
              disabled={saving}
              className="self-start rounded-full border border-red-400 text-red-400 uppercase text-xs tracking-wider px-5 py-2 disabled:opacity-50"
            >
              Borrar ebook
            </button>
          </div>

          {message && <p className="text-sm text-[#D7E2EA]/80">{message}</p>}
        </form>
      )}
    </div>
  );
}
