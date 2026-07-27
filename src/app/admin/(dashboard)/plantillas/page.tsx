"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { MailTemplate } from "@/lib/types";

const EMPTY_FORM = { name: "", subject: "", body: "" };

export default function AdminPlantillasPage() {
  const [templates, setTemplates] = useState<MailTemplate[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchTemplates() {
    const res = await fetch("/api/admin/templates");
    const data = await res.json();
    setTemplates(res.ok ? data.templates : []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos, patrón estándar sin lib de data-fetching.
    fetchTemplates();
  }, []);

  function startEdit(template: MailTemplate) {
    setEditingId(template.id);
    setForm({ name: template.name, subject: template.subject, body: template.body });
    setMessage("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const url = editingId ? `/api/admin/templates/${editingId}` : "/api/admin/templates";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error ?? "Ocurrió un error.");
      return;
    }

    resetForm();
    fetchTemplates();
  }

  async function handleDelete(id: string) {
    setLoading(true);
    await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
    setLoading(false);
    if (editingId === id) resetForm();
    fetchTemplates();
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[#D7E2EA] font-medium uppercase text-2xl">Plantillas de mail</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-[#D7E2EA]/15 p-6 max-w-xl"
      >
        <h2 className="text-[#D7E2EA] uppercase text-sm tracking-wider">
          {editingId ? "Editar plantilla" : "Nueva plantilla"}
        </h2>
        <input
          type="text"
          placeholder="Nombre de la plantilla"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2 text-[#D7E2EA] text-sm placeholder:text-[#D7E2EA]/40"
        />
        <input
          type="text"
          placeholder="Asunto (podés usar {nombre} y {ebook})"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
          className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2 text-[#D7E2EA] text-sm placeholder:text-[#D7E2EA]/40"
        />
        <textarea
          placeholder="Cuerpo del mensaje (podés usar {nombre} y {ebook})"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          required
          rows={6}
          className="rounded-2xl border border-[#D7E2EA]/30 bg-transparent px-4 py-3 text-[#D7E2EA] text-sm placeholder:text-[#D7E2EA]/40"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#FF9500] text-[#0C0C0C] font-medium uppercase text-xs tracking-wider px-5 py-2 disabled:opacity-50"
          >
            {editingId ? "Guardar cambios" : "Crear plantilla"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-[#D7E2EA]/40 text-[#D7E2EA] uppercase text-xs tracking-wider px-5 py-2"
            >
              Cancelar
            </button>
          )}
        </div>
        {message && <p className="text-sm text-red-400">{message}</p>}
      </form>

      <div className="flex flex-col gap-3">
        {templates.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-[#D7E2EA]/15 px-5 py-4"
          >
            <div>
              <p className="text-[#D7E2EA] font-medium">{t.name}</p>
              <p className="text-[#D7E2EA]/60 text-sm">{t.subject}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => startEdit(t)}
                className="text-[#FF9500] uppercase text-xs tracking-wider"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-red-400 uppercase text-xs tracking-wider"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <p className="text-[#D7E2EA]/60 text-sm">Todavía no creaste ninguna plantilla.</p>
        )}
      </div>
    </div>
  );
}
