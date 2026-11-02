"use client";

import { ArrowDown, ArrowRight, ArrowUpRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience, profile } from "@/data/portfolio";
import { ImpactInterlock } from "./impact-interlock";
import { ArchitectureWorkbench } from "./architecture-workbench";

type ProjectKind = "AI systems" | "Cloud & realtime";
type Project = {
  number: string;
  name: string;
  kind: ProjectKind;
  label: string;
  description: string;
  stack: readonly string[];
  href: string;
  image: string;
  imageAlt: string;
};

const projects: readonly Project[] = [
  {
    number: "01",
    name: "SportScore",
    kind: "Cloud & realtime",
    label: "LIVE MULTI-SPORT PLATFORM",
    description: "A live event pipeline with an audio-first Radio Mode for more accessible match updates.",
    stack: ["Azure Event Hub", "Functions", "SignalR", "Redis"],
    href: "https://github.com/adityab-sd/sportscore_realtime_sports_tracking_application",
    image: "/systems-workbench.jpg",
    imageAlt: "Connected electronics and a terminal, representing a distributed event system",
  },
  {
    number: "02",
    name: "Incident Response Post-mortem Agent",
    kind: "AI systems",
    label: "AI-ASSISTED INCIDENT WORKFLOWS",
    description: "A recent project exploring how AI can support incident response and post-mortem work.",
    stack: ["AI engineering", "Incident workflows"],
    href: "https://github.com/adityab-sd/incident-response-postmortem-agent",
    image: "/case-study-workbench.jpg",
    imageAlt: "A reasoning trace on a small display beside carefully assembled analog equipment",
  },
  {
    number: "03",
    name: "Speech Emotion Detection",
    kind: "AI systems",
    label: "APPLIED MACHINE LEARNING / 2023",
    description: "An LSTM-based speech classifier with MFCC and spectral features, plus a Streamlit inference app.",
    stack: ["Python", "LSTM", "MFCC", "Streamlit"],
    href: "https://github.com/adityab-sd?tab=repositories",
    image: "/benchmark-workbench.jpg",
    imageAlt: "An analog signal testing bench with measurement instruments and handwritten evaluation notes",
  },
];

const filters = ["All work", "AI systems", "Cloud & realtime"] as const;

const proofPoints = [
  { value: "80%", label: "less manual effort", detail: "Scheduled CSV validation at DTCC" },
  { value: "40%", label: "faster file processing", detail: "On-demand pagination and SQL indexes" },
  { value: "2,000+", label: "live sports events", detail: "Processed through SportScore's event pipeline" },
  { value: "6h / 30s", label: "tiered cache TTLs", detail: "Balancing data freshness with API limits" },
];

const education = [
  { school: "University College Dublin", degree: "MSc Computer Science", period: "SEP 2025 — SEP 2026", detail: "GPA 3.80 / 4.2 · Dublin, Ireland" },
  { school: "Madras Institute of Technology · Anna University", degree: "B.Tech Information Technology", period: "AUG 2019 — JUN 2023", detail: "Chennai, India" },
];

const resumeToolkit = [
  {
    label: "Languages",
    skills: ["Java", "Python", "TypeScript", "SQL"],
    target: { left: 51, top: 37, width: 45, height: 58 },
    locator: "NOTEBOOK_LOGIC",
  },
  {
    label: "AI & Applied ML",
    skills: ["RAG pipelines", "LSTM", "MFCC", "Speech emotion recognition"],
    target: { left: 7, top: 13, width: 17, height: 37 },
    locator: "AGENT_LOOP",
  },
  {
    label: "Backend & data",
    skills: ["Spring Boot", "REST APIs", "Microservices", "Oracle", "PostgreSQL", "DynamoDB", "Redis"],
    target: { left: 23, top: 5, width: 43, height: 42 },
    locator: "MEMORY_BANK",
  },
  {
    label: "Frontend & interfaces",
    skills: ["React", "Angular", "Next.js", "GraphQL", "Tailwind CSS"],
    target: { left: 23, top: 45, width: 20, height: 17 },
    locator: "INPUT_DECK",
  },
  {
    label: "Cloud & delivery",
    skills: ["AWS", "Azure Functions", "Event Hub", "Container Apps", "Docker", "Kubernetes fundamentals", "Jenkins", "CI/CD"],
    target: { left: 17, top: 60, width: 32, height: 32 },
    locator: "PATCH_CABLES",
  },
] as const;

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const elements = ref.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!elements?.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return ref;
}

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return <p className="indie-label"><span>{index}</span>{children}</p>;
}

function ImagePanel({ src, alt, label, className = "" }: { src: string; alt: string; label: string; className?: string }) {
  return (
    <figure className={"indie-image-panel " + className}>
      <img src={src} alt={alt} loading="lazy" />
      <figcaption><span className="indie-live-dot" />{label}</figcaption>
    </figure>
  );
}

const storyFrames = [
  { key: "intro", label: "INTRO", focus: null },
  { key: "architecture", label: "01 / 03 · ARCHITECTURE", focus: { x: 0.73, y: 0.22, scale: 2.2 } },
  { key: "memory", label: "02 / 03 · VECTOR MEMORY", focus: { x: 0.52, y: 0.4, scale: 2.8 } },
  { key: "craft", label: "03 / 03 · PRODUCTION CRAFT", focus: { x: 0.5, y: 0.75, scale: 2.4 } },
] as const;

function ScrollytellingHero() {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const progressLabel = useRef<HTMLSpanElement>(null);
  const progressIndex = useRef<HTMLSpanElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const sectionNode = section.current;
    const viewportNode = viewport.current;
    const cameraNode = camera.current;
    const imageNode = image.current;
    const copyNodes = sectionNode?.querySelectorAll<HTMLElement>("[data-story-copy]");
    const fillNode = progressBar.current;
    if (!sectionNode || !viewportNode || !cameraNode || !imageNode || !copyNodes?.length || !fillNode) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 768) return;

    const cameraPosition = (focusX: number, focusY: number, scale: number) => {
      const width = viewportNode.clientWidth;
      const height = viewportNode.clientHeight;
      const aspect = (imageNode.naturalWidth || 2752) / (imageNode.naturalHeight || 1536);
      const renderedWidth = Math.max(width, height * aspect);
      const renderedHeight = Math.max(height, width / aspect);
      const pointX = (width - renderedWidth) / 2 + focusX * renderedWidth;
      const pointY = (height - renderedHeight) / 2 + focusY * renderedHeight;
      const targetX = width * 0.74;
      const targetY = height * 0.5;
      return {
        scale,
        x: targetX - (width / 2 + (pointX - width / 2) * scale),
        y: targetY - (height / 2 + (pointY - height / 2) * scale),
      };
    };

    const context = gsap.context(() => {
      const copies = Array.from(copyNodes);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.set(cameraNode, { x: 0, y: 0, scale: 1, transformOrigin: "50% 50%", force3D: true });
      gsap.set(copies.slice(1), { autoAlpha: 0, y: 20, filter: "blur(4px)" });
      gsap.set(fillNode, { scaleX: 0, transformOrigin: "left center" });

      let activeFrame = -1;
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionNode,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (trigger) => {
            const progress = trigger.progress;
            const currentFrame = progress < 0.24 ? 0 : progress < 0.53 ? 1 : progress < 0.81 ? 2 : 3;
            fillNode.parentElement?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
            if (currentFrame === activeFrame) return;
            activeFrame = currentFrame;
            if (progressLabel.current) progressLabel.current.textContent = storyFrames[currentFrame].label;
            if (progressIndex.current) progressIndex.current.textContent = `${String(currentFrame + 1).padStart(2, "0")} / 04`;
            sectionNode.dataset.focus = storyFrames[currentFrame].key;
          },
        },
      });

      timeline.to(cameraNode, { scale: 2.2, x: () => cameraPosition(0.73, 0.22, 2.2).x, y: () => cameraPosition(0.73, 0.22, 2.2).y, duration: 0.3 }, 0);
      timeline.to(cameraNode, { scale: 2.8, x: () => cameraPosition(0.52, 0.4, 2.8).x, y: () => cameraPosition(0.52, 0.4, 2.8).y, duration: 0.3 }, 0.3);
      timeline.to(cameraNode, { scale: 2.4, x: () => cameraPosition(0.5, 0.75, 2.4).x, y: () => cameraPosition(0.5, 0.75, 2.4).y, duration: 0.3 }, 0.6);
      timeline.to(fillNode, { scaleX: 1, duration: 1 }, 0);

      timeline.to(copies[0], { autoAlpha: 0, y: -20, filter: "blur(4px)", duration: 0.07 }, 0.2);
      timeline.fromTo(copies[1], { autoAlpha: 0, y: 20, filter: "blur(4px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.08 }, 0.22);
      timeline.to(copies[1], { autoAlpha: 0, y: -20, filter: "blur(4px)", duration: 0.07 }, 0.48);
      timeline.fromTo(copies[2], { autoAlpha: 0, y: 20, filter: "blur(4px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.08 }, 0.51);
      timeline.to(copies[2], { autoAlpha: 0, y: -20, filter: "blur(4px)", duration: 0.07 }, 0.76);
      timeline.fromTo(copies[3], { autoAlpha: 0, y: 20, filter: "blur(4px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.08 }, 0.79);
      timeline.to(copies[3], { autoAlpha: 0, y: -12, filter: "blur(3px)", duration: 0.06 }, 0.94);
    }, sectionNode);

    const refresh = () => ScrollTrigger.refresh();
    if (imageNode.complete) requestAnimationFrame(refresh);
    else imageNode.addEventListener("load", refresh, { once: true });
    window.addEventListener("resize", refresh, { passive: true });
    return () => {
      imageNode.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      context.revert();
    };
  }, []);

  return (
    <section ref={section} id="signal" className="indie-story-scroll" aria-label="AI engineering, explored through the workbench" data-focus="intro">
      <div ref={viewport} className="indie-story-viewport">
        <div ref={camera} className="indie-story-camera" aria-hidden="true">
          <img ref={image} src="/anchor-workbench.jpg" alt="" fetchPriority="high" />
        </div>
        <div className="indie-story-shade" aria-hidden="true" />
        <div className="indie-hero-top">
          <span>ADITYA BUDDHARAJAN <b>///</b> ENGINEERING NOTES</span>
          <span><i className="indie-live-dot" /> DUBLIN, IRELAND · OPEN TO OPPORTUNITIES</span>
        </div>
        <div className="indie-story-copy-stack">
          <div className="indie-story-copy indie-story-intro" data-story-copy>
            <SectionLabel index="AI / 01">ENGINEER · SYSTEMS BUILDER</SectionLabel>
            <h1 id="indie-title">Useful intelligence.<br /><em>Thoughtfully engineered.</em></h1>
            <p>Applied AI and dependable software, built around real people and real systems.</p>
            <div className="indie-actions">
              <a className="indie-button indie-button-accent" href="#projects">Explore selected work <ArrowDown aria-hidden="true" /></a>
              <a className="indie-button indie-button-light" href="/aditya-buddharajan-resume.pdf" download><Download aria-hidden="true" /> Resume PDF</a>
            </div>
          </div>
          <div className="indie-story-copy" data-story-copy>
            <SectionLabel index="01">ARCHITECTURE &amp; ORCHESTRATION</SectionLabel>
            <h2>Visualizing Complex<br />Agent Workflows</h2>
            <p>Designing deterministic state machines, supervisor routers, and tool-calling execution graphs with LangGraph and modern LLM frameworks.</p>
          </div>
          <div className="indie-story-copy" data-story-copy>
            <SectionLabel index="02">VECTOR MEMORY &amp; STORAGE</SectionLabel>
            <h2>Tangible Semantic<br />Retrieval</h2>
            <p>High-dimensional embedding pipelines, hybrid dense-sparse vector stores, and structured memory banks for long-horizon autonomous tasks.</p>
          </div>
          <div className="indie-story-copy" data-story-copy>
            <SectionLabel index="03">PRODUCTION CRAFTSMANSHIP</SectionLabel>
            <h2>Engineered for<br />Reliability</h2>
            <p>Moving beyond playground demos into production-grade systems: automated evals, observability traces, and resilient error recovery.</p>
          </div>
        </div>
        <div className="indie-hero-bottom"><span>FIELD 001 / AI + CLOUD</span><span>SCROLL TO MOVE THROUGH THE SYSTEM</span></div>
        <div className="indie-story-progress" aria-label="Hero story progress">
          <span ref={progressLabel}>INTRO</span>
          <div className="indie-story-progress-track" role="progressbar" aria-label="Scroll through the engineering story" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
            <div ref={progressBar} />
          </div>
          <span ref={progressIndex}>01 / 04</span>
        </div>
        <a className="indie-scroll-cue" href="#evidence" aria-label="Scroll to engineering evidence"><ArrowDown aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function ProjectShowcase() {
  const [active, setActive] = useState<(typeof filters)[number]>("All work");
  const visibleProjects = projects.filter((project) => active === "All work" || project.kind === active);
  return (
    <section id="projects" className="indie-section indie-projects">
      <div className="indie-section-heading" data-reveal>
        <SectionLabel index="02">SELECTED BUILDS / 2024—26</SectionLabel>
        <h2>Ideas, made<br /><em>operational.</em></h2>
      <p>Applied AI and full-stack systems, each grounded in a practical problem.</p>
      </div>
      <div className="indie-filter-row" role="group" aria-label="Filter projects">
        {filters.map((filter) => (
          <button type="button" key={filter} className={active === filter ? "is-active" : ""} aria-pressed={active === filter} onClick={() => setActive(filter)}>
            {filter}<span>{filter === "All work" ? "03" : "0" + projects.filter((project) => project.kind === filter).length}</span>
          </button>
        ))}
      </div>
      <div className="indie-project-grid" aria-live="polite">
        {visibleProjects.map((project) => (
          <article className="indie-project-card is-revealed" key={project.number}>
            <a className="indie-project-image" href={project.href} target="_blank" rel="noreferrer" aria-label={"Open " + project.name + " on GitHub"}>
              <img src={project.image} alt={project.imageAlt} loading="lazy" />
              <span className="indie-project-number">{project.number} / PROJECT FILE</span>
              <span className="indie-project-arrow"><ArrowUpRight aria-hidden="true" /></span>
            </a>
            <div className="indie-project-info">
              <p>{project.label}</p>
              <h3>{project.name}</h3>
              <p className="indie-project-description">{project.description}</p>
              <div className="indie-tags">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
              <a className="indie-text-link" href={project.href} target="_blank" rel="noreferrer">View repository <ArrowUpRight aria-hidden="true" /></a>
            </div>
          </article>
        ))}
      </div>
      <a className="indie-all-repos" href="https://github.com/adityab-sd?tab=repositories" target="_blank" rel="noreferrer"><Github aria-hidden="true" /> Browse all repositories <ArrowUpRight aria-hidden="true" /></a>
    </section>
  );
}

function CareerSection() {
  return (
    <section id="experience" className="indie-section indie-career">
      <div className="indie-section-heading" data-reveal>
        <SectionLabel index="04">CAREER LOG / v1—v3</SectionLabel>
        <h2>Built on strong<br /><em>foundations.</em></h2>
      </div>
      <div className="indie-career-list">
        {experience.map((role, index) => (
          <article className="indie-career-row" data-reveal key={role.id}>
            <span className="indie-career-version">0{index + 1}</span>
            <div><p>{role.period} · {role.location}</p><h3>{role.role} <span>/{role.company}</span></h3><p className="indie-career-summary">{role.description}</p></div>
            <ArrowUpRight aria-hidden="true" />
          </article>
        ))}
      </div>
      <div className="indie-education-grid">
        {education.map((item, index) => (
          <article className="indie-education-card" data-reveal key={item.school}>
            <span>EDUCATION / 0{index + 1} · {item.period}</span>
            <h3>{item.degree}</h3>
            <p>{item.school}</p>
            <small>{item.detail}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ToolkitSection() {
  const [activeSkill, setActiveSkill] = useState(0);
  const activeGroup = resumeToolkit[activeSkill];
  const { left, top, width, height } = activeGroup.target;
  const locatorPosition = activeSkill === 0 ? "indie-locator-top-left" : activeSkill === 2 ? "indie-locator-bottom-right" : "indie-locator-top-right";
  const focusStyle = {
    "--focus-left": `${left}%`,
    "--focus-top": `${top}%`,
    "--focus-right": `${100 - left - width}%`,
    "--focus-bottom": `${100 - top - height}%`,
    "--focus-x": `${left + width / 2 - 50}%`,
    "--focus-y": `${top + height / 2 - 50}%`,
    "--focus-width": width / 100,
    "--focus-height": height / 100,
  } as React.CSSProperties;

  return (
    <section id="skills" className="indie-section indie-toolkit">
      <div className="indie-section-heading" data-reveal>
        <SectionLabel index="05">TOOLS / THE MATERIALS</SectionLabel>
        <h2>Fluent across<br /><em>the stack.</em></h2>
        <p>Good products come from strong foundations, not a single model or framework.</p>
      </div>
      <div className="indie-toolkit-grid">
        <figure
          className="indie-image-panel indie-tools-image indie-knolling"
          data-reveal
          style={focusStyle}
          aria-label="Interactive engineering workbench skill map"
        >
          <div className="indie-knolling-stage">
            <img
              className="indie-knolling-image"
              src="/skills-workbench.jpg"
              alt="An engineering workbench with an open notebook, amber memory cassettes, a pocket synthesizer, circuit boards, switches, and patch cables"
              loading="lazy"
            />
            <div className="indie-knolling-shade" aria-hidden="true" />
            <div className="indie-knolling-highlight" aria-hidden="true">
              <img src="/skills-workbench.jpg" alt="" loading="lazy" />
            </div>
            <div className="indie-focus-reticle" aria-hidden="true">
              <span className="indie-reticle-cross indie-reticle-tl">+</span>
              <span className="indie-reticle-cross indie-reticle-tr">+</span>
              <span className="indie-reticle-cross indie-reticle-bl">+</span>
              <span className="indie-reticle-cross indie-reticle-br">+</span>
            </div>
            {resumeToolkit.map((group, index) => (
              <button
                key={group.label}
                type="button"
                className="indie-knolling-hotspot"
                style={{ left: `${group.target.left}%`, top: `${group.target.top}%`, width: `${group.target.width}%`, height: `${group.target.height}%` }}
                aria-label={`Focus ${group.label} on the workbench`}
                aria-pressed={activeSkill === index}
                onPointerEnter={() => setActiveSkill(index)}
                onFocus={() => setActiveSkill(index)}
                onClick={() => setActiveSkill(index)}
              />
            ))}
            <p className={`indie-knolling-locator ${locatorPosition}`} aria-live="polite">
              LOC: [X: {left + Math.round(width / 2)}, Y: {top + Math.round(height / 2)}] // {activeGroup.locator}
            </p>
          </div>
          <figcaption><span className="indie-live-dot" />TOOLS / {activeGroup.label.toUpperCase()} IN FOCUS</figcaption>
        </figure>

        <div className="indie-skill-groups" role="group" aria-label="Engineering skills">
          {resumeToolkit.map((group, index) => (
            <button
              type="button"
              className={`indie-skill-row${activeSkill === index ? " is-active" : ""}`}
              key={group.label}
              aria-expanded={activeSkill === index}
              aria-controls={`skill-panel-${index}`}
              onPointerEnter={() => setActiveSkill(index)}
              onFocus={() => setActiveSkill(index)}
              onClick={() => setActiveSkill(index)}
            >
              <span className="indie-skill-index">0{index + 1}</span>
              <span className="indie-skill-main">
                <span className="indie-skill-title"><span>{group.label}</span><ArrowUpRight aria-hidden="true" /></span>
                <span id={`skill-panel-${index}`} className="indie-skill-pills-clip" aria-hidden={activeSkill !== index}>
                  <span className="indie-skill-pills">
                    {group.skills.map((skill) => <span key={skill}>{skill}</span>)}
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndieContact() {
  return (
    <section id="contact" className="indie-contact">
      <img src="/anchor-workbench.jpg" alt="" aria-hidden="true" loading="lazy" />
      <div className="indie-contact-shade" />
      <div className="indie-contact-content" data-reveal>
        <SectionLabel index="06">END OF NOTES / START OF A CONVERSATION</SectionLabel>
        <h2>Let&apos;s make<br /><em>something useful.</em></h2>
        <p>AI systems, real-time products, or engineering that makes a difference.</p>
        <div className="indie-actions">
          <a className="indie-button indie-button-accent" href={"mailto:" + profile.email}><Mail aria-hidden="true" /> Get in touch <ArrowRight aria-hidden="true" /></a>
          <a className="indie-button indie-button-light" href="/aditya-buddharajan-resume.pdf" download><Download aria-hidden="true" /> Download resume</a>
        </div>
        <div className="indie-socials">
          <a href="https://github.com/adityab-sd" target="_blank" rel="noreferrer"><Github aria-hidden="true" /> GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin aria-hidden="true" /> LinkedIn</a>
          <a href="https://calendly.com/adityanarayananb/30min" target="_blank" rel="noreferrer">Book a conversation <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </div>
      <footer className="indie-footer"><a href="#signal">AB / AI ENGINEER</a><span>DUBLIN, IRELAND · © {new Date().getFullYear()}</span><a href="#signal">BACK TO TOP ↑</a></footer>
    </section>
  );
}

export function EngineerSpatialPage() {
  const root = useReveal();
  return (
    <div ref={root} className="engineer-indie-page" data-view="engineer">
      <ScrollytellingHero />
      <ImpactInterlock metrics={proofPoints} />
      <ProjectShowcase />
      <ArchitectureWorkbench />
      <CareerSection />
      <ToolkitSection />
      <IndieContact />
    </div>
  );
}

