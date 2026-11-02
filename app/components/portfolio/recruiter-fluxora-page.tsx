"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Check, Github, Linkedin } from "lucide-react";
import { recruiterCareer, recruiterCapabilityGroups, recruiterEvidence, recruiterProfile, recruiterProjects } from "@/data/recruiter";
import { RecruiterOrbitHero } from "./recruiter-orbit-hero";

gsap.registerPlugin(ScrollTrigger);

type RecruiterFluxoraPageProps = { onNavigate: (id: string) => void };

function FluxoraSectionHeading({ eyebrow, title, description, id }: { eyebrow: string; title: string; description?: string; id?: string }) {
  return (
    <div className="fluxora-section-heading">
      <p>{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description && <span>{description}</span>}
    </div>
  );
}

export function RecruiterFluxoraPage({ onNavigate }: RecruiterFluxoraPageProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.utils.toArray<HTMLElement>("[data-fluxora-reveal]").forEach((section) => {
      gsap.fromTo(section, { y: 44, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 84%", once: true },
      });
    });

  }, { scope: root });

  return (
    <div ref={root} className="fluxora-recruiter-page" data-view>
      <RecruiterOrbitHero onNavigate={onNavigate} />

      <section id="expertise" className="fluxora-section fluxora-capabilities" data-fluxora-reveal aria-labelledby="fluxora-capabilities-title">
        <FluxoraSectionHeading eyebrow="What I bring" title="From first commit to production." description="A practical mix of product engineering, platform thinking, and a bias toward shipping." id="fluxora-capabilities-title" />
        <div className="fluxora-capability-grid">
          {recruiterCapabilityGroups.map((capability, index) => <article className="fluxora-capability" key={capability.label}><div className="fluxora-capability-top"><span>0{index + 1}</span><ArrowUpRight aria-hidden="true" /></div><p>{capability.label}</p><h3>{capability.title}</h3><span>{capability.detail}</span></article>)}
        </div>
      </section>

      <section id="impact" className="fluxora-metrics-section" data-fluxora-reveal aria-labelledby="fluxora-metrics-title">
        <div className="fluxora-ambient fluxora-ambient-metrics" aria-hidden="true" />
        <FluxoraSectionHeading eyebrow="Proof, in production" title="The work made a difference." description="Selected outcomes from my work at DTCC and on SportScore." id="fluxora-metrics-title" />
        <div className="fluxora-metrics-grid">
          {recruiterEvidence.map((item) => <article className="fluxora-metric" key={item.value + item.label}><strong>{item.value}</strong><h3>{item.label}</h3><p>{item.detail}</p></article>)}
        </div>
        <p className="fluxora-metrics-note"><Check aria-hidden="true" /> Results are drawn from my resume and project records.</p>
      </section>

      <section id="projects" className="fluxora-section fluxora-projects" data-fluxora-reveal aria-labelledby="fluxora-projects-title">
        <div className="fluxora-projects-heading"><FluxoraSectionHeading eyebrow="Selected work" title="Proof, not promises." description="A few projects that show how I approach complex systems." id="fluxora-projects-title" /><a className="fluxora-all-work" href={recruiterProfile.github} target="_blank" rel="noreferrer">All repositories <ArrowUpRight aria-hidden="true" /></a></div>
        <div className="fluxora-project-grid">
          {recruiterProjects.map((project) => <article className={`fluxora-project-card ${project.featured ? "fluxora-project-featured" : ""}`} key={project.name}>
            <div className="fluxora-project-art"><Image className="fluxora-project-image" src={project.image} alt={`${project.name} project illustration`} fill sizes={project.featured ? "(max-width: 1000px) 100vw, 58vw" : "(max-width: 680px) 100vw, 42vw"} /></div>
            <div className="fluxora-project-body"><div className="fluxora-tile-top"><span>{project.category}</span><ArrowUpRight aria-hidden="true" /></div><h3>{project.name}</h3><p>{project.description}</p><div className="fluxora-project-tags">{project.technologies.map((tag) => <span key={tag}>{tag}</span>)}</div><a className="fluxora-github-link" href={project.href} target="_blank" rel="noreferrer"><Github aria-hidden="true" /> View on GitHub <ArrowRight aria-hidden="true" /></a></div>
          </article>)}
        </div>
      </section>

      <section id="experience" className="fluxora-section fluxora-career" data-fluxora-reveal aria-labelledby="fluxora-career-title">
        <FluxoraSectionHeading eyebrow="Experience and education" title="Built across teams and domains." description="Fintech foundations, advanced study, and applied cloud engineering." id="fluxora-career-title" />
        <div className="fluxora-career-list">{recruiterCareer.map((entry, index) => <article className="fluxora-career-item" key={entry.title}><span>0{index + 1}</span><p>{entry.period}</p><div><h3>{entry.title}</h3><strong>{entry.role}</strong><p>{entry.detail}</p></div><div className="fluxora-career-tags">{entry.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div>
      </section>

      <section id="contact" className="fluxora-contact" data-fluxora-reveal aria-labelledby="fluxora-contact-title">
        <div className="fluxora-contact-orbit" aria-hidden="true"><i /><i /><i /><b /></div>
        <div className="fluxora-contact-panel"><p className="fluxora-badge"><i aria-hidden="true" /> Next conversation</p><h2 id="fluxora-contact-title">Build something<br /><em>that matters.</em></h2><p>{recruiterProfile.availability}. Based in Dublin, authorized to work in Ireland without sponsorship.</p><div className="fluxora-contact-actions"><a className="fluxora-button fluxora-button-light" href={recruiterProfile.calendly} target="_blank" rel="noreferrer">Book a 30-minute call <ArrowRight aria-hidden="true" /></a><a className="fluxora-social-link" href={recruiterProfile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><Linkedin aria-hidden="true" /></a><a className="fluxora-social-link" href={recruiterProfile.github} target="_blank" rel="noreferrer" aria-label="GitHub profile"><Github aria-hidden="true" /></a></div></div>
        <footer className="fluxora-footer"><a href="#candidate" className="fluxora-footer-brand">AB<span>•</span></a><span>Adityanarayanan Buddharajan · Dublin, Ireland</span><div><a href={recruiterProfile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={recruiterProfile.github} target="_blank" rel="noreferrer">GitHub</a><a href={recruiterProfile.resume} download>Download resume</a></div></footer>
      </section>
    </div>
  );
}
