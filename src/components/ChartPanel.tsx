/**
 * Componente lazy para gráficos de recharts
 * Permite code splitting y reduce el bundle inicial
 */
import { lazy, Suspense } from "react";

const RechartsLazy = lazy(() =>
  import("recharts").then((module) => ({
    default: ({ children }: { children: React.ReactNode }) => (
      <div>Loading recharts...</div>
    ),
  }))
);

interface ChartPanelProps {
  chartType: "bar" | "pie";
  data: unknown[];
  height?: number;
  children?: React.ReactNode;
}

/**
 * Carga recharts bajo demanda
 */
export function ChartPanel({ chartType, data, height = 200, children }: ChartPanelProps) {
  return (
    <Suspense fallback={<div className="h-[200px] w-full animate-pulse bg-[#F5F7FA] rounded-xl" />}>
      <RechartsLazy>{children}</RechartsLazy>
    </Suspense>
  );
}