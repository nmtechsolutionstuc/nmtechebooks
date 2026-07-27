import Link from "next/link";
import type { ReactNode } from "react";

interface BotonSecundarioProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  target?: string;
  name?: string;
  value?: string;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest " +
  "px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors duration-200 disabled:opacity-50";

export default function BotonSecundario({
  children,
  href,
  onClick,
  type = "button",
  disabled,
  className = "",
  target,
  name,
  value,
}: BotonSecundarioProps) {
  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={`${baseClasses} ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
      name={name}
      value={value}
    >
      {children}
    </button>
  );
}
