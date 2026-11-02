import type { DetailItem } from "@/data/portfolio";

export type PortfolioView = "recruiter" | "engineer";
export type ViewTransitionPhase = "idle" | "prepare" | "cover" | "reveal";
export type Selection = { item: DetailItem; kind: "experience" | "project" } | null;
