import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin", label: "Leads" },
  { href: "/admin/ebooks", label: "Ebooks" },
  { href: "/admin/descuentos", label: "Descuentos" },
  { href: "/admin/plantillas", label: "Plantillas de mail" },
  { href: "/admin/configuracion", label: "Configuración" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-[#D7E2EA]/15">
        <nav className="flex flex-wrap gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-wider text-[#D7E2EA]/80 hover:text-[#D7E2EA] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </header>
      <main className="px-6 py-8 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
