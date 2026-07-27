import Link from "next/link";
import FadeIn from "@/components/FadeIn";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/ebooks", label: "Ebooks" },
  { href: "/afiliados", label: "Afiliados" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  return (
    <FadeIn delay={0} y={-20} as="div" immediate>
      <nav className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </FadeIn>
  );
}
