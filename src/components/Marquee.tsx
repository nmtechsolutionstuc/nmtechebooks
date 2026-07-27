"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface MarqueeProps {
  images: string[];
}

function splitInHalf(images: string[]) {
  const mid = Math.ceil(images.length / 2);
  return [images.slice(0, mid), images.slice(mid)];
}

function Row({
  images,
  offset,
  direction,
}: {
  images: string[];
  offset: number;
  direction: 1 | -1;
}) {
  const tripled = images.length ? [...images, ...images, ...images] : [];
  const translate = direction === 1 ? offset - 200 : -(offset - 200);

  return (
    <div
      className="flex gap-3"
      style={{ transform: `translateX(${translate}px)`, willChange: "transform" }}
    >
      {tripled.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="relative shrink-0 rounded-2xl overflow-hidden"
          style={{ width: 420, height: 270 }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            loading="lazy"
            sizes="420px"
          />
        </div>
      ))}
    </div>
  );
}

export default function Marquee({ images }: MarqueeProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      const value =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(value);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!images.length) return null;

  const [row1, row2] = splitInHalf(images);

  return (
    <div ref={sectionRef} className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      <div className="flex flex-col gap-3">
        <Row images={row1} offset={offset} direction={1} />
        <Row images={row2} offset={offset} direction={-1} />
      </div>
    </div>
  );
}
