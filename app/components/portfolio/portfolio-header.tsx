"use client";

import { Command, Download, Github, Linkedin, Moon, Sun } from "lucide-react";
import type { PortfolioView } from "./types";

const navigation = [
  ["Experience", "experience"],
  ["Projects", "projects"],
  ["Skills", "skills"],
  ["Contact", "contact"],
] as const;

const recruiterNavigation = [
  ["Profile", "candidate"],
  ["Expertise", "expertise"],
  ["Impact", "impact"],
  ["Experience", "experience"],
  ["Contact", "contact"],
] as const;

const engineerNavigation = [
  ["Impact", "evidence"],
  ["Projects", "projects"],
  ["Systems", "systems"],
  ["Experience", "experience"],
  ["Skills", "skills"],
  ["Contact", "contact"],
] as const;

type PortfolioHeaderProps = {
  view: PortfolioView;
  isLight: boolean;
  isMenuOpen: boolean;
  onChooseView: (view: PortfolioView) => void;
  onNavigate: (id: string) => void;
  onOpenCommand: () => void;
  onToggleMenu: () => void;
  onToggleTheme: () => void;
  onReturnHome: () => void;
};

export function PortfolioHeader({ view, isLight, isMenuOpen, onChooseView, onNavigate, onOpenCommand, onToggleMenu, onToggleTheme, onReturnHome }: PortfolioHeaderProps) {
  const visibleNavigation = view === "recruiter" ? recruiterNavigation : engineerNavigation;

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <button className="brand-button" onClick={onReturnHome} aria-label="Choose a portfolio view">AB//OS</button>
        {view === "engineer" && <div className="engineer-head-status"><i aria-hidden="true" /><span><b>AVAILABLE FOR ROLES</b><small>DUBLIN · IRELAND</small></span></div>}
        <div className="desktop-nav">{visibleNavigation.map(([label, id]) => <button key={id} onClick={() => onNavigate(id)}>{label}</button>)}</div>
        <div className="nav-actions">
          <div className="view-switch" aria-label="Portfolio view">
            <button className={view === "recruiter" ? "active" : ""} onClick={() => onChooseView("recruiter")}>Recruiter</button>
            <button className={view === "engineer" ? "active" : ""} onClick={() => onChooseView("engineer")}>Engineer</button>
          </div>
          {view === "engineer" && <div className="engineer-head-links"><a href="/aditya-buddharajan-resume.pdf" download aria-label="Download resume"><Download aria-hidden="true" /></a><a href="https://github.com/adityab-sd" target="_blank" rel="noreferrer" aria-label="GitHub profile"><Github aria-hidden="true" /></a><a href="https://www.linkedin.com/in/adityanarayananb/" target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><Linkedin aria-hidden="true" /></a></div>}
          {view !== "engineer" && <button className="icon-button" onClick={onToggleTheme} aria-label="Toggle colour theme">{isLight ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}</button>}
          <button className="command-button" onClick={onOpenCommand} aria-label="Open command palette"><Command size={17} aria-hidden="true" /><span>K</span></button>
          <button className="menu-button" onClick={onToggleMenu} aria-label="Toggle navigation menu" aria-expanded={isMenuOpen} aria-controls="mobile-menu">{isMenuOpen ? <SolarCloseIcon /> : <SolarMenuIcon />}</button>
        </div>
      </nav>
      {isMenuOpen && <div className="mobile-nav" id="mobile-menu">{visibleNavigation.map(([label, id]) => <button key={id} onClick={() => onNavigate(id)}>{label}</button>)}<div className="mobile-view-switch"><button onClick={() => onChooseView("recruiter")}>Recruiter view</button><button onClick={() => onChooseView("engineer")}>Engineer view</button></div></div>}
    </header>
  );
}

function SolarMenuIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></svg>;
}

function SolarCloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.75" y="3.75" width="16.5" height="16.5" rx="4" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="m9 9 6 6m0-6-6 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></svg>;
}
