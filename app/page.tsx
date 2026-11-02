"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Check, Command, Download, Mail, Menu, Moon, Sun, X } from "lucide-react";
import { experience, profile, projects, skillGroups, technologies, type DetailItem } from "@/data/portfolio";
import { DetailModal as PortfolioDetailModal } from "./components/portfolio/detail-modal";
import { PortfolioContent } from "./components/portfolio/portfolio-content";
import { PortfolioHeader } from "./components/portfolio/portfolio-header";
import { LensLanding } from "./components/LensLanding";
import { ViewTransition } from "./components/portfolio/view-transition";
import type { PortfolioView, Selection as PortfolioSelection, ViewTransitionPhase } from "./components/portfolio/types";

gsap.registerPlugin(ScrollTrigger);

type View = "recruiter" | "engineer";
type Selection = { item: DetailItem; kind: "experience" | "project" } | null;

const navItems = [
  ["Experience", "experience"],
  ["Projects", "projects"],
  ["Skills", "skills"],
  ["Contact", "contact"],
] as const;

const recruiterNavItems = [
  ["Profile", "candidate"],
  ["Expertise", "expertise"],
  ["Impact", "impact"],
  ["Experience", "experience"],
  ["Contact", "contact"],
] as const;

const engineerNavItems = [
  ["Signal", "signal"],
  ["Projects", "projects"],
  ["Systems", "systems"],
  ["Skills", "skills"],
  ["Contact", "contact"],
] as const;

function DetailModal({ selection, onClose }: { selection: Selection; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selection) requestAnimationFrame(() => dialogRef.current?.focus());
  }, [selection]);

  if (!selection) return null;
  const { item, kind } = selection;
  const title = item.company ?? item.name ?? "Detail";

  return (
    <div className="detail-backdrop" role="presentation" onMouseDown={onClose}>
      <div ref={dialogRef} className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title" tabIndex={-1} onMouseDown={(event) => event.stopPropagation()}>
        <button className="detail-close" onClick={onClose} aria-label="Close detail window"><X aria-hidden="true" /></button>
        <p className="detail-kicker">{kind === "experience" ? item.role : item.type}</p>
        <h2 id="detail-title">{title}</h2>
        <div className="detail-meta">
          {item.period && <span>{item.period}</span>}
          {item.location && <span>{item.location}</span>}
        </div>
        <p className="detail-description">{item.description}</p>
        <ul className="detail-list">{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
        <div className="detail-stack" aria-label={`${title} technologies`}>{item.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
      </div>
    </div>
  );
}

function ArchitectureFlow() {
  const nodes = ["Sports data providers", "Event adapter", "Azure Event Hub", "Azure Functions", "Redis and SignalR", "Web clients and Radio Mode"];
  return <div className="systems-flow" aria-label="SportScore event architecture">{nodes.map((node, index) => <div className="flow-node" key={node}><span>0{index + 1}</span><strong>{node}</strong>{index < nodes.length - 1 && <i aria-hidden="true" />}</div>)}</div>;
}

function LegacyHome() {
  const pathname = usePathname();
  const initialView: View = pathname.includes("engineer") ? "engineer" : "recruiter";
  const root = useRef<HTMLElement>(null);
  const [view, setView] = useState<View>(initialView);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selection, setSelection] = useState<Selection>(null);
  const [lightMode, setLightMode] = useState(view === "recruiter");
  const [technologyFilter, setTechnologyFilter] = useState<string | null>(null);
  

  const isRecruiter = view === "recruiter";
  const visibleNav = isRecruiter ? navItems : [...navItems.slice(0, 3), ["Systems", "systems"] as const, navItems[3]];
  const filteredProjects = useMemo(() => technologyFilter ? projects.filter((item) => item.technologies.some((technology) => technology.toLowerCase().includes(technologyFilter.toLowerCase()) || technologyFilter.toLowerCase().includes(technology.toLowerCase()))) : projects, [technologyFilter]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
    setPaletteOpen(false);
  };

  const chooseView = (nextView: View) => {
    setView(nextView);
    setLightMode(nextView === "recruiter");
    window.history.pushState({}, "", `/${nextView}`);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setPaletteOpen(false); setSelection(null); setMenuOpen(false); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setPaletteOpen((open) => !open); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const nextView: View = window.location.pathname.includes("engineer") ? "engineer" : "recruiter";
      setView(nextView);
      setLightMode(nextView === "recruiter");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from("[data-view]", { opacity: 0, y: 22, duration: 0.7, ease: "power3.out" });
    gsap.from("[data-hero-copy] > *", { opacity: 0, y: 16, duration: 0.6, stagger: 0.07, delay: 0.1, ease: "power3.out" });
    if (view === "engineer") ScrollTrigger.create({ trigger: "#systems", start: "top top", end: "+=520", pin: "[data-system-title]", pinSpacing: true });
  }, { scope: root, dependencies: [view] });

  const headline = isRecruiter ? "AI Engineer building useful, reliable agent and cloud systems." : "Building real-time systems, RAG assistants, and accessible software.";

  return (
    <main id="main-content" ref={root} className={`portfolio-shell portfolio-shell-${view} ${lightMode ? "theme-light" : "theme-dark"}`}>
      <a className="skip-link" href="#content">Skip to main content</a>
      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <button className="brand-button" onClick={() => scrollTo("top")} aria-label="Back to top">AB//OS</button>
          <div className="desktop-nav">{visibleNav.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}</div>
          <div className="nav-actions">
            <div className="view-switch" aria-label="Portfolio view">
              <button className={isRecruiter ? "active" : ""} onClick={() => chooseView("recruiter")}>Recruiter</button>
              <button className={!isRecruiter ? "active" : ""} onClick={() => chooseView("engineer")}>Engineer</button>
            </div>
            <button className="icon-button" onClick={() => setLightMode((current) => !current)} aria-label="Toggle colour theme">{lightMode ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}</button>
            <button className="command-button" onClick={() => setPaletteOpen(true)} aria-label="Open command palette"><Command size={17} aria-hidden="true" /><span>K</span></button>
            <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation menu" aria-expanded={menuOpen} aria-controls="mobile-menu">{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
          </div>
        </nav>
        {menuOpen && <div className="mobile-nav" id="mobile-menu">{visibleNav.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}<div className="mobile-view-switch"><button onClick={() => chooseView("recruiter")}>Recruiter view</button><button onClick={() => chooseView("engineer")}>Engineer view</button></div></div>}
      </header>

      <div data-view>
        <section id="top" className="mode-hero" aria-labelledby="hero-title">
          <div className="mode-hero-grid" aria-hidden="true" />
          <div className="mode-hero-orbit" aria-hidden="true" />
          <div className="mode-hero-content" data-hero-copy>
            <p className="mode-kicker">{isRecruiter ? "DUBLIN, IRELAND / OPEN TO AI ENGINEER ROLES" : "ENGINEERING NOTES / DUBLIN, IRELAND"}</p>
            <p className="identity-line">{profile.name} <span>{profile.tagline}</span></p>
            <h1 id="hero-title">{headline}</h1>
            <p className="mode-intro">MSc graduate from University College Dublin with experience across AI systems, cloud platforms, and reliable software delivery.</p>
            <div className="hero-actions">
              <button className="mode-primary-action" onClick={() => scrollTo("contact")}>{isRecruiter ? "Book a 20-minute call" : "Read the systems notes"}<ArrowRight aria-hidden="true" /></button>
              <button className="mode-secondary-action" onClick={() => scrollTo(isRecruiter ? "resume" : "projects")}>{isRecruiter ? "Resume availability" : "Browse project records"}<ArrowUpRight aria-hidden="true" /></button>
            </div>
          </div>
          <aside className="hero-ledger" aria-label="Portfolio overview">
            <span>{isRecruiter ? "QUICK READ" : "SYSTEM PROFILE"}</span>
            <dl>
              <div><dt>Based</dt><dd>Dublin, Ireland</dd></div>
              <div><dt>Focus</dt><dd>{isRecruiter ? "AI systems and cloud" : "Real-time and accessible"}</dd></div>
              <div><dt>Proof</dt><dd>3 research papers</dd></div>
              <div><dt>Availability</dt><dd>Update before launch</dd></div>
            </dl>
          </aside>
        </section>

        {isRecruiter && <section className="quick-facts" aria-label="Quick facts"><div><span>Location</span><strong>Dublin, hybrid and onsite welcome</strong></div><div><span>Education</span><strong>MSc, University College Dublin</strong></div><div><span>Work authorisation</span><strong>Authorized to work in Ireland, no sponsorship required</strong></div><div><span>Target roles</span><strong>AI Engineer and applied AI roles</strong></div></section>}

        <section id="content" className="experience-section" aria-labelledby="experience-heading">
          <div className="section-heading"><p>{isRecruiter ? "Career record" : "Production engineering"}</p><h2 id="experience-heading">{isRecruiter ? "Evidence before adjectives." : "Systems, constraints, and delivery."}</h2></div>
          <div className={isRecruiter ? "recruiter-experience-list" : "engineer-experience-grid"}>{experience.map((item, index) => <button className={isRecruiter ? "recruiter-experience-card" : `engineer-experience-card engineer-card-${index + 1}`} key={item.id} onClick={() => setSelection({ item, kind: "experience" })} aria-haspopup="dialog"><span className="card-index">0{index + 1}</span><span className="card-copy"><span className="card-period">{item.period}</span><strong>{item.company}</strong><span>{item.role}</span></span><ArrowRight className="card-arrow" aria-hidden="true" /></button>)}</div>
          <p className="section-note">Select a record for contributions, outcomes, and the supporting stack.</p>
        </section>

        <section id="skills" className="skills-section" aria-labelledby="skills-heading">
          <div className="section-heading"><p>{isRecruiter ? "Core skills" : "Technology map"}</p><h2 id="skills-heading">{isRecruiter ? "Capabilities connected to shipped work." : "Tools are useful only in context."}</h2></div>
          <div className="skill-group-grid">{skillGroups.map((group) => <a href="#projects" className="skill-group" key={group.label}><strong>{group.label}</strong><span>{group.skills.join(" · ")}</span><ArrowUpRight aria-hidden="true" /></a>)}</div>
        </section>

        <section id="projects" className="projects-section" aria-labelledby="projects-heading">
          <div className="section-heading"><p>{isRecruiter ? "Selected projects" : "Engineering records"}</p><h2 id="projects-heading">{isRecruiter ? "A small body of work, read closely." : "Design choices, not just technology lists."}</h2></div>
          {!isRecruiter && <div className="filter-bar" aria-label="Filter projects by technology"><button className={!technologyFilter ? "active" : ""} onClick={() => setTechnologyFilter(null)}>All work</button>{["Azure", "Accessibility", "Python"].map((technology) => <button className={technologyFilter === technology ? "active" : ""} onClick={() => setTechnologyFilter(technology)} key={technology}>{technology}</button>)}</div>}
          <div className={isRecruiter ? "recruiter-project-grid" : "engineer-project-list"}>{filteredProjects.map((item) => <button className={isRecruiter ? "recruiter-project-card" : "engineer-project-card"} key={item.id} onClick={() => setSelection({ item, kind: "project" })} aria-haspopup="dialog"><span className="card-index">{item.type}</span><strong>{item.name}</strong><span className="project-card-description">{item.description}</span><span className="project-open">View details <ArrowUpRight aria-hidden="true" /></span></button>)}</div>
          {!filteredProjects.length && <p className="empty-state">No published project record uses this filter yet. Choose another area to continue.</p>}
        </section>

        {!isRecruiter && <>
          <section id="systems" className="systems-section" aria-labelledby="systems-heading"><div data-system-title className="systems-heading"><p>Architecture notes</p><h2 id="systems-heading">SportScore data flow.</h2><p>Bursty event ingestion, event processing, caching, and delivery to concurrent clients. The detail page will document the final, personally verified implementation before launch.</p></div><ArchitectureFlow /></section>
          <section className="engineering-notes" aria-labelledby="notes-heading"><div className="section-heading"><p>How I work with AI</p><h2 id="notes-heading">Use it quickly. Verify it rigorously.</h2></div><div className="notes-grid"><article><span>01</span><h3>Planning and implementation</h3><p>Claude and Codex support planning, code generation, reviews, and testing. The output remains a starting point, not evidence of correctness.</p></article><article><span>02</span><h3>Reusable instructions</h3><p>I write scoped skill files for recurring work such as brainstorming-to-MVP discovery and accessibility-first interface checks.</p></article><article><span>03</span><h3>Responsible disclosure</h3><p>I disclose AI assistance where required, review generated changes, and validate behaviour before treating it as complete.</p></article><article><span>04</span><h3>Retrieval work</h3><p>SportScore explores chunking, retrieval through Azure AI Search and pgvector, and a test-set evaluation process. Publish verified results before launch.</p></article></div></section>
          <section className="principles-section" aria-labelledby="principles-heading"><div className="section-heading"><p>Engineering principles</p><h2 id="principles-heading">A few rules I keep returning to.</h2></div><div className="principles-list"><p><Check aria-hidden="true" /> Unknown is better than wrong, especially in accessibility data.</p><p><Check aria-hidden="true" /> Fail open for non-critical caching; fail closed for authentication.</p><p><Check aria-hidden="true" /> Measure before optimising, then record the trade-off.</p><p><Check aria-hidden="true" /> Accessibility belongs in the system design, not the last sprint.</p></div></section>
        </>}

        {isRecruiter && <section id="resume" className="resume-section" aria-labelledby="resume-heading"><div><p className="mode-kicker">Resume and availability</p><h2 id="resume-heading">Ready for the details.</h2><p>Replace the placeholder below with the current resume PDF before sharing this site publicly.</p></div><div className="resume-placeholder"><Download aria-hidden="true" /><strong>Resume PDF</strong><span>Upload the reviewed resume to enable download.</span><button disabled>Download when published</button></div></section>}

        <section id="contact" className="contact-section" aria-labelledby="contact-heading"><p className="mode-kicker">Contact</p><h2 id="contact-heading">Let&apos;s make the important parts work.</h2><p>Usually responds within 24 hours.</p><div className="contact-actions"><a className="mode-primary-action" href={`mailto:${profile.email}`}><Mail aria-hidden="true" /> Email Aditya</a><a className="mode-secondary-action" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight aria-hidden="true" /></a></div><p className="contact-note">Booking link: add your Cal.com or Calendly URL before launch.</p></section>
      </div>

      {paletteOpen && <div className="palette-backdrop" role="presentation" onMouseDown={() => setPaletteOpen(false)}><div className="palette" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(event) => event.stopPropagation()}><div><Command size={18} aria-hidden="true" /><span>Navigate {isRecruiter ? "Recruiter" : "Engineer"} view</span><button onClick={() => setPaletteOpen(false)} aria-label="Close command palette"><X aria-hidden="true" /></button></div>{visibleNav.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}<ArrowRight aria-hidden="true" /></button>)}</div></div>}
      <DetailModal selection={selection} onClose={() => setSelection(null)} />
    </main>
  );
}

function viewFromPath(pathname: string): PortfolioView | null {
  if (pathname.startsWith("/recruiter")) return "recruiter";
  if (pathname.startsWith("/engineer")) return "engineer";
  return null;
}

export default function Home() {
  const pathname = usePathname();
  const [view, setView] = useState<PortfolioView | null>(() => viewFromPath(pathname));
  const [transitionPhase, setTransitionPhase] = useState<ViewTransitionPhase>("idle");
  const [transitionTarget, setTransitionTarget] = useState<PortfolioView | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selection, setSelection] = useState<PortfolioSelection>(null);
  const [lightMode, setLightMode] = useState(view === "recruiter");
  const [technologyFilter, setTechnologyFilter] = useState<string | null>(null);
  const transitionTimers = useRef<number[]>([]);
  const [isLandingEntry, setIsLandingEntry] = useState(false);

  const clearTransitionTimers = () => {
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimers.current = [];
  };

  useEffect(() => () => clearTransitionTimers(), []);

  useEffect(() => {
  if (!isLandingEntry) return;

  const timer = window.setTimeout(() => {
    setIsLandingEntry(false);
  }, 820);

  return () => window.clearTimeout(timer);
}, [isLandingEntry]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setPaletteOpen(false); setSelection(null); setMenuOpen(false); }
      if (view && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view]);

  useEffect(() => {
    const onPopState = () => {
      const nextView = viewFromPath(window.location.pathname);
      clearTransitionTimers();
      setTransitionPhase("idle");
      setTransitionTarget(null);
      setView(nextView);
      setLightMode(nextView === "recruiter");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
    setPaletteOpen(false);
  };

  const openView = (nextView: PortfolioView) => {
    if (transitionPhase !== "idle" || view === nextView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setView(nextView);
      setLightMode(nextView === "recruiter");
      window.history.pushState({}, "", `/${nextView}`);
      window.scrollTo(0, 0);
      return;
    }

    clearTransitionTimers();
    setTransitionTarget(nextView);
    setTransitionPhase("prepare");
    requestAnimationFrame(() => setTransitionPhase("cover"));
    transitionTimers.current = [
      window.setTimeout(() => {
        setView(nextView);
        setLightMode(nextView === "recruiter");
        setTechnologyFilter(null);
        setMenuOpen(false);
        setPaletteOpen(false);
        window.history.pushState({}, "", `/${nextView}`);
        window.scrollTo(0, 0);
        setTransitionPhase("reveal");
      }, 390),
      window.setTimeout(() => {
        setTransitionPhase("idle");
        setTransitionTarget(null);
      }, 780),
    ];
  };

  const returnHome = () => {
    if (!view || transitionPhase !== "idle") return;
    setView(null);
    setSelection(null);
    setMenuOpen(false);
    setPaletteOpen(false);
    window.history.pushState({}, "", "/");
    window.scrollTo(0, 0);
  };

  const enterFromLanding = (nextView: PortfolioView) => {
  setView(nextView);
  setLightMode(nextView === "recruiter");
  setTechnologyFilter(null);
  setMenuOpen(false);
  setPaletteOpen(false);
  setIsLandingEntry(true);
  window.scrollTo(0, 0);
};

  if (!view) return <LensLanding onEnter={enterFromLanding} />;

  const visibleNavigation = view === "recruiter" ? recruiterNavItems : engineerNavItems;

  return (
    <main id="main-content" className={`portfolio-shell portfolio-shell-${view} ${ lightMode ? "theme-light" : "theme-dark"} ${isLandingEntry ? "is-landing-in" : ""}`}>
      <a className="skip-link" href={view === "recruiter" ? "#candidate" : "#signal"}>Skip to main content</a>
      <PortfolioHeader view={view} isLight={lightMode} isMenuOpen={menuOpen} onChooseView={openView} onNavigate={navigateTo} onOpenCommand={() => setPaletteOpen(true)} onToggleMenu={() => setMenuOpen((open) => !open)} onToggleTheme={() => setLightMode((current) => !current)} onReturnHome={returnHome} />
      <PortfolioContent view={view} activeTechnology={technologyFilter} onFilter={setTechnologyFilter} onNavigate={navigateTo} onSelect={(item, kind) => setSelection({ item, kind })} />
      {paletteOpen && <div className="palette-backdrop" role="presentation" onMouseDown={() => setPaletteOpen(false)}><div className="palette" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(event) => event.stopPropagation()}><div><Command size={18} aria-hidden="true" /><span>Navigate {view} view</span><button onClick={() => setPaletteOpen(false)} aria-label="Close command palette"><X aria-hidden="true" /></button></div>{visibleNavigation.map(([label, id]) => <button key={id} onClick={() => navigateTo(id)}>{label}<ArrowRight aria-hidden="true" /></button>)}</div></div>}
      <PortfolioDetailModal selection={selection} onClose={() => setSelection(null)} />
      <ViewTransition phase={transitionPhase} target={transitionTarget} />
    </main>
  );
}
