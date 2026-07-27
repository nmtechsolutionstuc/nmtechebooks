"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 4,
  className,
}: MagnetProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const el = wrapperRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const withinX = Math.abs(distX) < rect.width / 2 + padding;
      const withinY = Math.abs(distY) < rect.height / 2 + padding;

      if (withinX && withinY) {
        setTransform({ x: distX / strength, y: distY / strength, active: true });
      } else {
        setTransform((prev) => (prev.active ? { x: 0, y: 0, active: false } : prev));
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, strength]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: transform.active
          ? "transform 0.3s ease-out"
          : "transform 0.6s ease-in-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
