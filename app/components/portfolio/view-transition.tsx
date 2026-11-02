import type { PortfolioView, ViewTransitionPhase } from "./types";

export function ViewTransition({ phase, target }: { phase: ViewTransitionPhase; target: PortfolioView | null }) {
  if (phase === "idle" || !target) return null;

  return (
    <div className={`view-transition view-transition-${target} view-transition-${phase}`} aria-live="polite" aria-label={`Opening ${target} view`}>
      <span>{target === "recruiter" ? "Recruiter view" : "Engineer view"}</span>
    </div>
  );
}
