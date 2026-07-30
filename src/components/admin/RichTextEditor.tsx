"use client";

import { useEffect, useRef, useState } from "react";

const BUTTON_CLASS =
  "rounded-lg border border-[#D7E2EA]/30 px-2.5 py-1 text-xs text-[#D7E2EA] hover:border-[#FF9500] hover:text-[#FF9500] disabled:opacity-40";

/**
 * Editor de texto enriquecido para el cuerpo de los mails (plantillas de
 * /admin). Usa contentEditable + document.execCommand: sigue soportado en
 * todos los navegadores modernos y evita sumar una librería externa (Quill,
 * TipTap, etc.) solo para negrita/cursiva/link/imagen.
 *
 * El valor inicial se pinta una sola vez al montar (uncontrolled): si un
 * padre necesita resetear/cambiar de plantilla, debe forzar un remount con
 * un `key` distinto en vez de pasar un `initialValue` nuevo.
 */
export default function RichTextEditor({
  initialValue,
  onChange,
}: {
  initialValue: string;
  onChange: (html: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Pinta el HTML inicial una sola vez, al montar. No debe volver a tocar
  // innerHTML en re-renders posteriores (ej. al escribir, que dispara
  // onChange -> setState en el padre -> re-render acá): eso reseteaba el
  // cursor al principio del texto en cada tecla.
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = initialValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar, a propósito (ver comentario arriba).
  }, []);

  function handleInput() {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function exec(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  }

  function handleLink() {
    const url = window.prompt("Link (https://...)");
    if (!url) return;
    exec("createLink", url);
  }

  async function handleImageFile(file: File) {
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/templates/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "No pudimos subir la imagen.");
        return;
      }
      exec("insertImage", data.url);
    } catch {
      setUploadError("No pudimos subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={BUTTON_CLASS} onClick={() => exec("bold")} title="Negrita">
          <strong>N</strong>
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={() => exec("italic")} title="Cursiva">
          <em>I</em>
        </button>
        <button
          type="button"
          className={BUTTON_CLASS}
          onClick={() => exec("underline")}
          title="Subrayado"
        >
          <u>S</u>
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={() => exec("formatBlock", "h3")}>
          Título
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={() => exec("formatBlock", "p")}>
          Párrafo
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={() => exec("insertUnorderedList")}>
          Lista
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={handleLink}>
          Link
        </button>
        <button
          type="button"
          className={BUTTON_CLASS}
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "Subiendo..." : "Imagen"}
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={() => exec("removeFormat")}>
          Limpiar formato
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {uploadError && <p className="text-red-400 text-xs">{uploadError}</p>}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        className="min-h-[180px] rounded-2xl border border-[#D7E2EA]/30 bg-transparent px-4 py-3 text-[#D7E2EA] text-sm leading-relaxed focus:outline-none focus:border-[#FF9500] [&_a]:text-[#FF9500] [&_a]:underline [&_img]:max-w-full [&_img]:rounded-lg [&_h3]:text-base [&_h3]:font-medium [&_h3]:uppercase [&_ul]:list-disc [&_ul]:pl-5"
      />
      <p className="text-[#D7E2EA]/40 text-xs">
        Podés usar {"{nombre}"}, {"{ebook}"} y {"{link}"} (link a la página del ebook) en
        cualquier parte del texto — también dentro de un link: seleccioná un texto, tocá
        &quot;Link&quot; y pegá {"{link}"} como URL.
      </p>
    </div>
  );
}
