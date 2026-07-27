"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "No pudimos iniciar sesión.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("No pudimos conectar con el servidor.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 rounded-[30px] border-2 border-[#D7E2EA]/20 p-8"
      >
        <h1 className="text-[#D7E2EA] font-medium uppercase text-xl text-center mb-2">
          Panel de administración
        </h1>

        <input
          type="text"
          name="username"
          placeholder="Usuario"
          required
          autoComplete="username"
          className="rounded-full border-2 border-[#D7E2EA]/30 bg-transparent px-5 py-3 text-[#D7E2EA] placeholder:text-[#D7E2EA]/50 focus:outline-none focus:border-[#FF9500]"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          autoComplete="current-password"
          className="rounded-full border-2 border-[#D7E2EA]/30 bg-transparent px-5 py-3 text-[#D7E2EA] placeholder:text-[#D7E2EA]/50 focus:outline-none focus:border-[#FF9500]"
        />

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#FF9500] text-[#0C0C0C] font-medium uppercase tracking-widest py-3 disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
