"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm uppercase tracking-wider text-[#D7E2EA]/70 hover:text-[#D7E2EA] transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
