import Link from "next/link";

export default function Footer({ text }: { text: string }) {
  return (
    <footer className="px-6 md:px-10 py-10 flex flex-col items-center gap-2 text-center text-[#D7E2EA]/60 text-sm uppercase tracking-wider">
      <span>
        © {new Date().getFullYear()} {text}
      </span>
      <div className="flex gap-4">
        <Link href="/terminos" className="text-xs normal-case underline underline-offset-2 hover:text-[#D7E2EA]">
          Términos y Condiciones
        </Link>
        <Link
          href="/politica-de-privacidad"
          className="text-xs normal-case underline underline-offset-2 hover:text-[#D7E2EA]"
        >
          Política de Privacidad
        </Link>
      </div>
    </footer>
  );
}
