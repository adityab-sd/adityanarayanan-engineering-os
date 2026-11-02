"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight, LockKeyhole, Play, Radio, RotateCcw } from "lucide-react";

type Mode = "sportscore" | "incident";
type NodeSpec = { id: string; title: string; detail?: string; x: number; y: number; w: number; h?: number; group?: string };
type EdgeSpec = { from: string; to: string; d: string; kind?: "feedback" | "secondary"; twoWay?: boolean };

const sportNodes: NodeSpec[] = [
  { id: "espn", title: "ESPN API", detail: "Live event feeds", x: 2, y: 20, w: 13 },
  { id: "spring", title: "Spring Boot", detail: "Pollers · Redis · limits", x: 18, y: 20, w: 15 },
  { id: "hub", title: "Azure Event Hub", detail: "Partitioned stream", x: 37, y: 20, w: 15 },
  { id: "functions", title: "Azure Functions", detail: "Process · index", x: 56, y: 20, w: 15 },
  { id: "signalr", title: "SignalR", detail: "Live updates", x: 75, y: 20, w: 11 },
  { id: "client", title: "Next.js client", detail: "Live + Radio Mode", x: 87, y: 20, w: 12 },
  { id: "rest", title: "REST endpoints", detail: "Reference data", x: 19, y: 52, w: 16 },
  { id: "knowledge", title: "Knowledge assistant", detail: "Curated corpus · live index", x: 51, y: 60, w: 21 },
];
const sportEdges: EdgeSpec[] = [
  { from: "espn", to: "spring", d: "M150 148 H180" }, { from: "spring", to: "hub", d: "M330 148 H370" },
  { from: "hub", to: "functions", d: "M520 148 H560" }, { from: "functions", to: "signalr", d: "M710 148 H750" },
  { from: "signalr", to: "client", d: "M860 148 H870" }, { from: "spring", to: "rest", d: "M255 148 V340" },
  { from: "hub", to: "knowledge", d: "M445 148 V388 H510", kind: "secondary" },
  { from: "knowledge", to: "client", d: "M720 388 H735 V100 H930 V120", kind: "secondary", twoWay: true },
];

const incidentNodes: NodeSpec[] = [
  { id: "pagerduty", title: "PagerDuty", detail: "Trigger · ack · resolve", x: 2, y: 8, w: 14, group: "ingest" },
  { id: "slack", title: "Slack events", detail: "/triage · buttons", x: 2, y: 29, w: 14, group: "ingest" },
  { id: "alertmanager", title: "Alertmanager", detail: "Webhook", x: 2, y: 46, w: 14, group: "ingest" },
  { id: "router", title: "FastAPI router", detail: "Webhook · Slack", x: 19, y: 29, w: 15, group: "safety" },
  { id: "redaction", title: "Safety filters", detail: "Redact · block injection", x: 37, y: 29, w: 16, group: "safety" },
  { id: "gate", title: "ActionGate", detail: "Human approval", x: 17, y: 76, w: 13, group: "safety" },
  { id: "intake", title: "triage_intake", detail: "Normalize incident", x: 56, y: 7, w: 15, group: "core" },
  { id: "supervisor", title: "LangGraph supervisor", detail: "Groq · llama-3.1-8b-instant", x: 56, y: 31, w: 18, group: "core" },
  { id: "logs", title: "log_analyst", x: 77, y: 12, w: 14, group: "agents" },
  { id: "metrics", title: "metrics_analyst", x: 77, y: 24, w: 14, group: "agents" },
  { id: "changes", title: "change_correlator", x: 77, y: 36, w: 14, group: "agents" },
  { id: "topology", title: "topology_mapper", x: 77, y: 48, w: 14, group: "agents" },
  { id: "runbooks", title: "runbook_retriever", x: 77, y: 60, w: 14, group: "agents" },
  { id: "ranker", title: "hypothesis_ranker", detail: "Confidence + round", x: 56, y: 64, w: 18, group: "core" },
  { id: "remediation", title: "remediation_proposer", detail: "After confidence ≥ 0.70", x: 77, y: 73, w: 18, group: "core" },
  { id: "timeline", title: "timeline_builder", x: 2, y: 86, w: 14, group: "post" },
  { id: "writer", title: "postmortem_writer", x: 18, y: 86, w: 16, group: "post" },
  { id: "diagram", title: "diagram_generator", x: 36, y: 86, w: 16, group: "post" },
  { id: "store", title: "IncidentStore", detail: "SQLite / Postgres · checkpoint", x: 54, y: 86, w: 18, group: "storage" },
  { id: "tracer", title: "LLM tracer", detail: "Calls · budget enforcement", x: 74, y: 86, w: 22, group: "storage" },
];
const incidentEdges: EdgeSpec[] = [
  { from: "pagerduty", to: "router", d: "M160 76 H175 V202 H190" }, { from: "slack", to: "router", d: "M160 202 H190" },
  { from: "alertmanager", to: "router", d: "M160 304 H175 V202 H190" }, { from: "router", to: "redaction", d: "M340 202 H370" },
  { from: "slack", to: "gate", d: "M160 202 H175 V484 H190", kind: "secondary" },
  { from: "redaction", to: "supervisor", d: "M530 202 H545 V214 H560" }, { from: "supervisor", to: "intake", d: "M650 186 V98" },
  { from: "intake", to: "logs", d: "M710 70 H750 V100 H770" }, { from: "intake", to: "metrics", d: "M710 90 H750 V172 H770" },
  { from: "intake", to: "changes", d: "M710 110 H750 V244 H770" }, { from: "intake", to: "topology", d: "M710 130 H750 V316 H770" },
  { from: "intake", to: "runbooks", d: "M710 150 H750 V388 H770" }, { from: "logs", to: "ranker", d: "M770 100 H745 V412 H740" },
  { from: "metrics", to: "ranker", d: "M770 172 H745 V412 H740" }, { from: "changes", to: "ranker", d: "M770 244 H745 V412 H740" },
  { from: "topology", to: "ranker", d: "M770 316 H745 V412 H740" }, { from: "runbooks", to: "ranker", d: "M770 388 H745 V412 H740" },
  { from: "ranker", to: "remediation", d: "M740 412 H755 V466 H770" }, { from: "ranker", to: "logs", d: "M740 412 H755 V100 H770", kind: "feedback" },
  { from: "remediation", to: "gate", d: "M770 466 H305 V484 H300" }, { from: "pagerduty", to: "timeline", d: "M20 76 H8 V544 H20", kind: "secondary" },
  { from: "timeline", to: "writer", d: "M160 544 H180", kind: "secondary" }, { from: "writer", to: "diagram", d: "M340 544 H360", kind: "secondary" },
  { from: "supervisor", to: "store", d: "M560 214 H535 V544 H540", kind: "secondary", twoWay: true },
  { from: "supervisor", to: "tracer", d: "M740 214 V496 H850 V516", kind: "secondary", twoWay: true },
];

const modeSteps: Record<Mode, { title: string; note: string }[]> = {
  sportscore: [
    { title: "Capture", note: "ESPN → Spring Boot" }, { title: "Stream", note: "Azure Event Hub" },
    { title: "Process", note: "Functions + indexing" }, { title: "Deliver", note: "SignalR + Radio Mode" },
  ],
  incident: [
    { title: "Ingest", note: "PagerDuty · Slack · alerts" }, { title: "Validate", note: "FastAPI · filters · gate" },
    { title: "Orchestrate", note: "LangGraph supervisor" }, { title: "Resolve", note: "Agents · remediation · review" },
  ],
};

export function ArchitectureWorkbench() {
  const [mode, setMode] = useState<Mode>("sportscore");
  const [focused, setFocused] = useState<string | null>(null);
  const [simulation, setSimulation] = useState(-1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (mode !== "incident" || simulation < 0 || simulation >= 5) return;
    const timer = window.setTimeout(() => setSimulation((step) => step + 1), reducedMotion ? 120 : 780);
    return () => window.clearTimeout(timer);
  }, [mode, simulation, reducedMotion]);

  const nodes = mode === "sportscore" ? sportNodes : incidentNodes;
  const edges = mode === "sportscore" ? sportEdges : incidentEdges;
  const simulationIds = ["pagerduty", "router", "supervisor", "logs", "ranker", "gate"];
  const activeId = mode === "incident" && simulation >= 0 ? simulationIds[Math.min(simulation, simulationIds.length - 1)] : null;
  const related = useMemo(() => {
    if (!focused) return new Set<string>();
    const found = new Set([focused]);
    edges.forEach((edge) => {
      if (edge.from === focused) found.add(edge.to);
      if (edge.to === focused) found.add(edge.from);
    });
    return found;
  }, [edges, focused]);

  function startSimulation() {
    setFocused(null);
    setSimulation(0);
  }

  return (
    <section id="systems" className="indie-section indie-architecture-workbench">
      <div className="indie-section-heading" data-reveal>
        <p className="indie-label">03 UNDER THE HOOD / ARCHITECTURE SCHEMATICS</p>
        <h2>Connect the<br /><em>moving parts.</em></h2>
        <p>From real-time event streaming to multi-agent autonomous reasoning loops.</p>
      </div>

      <div className="architecture-modebar" role="group" aria-label="Choose an architecture">
        <button type="button" aria-pressed={mode === "sportscore"} className={mode === "sportscore" ? "is-active" : ""} onClick={() => { setMode("sportscore"); setFocused(null); setSimulation(-1); }}>
          <span className="mode-dot" /> 01 / SPORTScore PIPELINE
        </button>
        <button type="button" aria-pressed={mode === "incident"} className={mode === "incident" ? "is-active" : ""} onClick={() => { setMode("incident"); setFocused(null); setSimulation(-1); }}>
          <span className="mode-dot" /> 02 / INCIDENT RESPONSE
        </button>
      </div>

      <div className="architecture-stages" aria-label={`${mode === "sportscore" ? "SportScore" : "Incident response"} stages`}>
        {modeSteps[mode].map((step, i) => <div key={`${mode}-${step.title}`}><span>0{i + 1}</span><strong>{step.title}</strong><small>{step.note}</small></div>)}
      </div>

      <div className="architecture-layout" data-reveal>
        <section className="architecture-board-card" aria-label="Interactive architecture diagram">
          <div className="architecture-card-head">
            <span>{mode === "sportscore" ? "SPORTSCORE / EVENT PIPELINE" : "INCIDENT AGENT / STATE GRAPH"}</span>
            <span className="indie-chip-status"><i className="indie-live-dot" /> {focused ? "DEPENDENCIES HIGHLIGHTED" : "INTERACTIVE MAP"}</span>
          </div>
          <div className={`architecture-canvas-scroll ${mode === "incident" ? "is-tall" : ""}`} tabIndex={0} aria-label="Scrollable system diagram; focus or hover a node to inspect its dependencies">
            <div key={mode} className={`architecture-canvas architecture-canvas-${mode}`}>
              <svg className="architecture-edges" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
                <defs><marker id="arch-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="none" stroke="currentColor" strokeWidth="1.2" /></marker></defs>
                {edges.map((edge, i) => <path key={`${edge.from}-${edge.to}-${i}`} d={edge.d} className={`architecture-edge ${edge.kind ?? ""} ${mode === "sportscore" ? "is-streaming" : ""} ${focused && related.has(edge.from) && related.has(edge.to) ? "is-related" : ""} ${activeId && (edge.from === activeId || edge.to === activeId) ? "is-packet-active" : ""}`} markerStart={edge.twoWay ? "url(#arch-arrow)" : undefined} markerEnd="url(#arch-arrow)" />)}
              </svg>
                {mode === "incident" && <>
                <span className="architecture-lane lane-ingest">SIGNAL SOURCES</span><span className="architecture-lane lane-safety">SAFETY BOUNDARY</span>
                <span className="architecture-lane lane-agents">PARALLEL TELEMETRY POD</span><span className="architecture-lane lane-persistence">POST-INCIDENT + PERSISTENCE</span><span className="architecture-loop-label">&lt; 0.70 / ROUND &lt; 3 · RETRY</span>
              </>}
              {nodes.map((node) => {
                const dimmed = Boolean(focused && !related.has(node.id));
                const lit = node.id === activeId || (simulation >= 3 && ["metrics", "changes", "topology", "runbooks"].includes(node.id) && simulation === 3);
                return <button type="button" key={node.id} className={`architecture-node ${node.group ? `group-${node.group}` : ""} ${dimmed ? "is-dimmed" : ""} ${lit ? "is-simulated" : ""} ${node.id === "gate" ? "is-gate" : ""}`} style={{ left: `${node.x}%`, top: `${node.y}%`, width: `${node.w}%` }} onMouseEnter={() => setFocused(node.id)} onMouseLeave={() => setFocused(null)} onFocus={() => setFocused(node.id)} onBlur={() => setFocused(null)} aria-label={`${node.title}${node.detail ? `: ${node.detail}` : ""}. Highlights connected dependencies.`}>
                  {node.id === "gate" && <LockKeyhole aria-hidden="true" />}
                  <strong>{node.title}</strong>{node.detail && <small>{node.detail}</small>}
                </button>;
              })}
            </div>
          </div>
          <div className="architecture-board-foot">
            <p>{mode === "sportscore" ? "EVENT → STREAM → PROCESS → DELIVER · RADIO MODE ADDS AZURE NEURAL TTS" : "LOW CONFIDENCE LOOPS TO INVESTIGATION · APPROVAL GATES REMEDIATION"}</p>
            {mode === "incident" && <div className="architecture-sim-controls"><button type="button" onClick={startSimulation}><Play size={13} fill="currentColor" /> {simulation >= 0 && simulation < 5 ? "Restart simulated trace" : "Simulate PagerDuty alert"}</button><span aria-live="polite">{simulation >= 0 ? simulation >= 5 ? "ACTIONGATE / AWAITING SRE APPROVAL" : `SIMULATED TRACE / ${simulation + 1} OF 6` : "TRACE IDLE"}</span></div>}
          </div>
        </section>

        <aside className={`architecture-context architecture-context-${mode}`} aria-label="Context and telemetry">
          <img src={mode === "sportscore" ? "/rag-workbench.jpg" : "/systems-workbench.jpg"} alt="Analog engineering workbench with connected computing equipment" loading="lazy" />
          <div className="architecture-context-shade" />
          <div className="architecture-context-content">
            <div className="architecture-context-label"><Activity size={14} /> {mode === "sportscore" ? "CONTEXT + RETRIEVAL SYSTEMS" : "SIMULATED AGENT TRACE"}</div>
            {mode === "sportscore" ? <div className="architecture-metrics"><span><b>2,000+</b> live events processed</span><span><b>6h / 30s</b> tiered cache TTLs</span><span><b><Radio size={13} /> RADIO</b> audio mode</span></div> : <div className="architecture-trace"><code>SUPERVISOR → FANOUT (5 AGENTS)</code><code>log_analyst: simulated 404 spike</code><code>change_correlator: simulated deploy</code><code>CONFIDENCE: 0.82 → REVIEW</code><small>Illustrative trace · no live incident data</small></div>}
          </div>
        </aside>
      </div>
      <p className="architecture-hint"><RotateCcw size={12} /> Focus a node to trace its direct connections</p>
    </section>
  );
}
