"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type ImpactMetric = {
  value: string;
  label: string;
  detail: string;
};

function ImpactLabel({ children }: { children: React.ReactNode }) {
  return <p className="indie-label"><span>01</span>{children}</p>;
}

function MechanicalCounter({ value }: { value: string }) {
  return (
    <strong className="indie-impact-value" aria-label={value}>
      <span className="sr-only">{value}</span>
      <span className="indie-counter-static" aria-hidden="true">{value}</span>
      <span className="indie-odometer" aria-hidden="true">
        {[...value].map((character, index) => {
          if (!/\d/.test(character)) return <span className="indie-odometer-symbol" key={`${character}-${index}`}>{character}</span>;
          return (
            <span className="indie-odometer-window" key={`${character}-${index}`}>
              <span className="indie-odometer-reel" data-target-index={String(20 + Number(character))}>
                {Array.from({ length: 30 }, (_, digit) => <span key={digit}>{digit % 10}</span>)}
              </span>
            </span>
          );
        })}
      </span>
    </strong>
  );
}

export function ImpactInterlock({ metrics }: { metrics: readonly ImpactMetric[] }) {
  const section = useRef<HTMLElement>(null);
  const wiring = useRef<SVGSVGElement>(null);
  const cable = useRef<SVGPathElement>(null);
  const cableCore = useRef<SVGPathElement>(null);
  const cableBraid = useRef<SVGPathElement>(null);
  const trace = useRef<SVGPathElement>(null);
  const tracePulse = useRef<SVGPathElement>(null);
  const plug = useRef<SVGGElement>(null);
  const socket = useRef<HTMLSpanElement>(null);
  const led = useRef<HTMLSpanElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLElement>(null);
  const badge = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = section.current;
    const svg = wiring.current;
    const jack = socket.current;
    const ledNode = led.current;
    const headingNode = heading.current;
    const photoNode = photo.current;
    const badgeNode = badge.current;
    const stageNode = stage.current;
    if (!root || !svg || !jack || !ledNode || !headingNode || !photoNode || !badgeNode || !stageNode) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 768) return;

    const wirePath = trace.current;
    const wirePulse = tracePulse.current;
    const cablePaths = [cable.current, cableCore.current, cableBraid.current].filter((path): path is SVGPathElement => Boolean(path));
    const plugNode = plug.current;
    if (!wirePath || !wirePulse || !plugNode || cablePaths.length !== 3) return;

    const geometry = () => {
      const rootRect = root.getBoundingClientRect();
      const jackRect = jack.getBoundingClientRect();
      const grid = root.querySelector<HTMLElement>(".indie-proof-grid");
      if (!grid) return null;
      const gridRect = grid.getBoundingClientRect();
      const width = root.clientWidth;
      const height = root.scrollHeight;
      const x = jackRect.left + jackRect.width / 2 - rootRect.left;
      const y = jackRect.top + jackRect.height / 2 - rootRect.top;
      const gridY = gridRect.top - rootRect.top;
      const gridLeft = gridRect.left - rootRect.left;
      const gridRight = gridRect.right - rootRect.left;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      const cableD = `M ${x - 120} -80 C ${x - 10} 10, ${x + 94} ${Math.max(38, y * 0.48)}, ${x} ${y - 28}`;
      const traceD = `M ${x} ${y + 9} L ${x} ${gridY - 24} C ${x} ${gridY - 2}, ${gridLeft + 22} ${gridY - 2}, ${gridLeft + 22} ${gridY} L ${gridRight} ${gridY}`;
      cablePaths.forEach((path) => path.setAttribute("d", cableD));
      wirePath.setAttribute("d", traceD);
      wirePulse.setAttribute("d", traceD);
      return { x, y: y - 4 };
    };

    const target = geometry();
    if (!target) return;
    const cableLength = cable.current?.getTotalLength() ?? 1;
    const traceLength = wirePath.getTotalLength();
    root.classList.add("has-interlock-motion");
    cablePaths.forEach((path) => gsap.set(path, { strokeDasharray: cableLength, strokeDashoffset: cableLength }));
    gsap.set([wirePath, wirePulse], { strokeDasharray: traceLength, strokeDashoffset: traceLength });

    const cardNodes = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".indie-proof-card"));
    const reels = cardNodes.map((card) => gsap.utils.toArray<HTMLElement>(card.querySelectorAll(".indie-odometer-reel")));
    const resize = () => {
      const nextTarget = geometry();
      if (!nextTarget) return;
      const nextCableLength = cable.current?.getTotalLength() ?? 1;
      const nextTraceLength = wirePath.getTotalLength();
      cablePaths.forEach((path) => path.setAttribute("stroke-dasharray", String(nextCableLength)));
      [wirePath, wirePulse].forEach((path) => path.setAttribute("stroke-dasharray", String(nextTraceLength)));
      gsap.set(plugNode, { x: nextTarget.x, y: nextTarget.y });
      ScrollTrigger.refresh();
    };

    const context = gsap.context(() => {
      gsap.set(plugNode, { x: target.x, y: -110, force3D: true });
      gsap.set(ledNode, { backgroundColor: "#92918a", boxShadow: "0 0 0 rgba(16,185,129,0)" });
      gsap.set(headingNode, { y: 10, autoAlpha: 0.68 });
      gsap.set(photoNode, { filter: "brightness(.72) saturate(.78)" });
      gsap.set(badgeNode, { autoAlpha: 0.48 });
      gsap.set(cardNodes, { y: 0, autoAlpha: 0.78 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          end: "bottom 75%",
          scrub: 0.85,
          invalidateOnRefresh: true,
          onUpdate: (trigger) => {
            const progress = trigger.progress;
            root.dataset.power = progress >= 0.65 ? "on" : "idle";
            cardNodes.forEach((card, index) => {
              card.classList.toggle("is-powered", progress >= 0.8 + index * 0.05);
            });
          },
        },
      });

      timeline.to(cablePaths, { strokeDashoffset: 0, duration: 0.3 }, 0);
      timeline.to(plugNode, { y: target.y - 8, duration: 0.3 }, 0);
      timeline.to(plugNode, { y: target.y, duration: 0.14, ease: "elastic.out(1, 0.4)" }, 0.3);
      timeline.to(jack, { scale: 0.94, duration: 0.045, ease: "power2.in" }, 0.3);
      timeline.to(jack, { scale: 1, duration: 0.1, ease: "elastic.out(1, 0.4)" }, 0.345);
      timeline.to(stageNode, { y: 1, duration: 0.035, ease: "none" }, 0.32);
      timeline.to(stageNode, { y: 0, duration: 0.06, ease: "power2.out" }, 0.355);
      timeline.to(ledNode, { backgroundColor: "#10b981", boxShadow: "0 0 12px #10b981", duration: 0.08 }, 0.42);
      timeline.to([wirePath, wirePulse], { strokeDashoffset: 0, duration: 0.2 }, 0.45);
      timeline.to(headingNode, { y: 0, autoAlpha: 1, duration: 0.15, ease: "power2.out" }, 0.65);
      timeline.to(photoNode, { filter: "brightness(1) saturate(1)", duration: 0.15 }, 0.65);
      timeline.to(badgeNode, { autoAlpha: 1, duration: 0.12 }, 0.68);
      timeline.to(cardNodes, { autoAlpha: 1, duration: 0.12, stagger: 0.04 }, 0.79);

      reels.forEach((cardReels, cardIndex) => {
        timeline.to(cardReels, {
          y: (index, reel) => {
            const windowNode = reel.parentElement;
            const targetIndex = Number(reel.dataset.targetIndex ?? 0);
            const digitHeight = reel.firstElementChild?.getBoundingClientRect().height ?? windowNode?.getBoundingClientRect().height ?? 0;
            return -digitHeight * targetIndex;
          },
          duration: 0.055,
          stagger: 0.003,
          ease: "none",
        }, 0.8 + cardIndex * 0.05);
      });
    }, root);

    window.addEventListener("resize", resize, { passive: true });
    requestAnimationFrame(resize);
    return () => {
      window.removeEventListener("resize", resize);
      root.classList.remove("has-interlock-motion");
      context.revert();
    };
  }, [metrics.length]);

  return (
    <section ref={section} id="evidence" className="indie-impact-section indie-evidence" aria-labelledby="impact-title">
      <svg ref={wiring} className="indie-impact-wiring" aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <linearGradient id="impact-chrome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f8f8f5" />
            <stop offset=".45" stopColor="#b8b7b0" />
            <stop offset=".7" stopColor="#f2f1ec" />
            <stop offset="1" stopColor="#8f8e87" />
          </linearGradient>
        </defs>
        <path ref={cable} className="indie-impact-cable-shadow" />
        <path ref={cableCore} className="indie-impact-cable-core" />
        <path ref={cableBraid} className="indie-impact-cable-braid" />
        <path ref={trace} className="indie-impact-trace" />
        <path ref={tracePulse} className="indie-impact-trace-pulse" />
        <g ref={plug} className="indie-impact-plug">
          <rect x="-8" y="-41" width="16" height="24" rx="5" />
          <rect x="-4" y="-55" width="8" height="17" rx="3" />
          <path d="M -3 -55 L 0 -63 L 3 -55 Z" />
          <path className="indie-impact-plug-glint" d="M -2 -52 L -1 -59" />
        </g>
      </svg>

      <div ref={stage} className="indie-impact-content">
        <div className="indie-impact-topline">
          <ImpactLabel>PRODUCTION EXPERIENCE / DTCC</ImpactLabel>
          <div className="indie-impact-port" aria-label="Input: live pipeline">
            <span ref={led} className="indie-impact-led" />
            <code>[ INPUT: LIVE_PIPELINE ]</code>
            <span ref={socket} className="indie-impact-socket" aria-hidden="true"><i /></span>
          </div>
        </div>

        <div className="indie-impact-layout">
          <div ref={heading} className="indie-impact-heading">
            <h2 id="impact-title">Make the system<br /><em>work harder.</em></h2>
            <p>Small, deliberate engineering changes. Measurable operational impact.</p>
          </div>
          <figure ref={photo} className="indie-image-panel indie-evidence-image">
            <img src="/benchmark-workbench.jpg" alt="A test bench with analog meters, a radar display, a circuit board, and engineering notes" loading="lazy" />
            <figcaption ref={badge}><span className="indie-live-dot" />QUALITY / MEASURED IN PRACTICE</figcaption>
          </figure>
        </div>

        <div className="indie-proof-grid" aria-label="Verified impact metrics">
          {metrics.map((point, index) => (
            <article className="indie-proof-card" key={point.value} data-metric={index}>
              <span className="indie-proof-index">0{index + 1} / VERIFIED IMPACT</span>
              <MechanicalCounter value={point.value} />
              <h3>{point.label}</h3>
              <p>{point.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
