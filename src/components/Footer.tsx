import Link from "next/link";

export default function Footer({ text }: { text: string }) {
  return (
    <footer className="px-6 md:px-10 py-10 flex flex-col items-center gap-2 text-center text-[#D7E2EA]/60 text-sm uppercase tracking-wider">
      <span>
        © {new Date().getFullYear()} {text}
      </span>
      <Link href="/terminos" className="text-xs normal-case underline underline-offset-2 hover:text-[#D7E2EA]">
        Términos y Condiciones
      </Link>
    </footer>
  );
}
