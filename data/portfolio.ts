export const profile = {
  name: "Adityanarayanan Buddharajan",
  shortName: "Aditya",
  role: "AI Engineer",
  tagline: "Code. Cloud. Curiosity.",
  location: "Dublin, Ireland",
  email: "adityanarayananb@gmail.com",
  linkedin: "https://www.linkedin.com/in/adityanarayananb/",
};

export type DetailItem = {
  id: string;
  company?: string;
  name?: string;
  role?: string;
  period?: string;
  location?: string;
  type?: string;
  description: string;
  technologies: readonly string[];
  highlights: readonly string[];
};

export const experience: readonly DetailItem[] = [
  {
    id: "dtcc",
    company: "DTCC",
    role: "Software Engineer",
    period: "July 2023 to July 2025",
    location: "Chennai, India",
    description: "Production engineering for regulated financial infrastructure, spanning document processing, data retrieval, role-aware application experiences, and automated testing.",
    technologies: ["Java", "Spring Boot", "Angular", "SQL", "JUnit 5", "Swagger / OpenAPI"],
    highlights: [
      "Built a CSV upload and processing dashboard with Angular and Spring Boot, creating an asynchronous batch pipeline that reduced manual document processing time by 120 hours monthly.",
      "Developed field-level validation for data types and dates, saving the operations team 45 hours of manual correction work each month.",
      "Optimized announcement processing by replacing full-list SQL queries with paginated, on-demand queries and indexes on unique identifiers.",
      "Designed RESTful APIs using Swagger and OpenAPI, increasing daily transaction processing capacity by 2,000 requests per hour.",
      "Introduced JUnit 5 unit tests with mocking frameworks, reaching 80% coverage across three modules and reducing production defects from 10% to 5%.",
    ],
  },
  {
    id: "sportscore-collaboration",
    company: "UCD and Microsoft collaboration",
    role: "SportScore engineering project",
    period: "2026",
    location: "Dublin, Ireland",
    description: "A five-person project exploring real-time multi-sport tracking, accessibility-first audio updates, observability, and resilient caching.",
    technologies: ["Azure Event Hub", "Azure Functions", "SignalR", "Redis", "Azure Neural TTS"],
    highlights: [
      "Designed and built an Azure Event Hub to Azure Functions to SignalR streaming pipeline for live sports updates.",
      "Built Radio Mode, an audio-first experience using Azure Neural TTS for visually impaired and on-the-go users.",
      "Built a Redis hybrid caching layer with a fail-open pattern and split TTLs to balance freshness with availability.",
      "Worked on event deduplication and multi-sport event detection; project claims are limited to work that can be supported by individual contribution records.",
    ],
  },
];

export const projects: readonly DetailItem[] = [
  {
    id: "sportscore",
    name: "SportScore",
    type: "Real-time systems",
    description: "A real-time, multi-sport platform built by a five-person UCD team in collaboration with Microsoft.",
    technologies: ["Azure Event Hub", "Azure Functions", "SignalR", "Redis", "Next.js"],
    highlights: [
      "Streams event updates through an Azure Event Hub, Functions, and SignalR pipeline.",
      "Includes Radio Mode with Azure Neural TTS for accessible, audio-first updates.",
      "Uses a fail-open Redis cache with split TTLs; add verified project metrics before publishing.",
    ],
  },
  {
    id: "step-free-dublin",
    name: "Step-Free Dublin",
    type: "Accessible civic technology",
    description: "A wheelchair-first, confidence-aware route planner created for Build for Ireland and Dublin AI Week.",
    technologies: ["Accessibility", "Routing", "AI coding tools"],
    highlights: [
      "Represents unknown accessibility information as unknown rather than incorrectly marking it accessible.",
      "Includes low-vision considerations such as audio-friendly directions and tactile-paving cues.",
      "Keeps scope explicit: no claim of live camera vision or comprehensive real-time accessibility data.",
    ],
  },
  {
    id: "research-publications",
    name: "Research publications",
    type: "Applied research",
    description: "Three published research papers across speech emotion recognition and EEG-based music therapy.",
    technologies: ["Python", "Machine learning", "Signal processing", "IEEE", "IJSR"],
    highlights: [
      "Real-time speech emotion recognition published through IEEE.",
      "Music therapy using EEG brain-wave signals published through IJSR.",
      "A second paper explores an EEG-based music therapy application; add publication links before launch.",
    ],
  },
];

export const skillGroups = [
  { label: "Languages", skills: ["Java", "Python", "TypeScript", "SQL"] },
  { label: "Frontend", skills: ["React", "Next.js", "Accessible interfaces"] },
  { label: "Backend and cloud", skills: ["Spring Boot", "Azure Functions", "Event Hub", "SignalR", "REST APIs"] },
  { label: "Data and AI", skills: ["PostgreSQL", "Redis", "RAG pipelines", "Speech emotion recognition"] },
  { label: "Practices", skills: ["Unit testing", "Load testing", "CI/CD", "Secret management"] },
] as const;

export const technologies = [
  "Java", "Python", "TypeScript", "React", "Next.js", "Spring Boot", "Azure", "Event Hub", "Functions", "SignalR", "PostgreSQL", "Redis", "RAG", "Accessibility",
] as const;
