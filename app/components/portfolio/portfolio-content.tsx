"use client";

import type { DetailItem } from "@/data/portfolio";
import { EngineerSpatialPage } from "./engineer-spatial-page";
import { RecruiterFluxoraPage } from "./recruiter-fluxora-page";
import type { PortfolioView } from "./types";

type PortfolioContentProps = {
  view: PortfolioView;
  activeTechnology: string | null;
  onSelect: (item: DetailItem, kind: "experience" | "project") => void;
  onFilter: (technology: string | null) => void;
  onNavigate: (id: string) => void;
};

export function PortfolioContent({ view, activeTechnology, onSelect, onFilter, onNavigate }: PortfolioContentProps) {
  if (view === "recruiter") return <RecruiterFluxoraPage onNavigate={onNavigate} />;
  return <EngineerSpatialPage />;
}
