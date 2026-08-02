// Variables que ya completa el sistema solas (nombre del lead, ebook, link de
// venta). Cualquier otra variable "{algo}" que aparezca en una plantilla
// (ej. {user}/{pass} en "Credenciales QueryQuest") se considera un dato que
// el admin tiene que escribir a mano antes de poder enviar ese mail.
export const RESERVED_TEMPLATE_VARS = ["nombre", "ebook", "link"] as const;

export function extractCustomTemplateVariables(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(/\{([a-zA-Z0-9_]+)\}/g)) {
    const name = match[1];
    if (!(RESERVED_TEMPLATE_VARS as readonly string[]).includes(name)) {
      found.add(name);
    }
  }
  return Array.from(found);
}
