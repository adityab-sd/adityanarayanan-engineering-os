"use client";

import { ArrowRight, BriefcaseBusiness, Code2 } from "lucide-react";
import { profile } from "@/data/portfolio";
import type { PortfolioView, ViewTransitionPhase } from "./types";

type ViewChooserProps = {
  onChoose: (view: PortfolioView) => void;
  phase: ViewTransitionPhase;
  target: PortfolioView | null;
};

const choices = [
  {
    view: "recruiter" as const,
    eyebrow: "For recruiters",
    title: "Engineering that scales.",
    description: "Production work, measurable impact, and a clear route to connect.",
    Icon: BriefcaseBusiness,
  },
  {
    view: "engineer" as const,
    eyebrow: "For engineers",
    title: "Useful intelligence.",
    description: "Applied AI, real-time systems, and carefully engineered products.",
    Icon: Code2,
  },
];

export function ViewChooser({ onChoose, phase, target }: ViewChooserProps) {
  return (
    <main className={`view-chooser ${phase !== "idle" ? "is-transitioning" : ""}`} aria-labelledby="chooser-title">
      <div className="chooser-grid" aria-hidden="true" />
      <header className="chooser-header"><span>AB//OS</span><span>{profile.location}</span></header>
      <section className="chooser-intro">
        <p>Aditya Buddharajan</p>
        <h1 id="chooser-title">Choose your lens.</h1>
        <span>One record. Two ways in.</span>
      </section>
      <div className="choice-deck" role="group" aria-label="Choose a portfolio view">
        {choices.map(({ view, eyebrow, title, description, Icon }) => (
          <button
            className={`view-choice view-choice-${view} ${target === view ? "is-selected" : ""}`}
            key={view}
            onClick={() => onChoose(view)}
            disabled={phase !== "idle"}
          >
            <span className="choice-frame" aria-hidden="true" />
            <span className="choice-eyebrow">{eyebrow}</span>
            <span className="choice-icon" aria-hidden="true"><Icon strokeWidth={1.5} /></span>
            <span className="choice-title">{title}</span>
            <span className="choice-description">{description}</span>
            <span className="choice-cta">Open {view} view <ArrowRight aria-hidden="true" /></span>
          </button>
        ))}
      </div>
      <p className="chooser-footer">Code. Cloud. Curiosity.</p>
    </main>
  );
}
