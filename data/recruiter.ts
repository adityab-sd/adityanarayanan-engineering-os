export const recruiterProfile = {
  headline: "AI systems, built to be useful.",
  introduction: "AI Engineer building reliable agent workflows, real-time products, and cloud systems.",
  availability: "Open to full-time AI Engineer roles",
  workAuthorisation: "Authorized to work in Ireland, no sponsorship required",
  calendly: "https://calendly.com/adityanarayananb/30min",
  github: "https://github.com/adityab-sd",
  linkedin: "https://www.linkedin.com/in/adityanarayananb/",
  resume: "/aditya-buddharajan-resume.pdf",
} as const;

export const recruiterEvidence = [
  { value: "120 hrs", label: "manual effort saved monthly", detail: "DTCC document processing" },
  { value: "2,000 / hr", label: "more request capacity", detail: "Paginated APIs and SQL tuning" },
  { value: "80%", label: "test coverage", detail: "Across three production modules" },
  { value: "2,000+", label: "live events processed", detail: "SportScore on Azure" },
] as const;

export const recruiterCapabilityGroups = [
  { label: "Agent systems", title: "Orchestration with purpose", detail: "LangGraph · FastAPI · Tool calling · Human approval" },
  { label: "RAG and context", title: "Targeted retrieval", detail: "RAG · Chunking · Context selection" },
  { label: "Cloud and realtime", title: "Event-driven delivery", detail: "Azure Functions · Event Hub · SignalR" },
  { label: "Applied ML", title: "Speech emotion recognition", detail: "Python · LSTM · MFCC · Streamlit" },
] as const;

export const recruiterProjects = [
  {
    name: "SportScore",
    category: "Realtime systems",
    description: "A live multi-sport platform with an Azure event pipeline, audio updates, and resilient caching.",
    technologies: ["Azure Event Hub", "Functions", "SignalR", "Redis"],
    href: "https://github.com/adityab-sd/sportscore_realtime_sports_tracking_application",
    image: "/sportscore-illustration.jpg",
    featured: true,
  },
  {
    name: "Incident response post-mortem agent",
    category: "AI engineering",
    description: "A recent project exploring AI-assisted incident response and post-mortem workflows.",
    technologies: ["Incident response", "AI agents", "Post-mortems"],
    href: "https://github.com/adityab-sd/incident-response-postmortem-agent",
    image: "/incident-response-illustration.png",
    featured: false,
  },
  {
    name: "Speech emotion recognition",
    category: "Applied research",
    description: "An LSTM-based speech classification pipeline with real-time inference in Streamlit.",
    technologies: ["Python", "LSTM", "MFCC", "Streamlit"],
    href: "https://github.com/adityab-sd",
    image: "/emotion-detection-illustration.jpg",
    featured: false,
  },
] as const;

export const recruiterCareer = [
  {
    period: "2023–2025",
    title: "DTCC",
    role: "Software Engineer",
    detail: "Built regulated fintech workflows from interface to production APIs.",
    tags: ["Java", "Spring Boot", "Angular"],
  },
  {
    period: "2025–2026",
    title: "University College Dublin",
    role: "MSc Computer Science",
    detail: "Advanced study in computer science, alongside applied engineering projects.",
    tags: ["Computer Science", "Research", "Engineering"],
  },
  {
    period: "2026",
    title: "SportScore",
    role: "UCD and Microsoft collaboration",
    detail: "Built event-driven live sports and audio experiences with cloud services.",
    tags: ["Event Hub", "Functions", "SignalR"],
  },
] as const;
