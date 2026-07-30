import Link from "next/link";
import type { ReactNode } from "react";

interface BotonPrincipalProps {
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
  "inline-flex items-center justify-center rounded-full text-white font-medium uppercase tracking-widest " +
  "px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base " +
  "outline outline-2 -outline-offset-[3px] outline-white transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100";

const style = {
  background:
    "linear-gradient(123deg, #3A1B00 7%, #E85D00 37%, #FF9500 72%, #FFD166 100%)",
  boxShadow: "0px 4px 4px rgba(255,149,0,0.25), 4px 4px 12px #E85D00 inset",
};

export default function BotonPrincipal({
  children,
  href,
  onClick,
  type = "button",
  disabled,
  className = "",
  target,
  name,
  value,
}: BotonPrincipalProps) {
  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        onClick={onClick}
        className={`${baseClasses} ${className}`}
        style={style}
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
      style={style}
      name={name}
      value={value}
    >
      {children}
    </button>
  );
}
