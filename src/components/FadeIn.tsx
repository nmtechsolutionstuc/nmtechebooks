"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "span" | "li" | "article";
  /**
   * Para contenido que ya está visible apenas carga la página (ej. el hero):
   * anima al montar en vez de esperar a que "entre" al viewport con scroll.
   * `whileInView` depende de un IntersectionObserver que puede no disparar
   * de forma confiable si el elemento ya está en pantalla desde el arranque,
   * dejando el contenido en opacity:0 para siempre.
   */
  immediate?: boolean;
}

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  as = "div",
  immediate = false,
}: FadeInProps) {
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { delay, duration, ease: EASE },
    },
  };

  const triggerProps = immediate
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: { once: true, margin: "50px", amount: 0 } };

  return (
    <MotionTag className={className} initial="hidden" variants={variants} {...triggerProps}>
      {children}
    </MotionTag>
  );
}
