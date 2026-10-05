import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Envuelve contenido para animar su entrada (fade + slide-up) cuando el
 * elemento entra en el viewport. Respeta `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
      className={`${visible ? "animate-fade-up" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Contador animado: interpola de 0 al valor objetivo con easing cúbico.
 * `decimals` permite formatear fracciones; se muestra tal cual el sufijo.
 */
export function CountUp({
  value,
  duration = 1100,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return (
    <>
      {prefix}
      {display.toLocaleString("es-PE")}
      {suffix}
    </>
  );
}

/** Tarjeta base del sistema de diseño con elevación y micro-interacción hover. */
export function Card({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-[12px] shadow-card transition-all duration-300 ease-out ${
        interactive ? "hover:-translate-y-1 hover:shadow-elevated" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Barra de progreso animada (se rellena al montar). */
export function ProgressBar({ pct, className = "" }: { pct: number; className?: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);
  return (
    <div className={`h-1.5 bg-[#E0E0E0] rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-[#1E88E5] to-[#42A5F5] rounded-full transition-[width] duration-1000 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
