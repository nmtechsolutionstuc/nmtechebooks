"use client";

import type { ContentItem } from "@/lib/types";

export default function ContentItemListEditor({
  items,
  onChange,
  maxItems = 8,
}: {
  items: ContentItem[];
  onChange: (items: ContentItem[]) => void;
  maxItems?: number;
}) {
  function updateItem(index: number, patch: Partial<ContentItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, { title: "", description: "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-2xl border border-[#D7E2EA]/15 p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Título"
              value={item.title}
              onChange={(e) => updateItem(i, { title: e.target.value })}
              className="flex-1 rounded-full border border-[#D7E2EA]/30 bg-transparent px-3 py-1.5 text-sm text-[#D7E2EA]"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-red-400 text-xs uppercase shrink-0"
            >
              Borrar
            </button>
          </div>
          <textarea
            placeholder="Descripción"
            value={item.description}
            onChange={(e) => updateItem(i, { description: e.target.value })}
            rows={2}
            className="rounded-xl border border-[#D7E2EA]/30 bg-transparent px-3 py-2 text-sm text-[#D7E2EA]"
          />
        </div>
      ))}
      {items.length < maxItems && (
        <button
          type="button"
          onClick={addItem}
          className="self-start text-xs uppercase text-[#FF9500]"
        >
          + Agregar ítem
        </button>
      )}
    </div>
  );
}
