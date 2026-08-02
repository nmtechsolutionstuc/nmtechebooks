"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type { Lead, LeadStatus, MailLogEntry, MailTemplate, PaymentMethod } from "@/lib/types";
import { extractCustomTemplateVariables } from "@/lib/template-variables";

type LeadRow = Lead & { ebooks: { id: string; title: string; slug: string } | null };

const STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  comprado: "Comprado",
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  hotmart: "Hotmart",
  transferencia: "Transferencia",
  tiendanube: "Tiendanube",
};

const EMPTY_EDIT_FORM = { name: "", email: "", topic: "", interests: "" };

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [templates, setTemplates] = useState<MailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [ebookFilter, setEbookFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  // Valores para variables propias de la plantilla elegida (ej. {user}/{pass}
  // de "Credenciales QueryQuest"), aparte de {nombre}/{ebook}/{link}.
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("hotmart");
  const [actionMessage, setActionMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [mailLog, setMailLog] = useState<MailLogEntry[]>([]);
  const [mailLogLoading, setMailLogLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (ebookFilter) params.set("ebook", ebookFilter);
    if (topicFilter) params.set("topic", topicFilter);

    const res = await fetch(`/api/admin/leads?${params.toString()}`);
    const data = await res.json();
    setLeads(res.ok ? data.leads : []);
    setLoading(false);
  }, [statusFilter, ebookFilter, topicFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch de datos disparado por cambios de filtro, patrón estándar sin lib de data-fetching.
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetch("/api/admin/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data.templates ?? []));
  }, []);

  const ebookOptions = useMemo(() => {
    const map = new Map<string, string>();
    leads.forEach((lead) => {
      if (lead.ebooks) map.set(lead.ebooks.id, lead.ebooks.title);
    });
    return Array.from(map.entries());
  }, [leads]);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) ?? null;

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) ?? null;
  const requiredTemplateVars = useMemo(
    () =>
      selectedTemplate
        ? extractCustomTemplateVariables(`${selectedTemplate.subject} ${selectedTemplate.body}`)
        : [],
    [selectedTemplate]
  );
  const missingTemplateVars = requiredTemplateVars.some(
    (name) => !templateVariables[name]?.trim()
  );

  const fetchMailLog = useCallback(async (leadId: string) => {
    setMailLogLoading(true);
    const res = await fetch(`/api/admin/leads/${leadId}/mail-log`);
    const data = await res.json();
    setMailLog(res.ok ? data.mailLog : []);
    setMailLogLoading(false);
  }, []);

  function selectLead(lead: LeadRow) {
    setSelectedLeadId(lead.id);
    setEditForm({
      name: lead.name,
      email: lead.email,
      topic: lead.topic,
      interests: lead.interests,
    });
    // Precarga el medio de pago que ya eligió el cliente en el sitio público (si eligió alguno).
    setPaymentMethod(lead.payment_method ?? "hotmart");
    setActionMessage("");
    setSelectedTemplateId("");
    setTemplateVariables({});
    fetchMailLog(lead.id);
  }

  async function updateLead(id: string, body: Record<string, unknown>) {
    setActionLoading(true);
    setActionMessage("");
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setActionLoading(false);

    if (!res.ok && res.status !== 207) {
      setActionMessage(data.error ?? "Ocurrió un error.");
      return;
    }
    if (data.warning) setActionMessage(data.warning);
    else setActionMessage("Listo.");
    fetchLeads();
    fetchMailLog(id);
  }

  async function handleSaveEdit() {
    if (!selectedLead) return;
    await updateLead(selectedLead.id, editForm);
  }

  async function handleDeleteLead() {
    if (!selectedLead) return;
    if (
      !window.confirm(
        `¿Borrar el lead de "${selectedLead.name}" (${selectedLead.email}) definitivamente? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setActionLoading(true);
    setActionMessage("");
    const res = await fetch(`/api/admin/leads/${selectedLead.id}`, { method: "DELETE" });
    setActionLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setActionMessage(data.error ?? "No pudimos borrar el lead.");
      return;
    }

    setSelectedLeadId(null);
    fetchLeads();
  }

  async function handleDeleteMailLogEntry(entry: MailLogEntry) {
    if (!selectedLead) return;
    if (
      !window.confirm(
        `¿Borrar del historial el mail "${entry.subject}" (${new Date(entry.sent_at).toLocaleString("es-AR")})? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setActionLoading(true);
    setActionMessage("");
    const res = await fetch(`/api/admin/leads/${selectedLead.id}/mail-log/${entry.id}`, {
      method: "DELETE",
    });
    setActionLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setActionMessage(data.error ?? "No pudimos borrar el registro.");
      return;
    }

    fetchMailLog(selectedLead.id);
  }

  async function handleSendMail() {
    if (!selectedLead || !selectedTemplateId || missingTemplateVars) return;
    setActionLoading(true);
    setActionMessage("");
    const res = await fetch("/api/admin/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: selectedLead.id,
        templateId: selectedTemplateId,
        variables: templateVariables,
      }),
    });
    const data = await res.json();
    setActionLoading(false);
    setActionMessage(res.ok ? "Mail enviado." : data.error ?? "Ocurrió un error.");
    if (res.ok) fetchMailLog(selectedLead.id);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[#D7E2EA] font-medium uppercase text-2xl">Leads</h1>

      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2 text-[#D7E2EA] text-sm"
        >
          <option value="">Todos los estados</option>
          <option value="nuevo">Nuevo</option>
          <option value="contactado">Contactado</option>
          <option value="comprado">Comprado</option>
        </select>

        <select
          value={ebookFilter}
          onChange={(e) => setEbookFilter(e.target.value)}
          className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2 text-[#D7E2EA] text-sm"
        >
          <option value="">Todos los ebooks</option>
          {ebookOptions.map(([id, title]) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filtrar por temática"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2 text-[#D7E2EA] text-sm placeholder:text-[#D7E2EA]/40"
        />
      </div>

      {loading ? (
        <p className="text-[#D7E2EA]/60">Cargando...</p>
      ) : leads.length === 0 ? (
        <p className="text-[#D7E2EA]/60">No hay leads con esos filtros.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#D7E2EA]/15">
          <table className="w-full text-sm text-left text-[#D7E2EA]">
            <thead className="bg-[#D7E2EA]/5 uppercase text-xs tracking-wider text-[#D7E2EA]/60">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Mail</th>
                <th className="px-4 py-3">Temática</th>
                <th className="px-4 py-3">Quiere</th>
                <th className="px-4 py-3">Ebook</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-[#D7E2EA]/10">
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.topic}</td>
                  <td className="px-4 py-3">{lead.intent === "comprar" ? "Comprar" : "Leer gratis"}</td>
                  <td className="px-4 py-3">{lead.ebooks?.title ?? "—"}</td>
                  <td className="px-4 py-3">{STATUS_LABELS[lead.status]}</td>
                  <td className="px-4 py-3">
                    {new Date(lead.created_at).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => selectLead(lead)}
                      className="text-[#FF9500] uppercase text-xs tracking-wider"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedLead && (
        <div className="rounded-2xl border-2 border-[#FF9500]/40 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[#D7E2EA] font-medium uppercase">Editar lead</h2>
            <button
              onClick={() => setSelectedLeadId(null)}
              className="text-[#D7E2EA]/60 text-sm"
            >
              Cerrar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
              Nombre
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
              Mail
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
              Temática
              <input
                type="text"
                value={editForm.topic}
                onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
              Comentario del lead
              <input
                type="text"
                value={editForm.interests}
                onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
              />
            </label>
          </div>

          <p className="text-[#D7E2EA]/50 text-xs">
            Quiere: {selectedLead.intent === "comprar" ? "Comprar directamente" : "Leer capítulo gratis"} ·
            Ebook: {selectedLead.ebooks?.title ?? "—"} · Estado: {STATUS_LABELS[selectedLead.status]} · Medio
            de pago elegido:{" "}
            {selectedLead.payment_method ? PAYMENT_METHOD_LABELS[selectedLead.payment_method] : "—"}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveEdit}
              disabled={actionLoading}
              className="rounded-full bg-[#FF9500] text-[#0C0C0C] font-medium uppercase text-xs tracking-wider px-5 py-2 disabled:opacity-50"
            >
              Guardar cambios
            </button>
            <button
              onClick={handleDeleteLead}
              disabled={actionLoading}
              className="rounded-full border border-red-400 text-red-400 uppercase text-xs tracking-wider px-5 py-2 disabled:opacity-50"
            >
              Borrar lead
            </button>
          </div>

          <div className="flex flex-wrap items-end gap-3 border-t border-[#D7E2EA]/10 pt-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase text-[#D7E2EA]/60">Plantilla de mail</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => {
                  setSelectedTemplateId(e.target.value);
                  setTemplateVariables({});
                }}
                className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2 text-[#D7E2EA] text-sm"
              >
                <option value="">Elegir plantilla</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {requiredTemplateVars.map((name) => (
              <label key={name} className="flex flex-col gap-1 text-sm text-[#D7E2EA]">
                {`{${name}}`}
                <input
                  type="text"
                  required
                  value={templateVariables[name] ?? ""}
                  onChange={(e) =>
                    setTemplateVariables((v) => ({ ...v, [name]: e.target.value }))
                  }
                  className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2"
                />
              </label>
            ))}

            <button
              onClick={handleSendMail}
              disabled={!selectedTemplateId || missingTemplateVars || actionLoading}
              className="rounded-full bg-[#FF9500] text-[#0C0C0C] font-medium uppercase text-xs tracking-wider px-5 py-2 disabled:opacity-50"
            >
              Enviar mail
            </button>

            <button
              onClick={() => updateLead(selectedLead.id, { status: "contactado" })}
              disabled={actionLoading}
              className="rounded-full border border-[#D7E2EA]/40 text-[#D7E2EA] uppercase text-xs tracking-wider px-5 py-2 disabled:opacity-50"
            >
              Marcar contactado
            </button>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#D7E2EA]/10 pt-4">
            {paymentMethod === "transferencia" && (
              <p className="text-[#D7E2EA]/50 text-xs">
                Verificá el comprobante (monto y titular) antes de confirmar — esto dispara el
                envío automático del ebook completo.
              </p>
            )}
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase text-[#D7E2EA]/60">Método de pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="rounded-full border border-[#D7E2EA]/30 bg-transparent px-4 py-2 text-[#D7E2EA] text-sm"
                >
                  <option value="hotmart">Hotmart</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="tiendanube">Tiendanube</option>
                </select>
              </div>
              <button
                onClick={() =>
                  updateLead(selectedLead.id, {
                    paymentMethod,
                    markPaymentConfirmed: true,
                  })
                }
                disabled={actionLoading || selectedLead.status === "comprado"}
                className="rounded-full bg-[#FF9500] text-[#0C0C0C] font-medium uppercase text-xs tracking-wider px-5 py-2 disabled:opacity-50"
              >
                Marcar pago confirmado (envía el ebook)
              </button>
            </div>
          </div>

          {actionMessage && <p className="text-sm text-[#D7E2EA]/80">{actionMessage}</p>}

          <div className="flex flex-col gap-2 border-t border-[#D7E2EA]/10 pt-4">
            <span className="text-xs uppercase text-[#D7E2EA]/60">
              Historial de mails enviados a este lead
            </span>
            {mailLogLoading ? (
              <p className="text-[#D7E2EA]/50 text-sm">Cargando...</p>
            ) : mailLog.length === 0 ? (
              <p className="text-[#D7E2EA]/50 text-sm">Todavía no se le mandó ningún mail.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {mailLog.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#D7E2EA]/10 px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="text-[#D7E2EA]">{entry.subject}</p>
                      <p className="text-[#D7E2EA]/50 text-xs">{entry.template_name}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[#D7E2EA]/50 text-xs">
                        {new Date(entry.sent_at).toLocaleString("es-AR")}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteMailLogEntry(entry)}
                        disabled={actionLoading}
                        className="text-red-400 uppercase text-xs tracking-wider disabled:opacity-50"
                      >
                        Borrar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
