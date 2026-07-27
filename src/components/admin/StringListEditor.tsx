"use client";

export default function StringListEditor({
  items,
  onChange,
  maxItems = 20,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  maxItems?: number;
}) {
  function updateItem(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, ""]);
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
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
      ))}
      {items.length < maxItems && (
        <button
          type="button"
          onClick={addItem}
          className="self-start text-xs uppercase text-[#FF9500]"
        >
          + Agregar
        </button>
      )}
    </div>
  );
}
