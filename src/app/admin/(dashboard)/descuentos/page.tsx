"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { DiscountCode, Ebook } from "@/lib/types";

type CodeRow = DiscountCode & { ebooks: { id: string; title: string } | null };

const EMPTY_FORM = {
  code: "",
  discount_percent: 10,
  active: true,
  ebook_id: "",
  expires_at: "",
};

export default function AdminDescuentosPage() {
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchCodes() {
    const res = await fetch("/api/admin/discount-codes");
    const data = await res.json();
    setCodes(res.ok ? data.codes : []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos, patrón estándar sin lib de data-fetching.
    fetchCodes();
    fetch("/api/admin/ebooks")
      .then((res) => res.json())
      .then((data) => setEbooks(data.ebooks ?? []));
  }, []);

  function startEdit(code: CodeRow) {
    setEditingId(code.id);
    setForm({
      code: code.code,
      discount_percent: code.discount_percent,
      active: code.active,
      ebook_id: code.ebook_id ?? "",
      expires_at: code.expires_at ? code.expires_at.slice(0, 10) : "",
    });
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

    const url = editingId ? `/api/admin/discount-codes/${editingId}` : "/api/admin/discount-codes";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        ebook_id: form.ebook_id || null,
        expires_at: form.expires_at || null,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error ?? "Ocurrió un error.");
      return;
    }

    resetForm();
    fetchCodes();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("¿Borrar este código de descuento?")) return;
    setLoading(true);
    await fetch(`/api/admin/discount-codes/${id}`, { method: "DELETE" });
    setLoading(false);
    if (editingId === id) resetForm();
    fetchCodes();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-[#D7E2EA] font-medium uppercase text-2xl mb-1">Descuentos</h1>
        <p className="text-[#D7E2EA]/50 text-xs">
          Solo aplican al pago por transferencia. Hotmart tiene su propio sistema de cupones,
          independiente de este (se configura desde tu cuenta de Hotmart).
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-[#D7E2EA]/15 p-6 max-w-xl"
      >
        <h2 className="text-[#D7E2EA] uppercase text-sm tracking-wider">
          {editingId ? "Editar código" : "Nuevo código"}
        </h2>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Código (sin espacios, se guarda en mayúsculas)
          <input
            type="text"
            placeholder="BIENVENIDA10"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
            className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2 text-sm placeholder:text-[#D7E2EA]/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Porcentaje de descuento
          <input
            type="number"
            min={1}
            max={100}
            step="1"
            value={form.discount_percent}
            onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })}
            required
            className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Ebook (vacío = aplica a cualquiera)
          <select
            value={form.ebook_id}
            onChange={(e) => setForm({ ...form, ebook_id: e.target.value })}
            className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2 text-sm"
          >
            <option value="">Todos los ebooks</option>
            {ebooks.map((eb) => (
              <option key={eb.id} value={eb.id}>
                {eb.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
          Vencimiento (opcional)
          <input
            type="date"
            value={form.expires_at}
            onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
            className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-[#D7E2EA]">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Activo
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#FF9500] text-[#0C0C0C] font-medium uppercase text-xs tracking-wider px-5 py-2 disabled:opacity-50"
          >
            {editingId ? "Guardar cambios" : "Crear código"}
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
        {codes.map((c) => (
          <div
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#D7E2EA]/15 px-5 py-4"
          >
            <div>
              <p className="text-[#D7E2EA] font-medium">
                {c.code} — {c.discount_percent}%{" "}
                {!c.active && <span className="text-red-400 text-xs uppercase">(inactivo)</span>}
              </p>
              <p className="text-[#D7E2EA]/60 text-sm">
                {c.ebooks?.title ?? "Todos los ebooks"}
                {c.expires_at && ` · vence ${new Date(c.expires_at).toLocaleDateString("es-AR")}`}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => startEdit(c)}
                className="text-[#FF9500] uppercase text-xs tracking-wider"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-400 uppercase text-xs tracking-wider"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
        {codes.length === 0 && (
          <p className="text-[#D7E2EA]/60 text-sm">Todavía no creaste ningún código.</p>
        )}
      </div>
    </div>
  );
}
