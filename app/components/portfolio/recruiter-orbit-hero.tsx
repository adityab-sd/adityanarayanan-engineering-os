"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { recruiterProfile } from "@/data/recruiter";

gsap.registerPlugin(ScrollTrigger);

const orbitCapabilities = [
  {
    index: "01",
    badge: "CORE SPECIALIZATION [01/04] // AGENT ARCHITECTURES",
    kicker: "Agent architectures",
    title: "Agent systems that work together.",
    description:
      "Replacing brittle single-prompt chains with LangGraph supervisor routing, deterministic state machines, and parallel sub-agents to automate complex operations and reduce incident MTTR.",
    cardTitle: "Multi-Agent Orchestration",
    tags: ["LangGraph", "Supervisor Pattern", "Parallel Pods"],
  },
  {
    index: "02",
    badge: "CORE SPECIALIZATION [02/04] // KNOWLEDGE RETRIEVAL",
    kicker: "Knowledge retrieval",
    title: "Retrieval that actually finds the truth.",
    description:
      "Eliminating hallucinations across enterprise data through hybrid dense-sparse vector search, contextual document chunking, and cross-encoder re-ranking pipelines built for production accuracy.",
    cardTitle: "Enterprise RAG & Vectors",
    tags: ["Hybrid Search", "Re-Ranking", "Vector DBs"],
  },
  {
    index: "03",
    badge: "CORE SPECIALIZATION [03/04] // RELIABLE EXECUTION",
    kicker: "Reliable execution",
    title: "Autonomous actions with human guardrails.",
    description:
      "Bridging natural language intent to dependable backend execution using strict Pydantic tool schemas, prompt injection filters, and human-in-the-loop approval gates before state-altering actions execute.",
    cardTitle: "Tool-Calling & Action Gates",
    tags: ["FastAPI", "Pydantic Schemas", "Safety Filters"],
  },
  {
    index: "04",
    badge: "CORE SPECIALIZATION [04/04] // OBSERVABILITY & EVALS",
    kicker: "Observability & evals",
    title: "Measured in practice, not playground hype.",
    description:
      "Ensuring reliability through automated LLM-as-a-judge evaluation benchmarks, distributed OpenTelemetry tracing, and aggressive token-budget enforcement to keep latency low and costs predictable.",
    cardTitle: "Evals & System Tracing",
    tags: ["Evals (LLM Judge)", "OpenTelemetry", "Cost Budgets"],
  },
] as const;

type RecruiterOrbitHeroProps = {
  onNavigate: (id: string) => void;
};

export function RecruiterOrbitHero({ onNavigate }: RecruiterOrbitHeroProps) {
  const root = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      if (!root.current) return;

      const updateActiveCapability = (nextIndex: number) => {
        const boundedIndex = Math.max(
          0,
          Math.min(orbitCapabilities.length - 1, nextIndex),
        );

        if (activeIndexRef.current === boundedIndex) return;
        activeIndexRef.current = boundedIndex;
        setActiveIndex(boundedIndex);
      };

      const media = gsap.matchMedia();

      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const ring = ringRef.current;
          const counters = gsap.utils.toArray<HTMLElement>(
            "[data-recruiter-orbit-counter]",
            root.current,
          );

          if (!ring || !counters.length) return;

          gsap.set(ring, { rotate: 0, transformOrigin: "50% 50%" });
          counters.forEach((counter, index) => {
            gsap.set(counter, {
              rotate: -index * 90,
              transformOrigin: "50% 50%",
            });
          });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const nextIndex = Math.min(
                  orbitCapabilities.length - 1,
                  Math.floor(self.progress * orbitCapabilities.length),
                );
                updateActiveCapability(nextIndex);
              },
            },
          });

          timeline.to(ring, { rotate: 270, duration: 4, ease: "none" }, 0);

          counters.forEach((counter, index) => {
            timeline.to(
              counter,
              { rotate: -index * 90 - 270, duration: 4, ease: "none" },
              0,
            );
          });

          return () => timeline.kill();
        },
      );

      media.add(
        "(max-width: 767px), (prefers-reduced-motion: reduce)",
        () => {
          const ring = ringRef.current;
          if (!ring) return;

          const updateFromCarousel = () => {
            const firstCard = ring.querySelector<HTMLElement>(
              ".recruiter-orbit-card-shell",
            );
            if (!firstCard) return;

            const gap = Number.parseFloat(getComputedStyle(ring).columnGap) || 0;
            const cardStep = firstCard.getBoundingClientRect().width + gap;
            if (!cardStep) return;

            updateActiveCapability(Math.round(ring.scrollLeft / cardStep));
          };

          ring.addEventListener("scroll", updateFromCarousel, { passive: true });
          updateFromCarousel();

          return () => ring.removeEventListener("scroll", updateFromCarousel);
        },
      );

      return () => media.revert();
    },
    { scope: root },
  );

  const activeCapability = orbitCapabilities[activeIndex];

  return (
    <section
      id="candidate"
      ref={root}
      className="recruiter-orbit-scroll"
      aria-label="AI Engineer profile"
    >
      <div className="recruiter-orbit-viewport">
        <div className="recruiter-orbit-layout">
          <div className="recruiter-orbit-copy-column">
            <p className="recruiter-orbit-status" aria-live="polite">
              <i aria-hidden="true" />
              <span>{activeCapability.badge}</span>
            </p>

            <div className="recruiter-orbit-copy-stack">
              {orbitCapabilities.map((capability, index) => (
                <div
                  className={`recruiter-orbit-copy${
                    activeIndex === index ? " is-active" : ""
                  }`}
                  key={capability.index}
                  aria-hidden={activeIndex !== index}
                >
                  <h1>{capability.title}</h1>
                  <p>{capability.description}</p>
                </div>
              ))}
            </div>

            <div className="recruiter-orbit-actions">
              <button
                className="fluxora-button fluxora-button-light"
                onClick={() => onNavigate("projects")}
              >
                Explore projects <ArrowRight aria-hidden="true" />
              </button>
              <a
                className="fluxora-button fluxora-button-quiet"
                href={recruiterProfile.calendly}
                target="_blank"
                rel="noreferrer"
              >
                Book a call <ArrowUpRight aria-hidden="true" />
              </a>
            </div>

            <p className="recruiter-orbit-ticker" aria-live="polite">
              Orbit phase: [ {activeCapability.index} / 04 ] //{" "}
              {activeCapability.kicker}
            </p>

            <p className="recruiter-orbit-work-status">
              Ireland work authorized · No sponsorship required
            </p>
          </div>

          <div
            className="recruiter-orbit-stage"
            aria-label="Four AI engineering capabilities orbit a 3D profile portrait"
          >
            <div className="recruiter-orbit-halo" aria-hidden="true" />
            <div
              className="recruiter-orbit-ring"
              data-recruiter-orbit-ring
              ref={ringRef}
            >
              {orbitCapabilities.map((capability, index) => (
                <article
                  className={`recruiter-orbit-card-shell${
                    activeIndex === index ? " is-active" : ""
                  }`}
                  key={capability.index}
                  style={{ "--orbit-angle": `${index * 90}deg` } as CSSProperties}
                  aria-current={activeIndex === index ? "step" : undefined}
                >
                  <div className="recruiter-orbit-card-positioner">
                    <div
                      className="recruiter-orbit-card-counter"
                      data-recruiter-orbit-counter
                    >
                      <div className="recruiter-orbit-card-visual">
                        <div className="recruiter-orbit-card-meta">
                          <span>{capability.index}</span>
                          <i aria-hidden="true" />
                        </div>
                        <p>{capability.cardTitle}</p>
                        <div className="recruiter-orbit-tags">
                          {capability.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="recruiter-orbit-avatar">
              <Image
                src="/recruiter-profile-3d.jpg"
                alt="Stylized 3D portrait of Aditya Buddharajan"
                fill
                priority
                sizes="(max-width: 767px) 62vw, (max-width: 1200px) 31vw, 420px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}