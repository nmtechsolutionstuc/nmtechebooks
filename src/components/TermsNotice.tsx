import Link from "next/link";

export default function TermsNotice({ text }: { text: string }) {
  return (
    <p className="text-[#D7E2EA]/50 text-xs">
      {text}{" "}
      <Link href="/terminos" className="underline underline-offset-2 hover:text-[#D7E2EA]/80">
        Ver Términos y Condiciones
      </Link>
    </p>
  );
}
