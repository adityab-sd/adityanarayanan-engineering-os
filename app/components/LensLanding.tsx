"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { BriefcaseBusiness, Code2 } from "lucide-react";
import type { PortfolioView } from "./portfolio/types";

export const LANDING_EXIT_DURATION_MS = 5000;

type LensLandingProps = {
  onEnter: (view: PortfolioView) => void;
};

type LandingStyle = CSSProperties & {
  "--zoom-origin-x": string;
  "--zoom-origin-y": string;
  "--lens-transition-accent": string;
};

const choices = [
  {
    view: "recruiter" as const,
    label: "Recruiter View",
    title: "RECRUITER VIEW",
    action: "OPEN RECRUITER VIEW",
    Icon: BriefcaseBusiness,
    image: "/recruiter-infrastructure.png",
  },
  {
    view: "engineer" as const,
    label: "Engineer View",
    title: "ENGINEER VIEW",
    action: "OPEN ENGINEER VIEW",
    Icon: Code2,
    image: "/anchor-workbench.jpg",
  },
];

const waveformBars = Array.from({ length: 32 }, (_, index) => index);

export function LensLanding({ onEnter }: LensLandingProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState<PortfolioView | null>(null);
  const [navigating, setNavigating] = useState<PortfolioView | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState({ x: "50vw", y: "50dvh" });

  const audioRef = useRef<HTMLAudioElement>(null);
  const navigationTimer = useRef<number | undefined>(undefined);
  const finishingTimer = useRef<number | undefined>(undefined);
  const progressFrame = useRef<number | undefined>(undefined);

  const selectedChoice = choices.find((choice) => choice.view === navigating);

  const landingStyle: LandingStyle = {
    "--zoom-origin-x": zoomOrigin.x,
    "--zoom-origin-y": zoomOrigin.y,
    "--lens-transition-accent": navigating === "engineer" ? "#f5c384" : "#8fc5ff",
  };

  useEffect(() => {
    router.prefetch("/recruiter");
    router.prefetch("/engineer");

    return () => {
      if (navigationTimer.current !== undefined) {
        window.clearTimeout(navigationTimer.current);
      }
      if (finishingTimer.current !== undefined) {
        window.clearTimeout(finishingTimer.current);
      }
      if (progressFrame.current !== undefined) {
        window.cancelAnimationFrame(progressFrame.current);
      }
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [router]);

  const clearHovered = (view: PortfolioView) => {
    setHovered((current) => (current === view ? null : current));
  };

  const chooseView = (view: PortfolioView, event: MouseEvent<HTMLButtonElement>) => {
    if (navigating) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    setZoomOrigin({
      x: `${bounds.left + bounds.width / 2}px`,
      y: `${bounds.top + bounds.height / 2}px`,
    });
    setNavigating(view);
    setHovered(view);
    setProgress(0);
    setFinishing(false);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audio = audioRef.current;

    if (!reducedMotion && audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.playbackRate = 1.2;
      audio.volume = 0.78;
      void audio.play().catch(() => {
        audio.pause();
      });
    }

    const enterView = () => {
      const route = `/${view}`;
      router.push(route);

      if (window.location.pathname !== route) {
        window.history.pushState({}, "", route);
      }

      onEnter(view);
    };

    if (reducedMotion) {
      setProgress(100);
      setFinishing(true);
      navigationTimer.current = window.setTimeout(enterView, 0);
      return;
    }

    const startedAt = performance.now();
    const loaderStartsAt = startedAt + 1000;
    const loaderDuration = 3500;
    let lastAnnouncedProgress = -1;

    const updateProgress = (now: number) => {
      const elapsed = Math.max(0, now - loaderStartsAt);
      const rawProgress = Math.min(100, Math.floor((elapsed / loaderDuration) * 100));
      const nextProgress = rawProgress === 100 ? 100 : Math.floor(rawProgress / 5) * 5;

      if (nextProgress !== lastAnnouncedProgress) {
        lastAnnouncedProgress = nextProgress;
        setProgress(nextProgress);
      }

      if (nextProgress < 100) {
        progressFrame.current = window.requestAnimationFrame(updateProgress);
      }
    };

    progressFrame.current = window.requestAnimationFrame(updateProgress);
    finishingTimer.current = window.setTimeout(() => setFinishing(true), 4500);
    navigationTimer.current = window.setTimeout(enterView, LANDING_EXIT_DURATION_MS);
  };

  const tiltCard = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse" || navigating) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    event.currentTarget.style.setProperty(
      "--tilt-x",
      `${((0.5 - y) * 8).toFixed(2)}deg`,
    );
    event.currentTarget.style.setProperty(
      "--tilt-y",
      `${((x - 0.5) * 9).toFixed(2)}deg`,
    );
  };

  const resetCardTilt = (
    event: PointerEvent<HTMLButtonElement>,
    view: PortfolioView,
  ) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    clearHovered(view);
  };

  const syncMessage =
    navigating === "recruiter"
      ? "SYNCING PRODUCTION EVALS & AGENT ARCHITECTURES..."
      : "SYNCING SYSTEMS, AGENTS & PROJECTS...";

  return (
    <main
      className={
        "lens-landing" +
        (hovered ? ` is-hover-${hovered}` : "") +
        (navigating ? ` is-navigating is-navigating-${navigating}` : "") +
        (finishing ? " is-completing" : "")
      }
      style={landingStyle}
      aria-label="Choose a portfolio view"
    >
      <div className="lens-grid-layer" aria-hidden="true" />
      <div className="lens-world-layer" aria-hidden="true" />
      <div className="lens-center-light" aria-hidden="true" />

      <header className="lens-topbar">
        <span className="lens-wordmark">AB//OS</span>
      </header>

      <section className="lens-intro" aria-labelledby="lens-title">
        <h1 id="lens-title">
          <span>Choose</span>
          <span className="lens-heading-ending">
            your <span className="lens-heading-experience">experience.</span>
          </span>
        </h1>
      </section>

      <div className="lens-avatar-wrapper" aria-hidden="true">
        <Image
          className="lens-avatar"
          src="/images/3d-avatar.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 639px) 100vw, 76vw"
        />
      </div>

      <svg
        className="lens-circuit-layer"
        viewBox="0 0 1600 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className="lens-circuit lens-circuit-recruiter">
          <path d="M312 0 V24" />
          <path d="M300 3 V21" />
          <path d="M324 5 V23" />
          <circle cx="312" cy="23" r="2" />
        </g>
        <g className="lens-circuit lens-circuit-engineer">
          <path d="M1288 0 V24" />
          <path d="M1276 5 V23" />
          <path d="M1300 3 V21" />
          <circle cx="1288" cy="23" r="2" />
        </g>
      </svg>

      <nav className="lens-choices" aria-label="Portfolio views">
        {choices.map(({ view, label, title, action, Icon, image }) => (
          <button
            key={view}
            className={`lens-choice lens-choice-${view}`}
            data-view={view}
            type="button"
            aria-label={`Open ${label}`}
            disabled={Boolean(navigating)}
            onPointerEnter={() => setHovered(view)}
            onPointerMove={tiltCard}
            onPointerLeave={(event) => resetCardTilt(event, view)}
            onFocus={() => setHovered(view)}
            onBlur={() => clearHovered(view)}
            onClick={(event) => chooseView(view, event)}
          >
            <Image
              className="lens-choice-image"
              src={image}
              alt=""
              fill
              priority
              sizes="(max-width: 639px) 45vw, 24vw"
            />
            <span className="lens-choice-shade" aria-hidden="true" />
            <span className="lens-choice-content">
              

              <span className="lens-choice-icon">
                 <Icon strokeWidth={1.7} aria-hidden="true" />
              </span>

              <strong className="lens-choice-label">{title}</strong>
              

              <span className="lens-choice-action">
                {action} <span aria-hidden="true">→</span>
              </span>
            </span>
            <span className="lens-choice-corner" aria-hidden="true" />
          </button>
        ))}
      </nav>

      <audio
        ref={audioRef}
        src="/audio/portal-transition.wav"
        preload="auto"
        hidden
        aria-hidden="true"
      />

      <div
        className={`lens-transition${navigating ? " is-active" : ""}`}
        aria-hidden={!navigating}
      >
        <span className="lens-portal-flare" aria-hidden="true" />
        <span className="lens-transition-orbit lens-transition-orbit-a" aria-hidden="true" />
        <span className="lens-transition-orbit lens-transition-orbit-b" aria-hidden="true" />

        <div className="lens-transition-content">
          <div className="lens-transition-lockup">
            {selectedChoice && (
              <selectedChoice.Icon
                className="lens-transition-icon"
                strokeWidth={1.45}
                aria-hidden="true"
              />
            )}
            <span className="lens-transition-name">{selectedChoice?.label}</span>
          </div>

          {navigating && (
            <div className="lens-telemetry" aria-hidden="true">
              <span>[ SYSTEM: INITIALIZING RUNTIME ENVIRONMENT ]</span>
              <span>[ TARGET ROUTE: /{navigating.toUpperCase()} ]</span>
              <span>[ {syncMessage} ]</span>
              <span>
                [ TELEMETRY STATUS:{" "}
                {progress >= 100 ? "ONLINE (100%)" : `SYNCING (${progress}%)`} ]
              </span>

              <div className="lens-progress-row">
                <span className="lens-progress-track">
                  <span
                    className="lens-progress-fill"
                    style={{ transform: `scaleX(${progress / 100})` }}
                  />
                </span>
                <span className="lens-progress-value">{progress}%</span>
              </div>

              <span className="lens-audio-wave">
                {waveformBars.map((bar) => (
                  <i key={bar} style={{ animationDelay: `${bar * 28}ms` }} />
                ))}
              </span>
            </div>
          )}
        </div>

        {navigating && (
          <span className="sr-only" role="status" aria-live="polite">
            Opening {selectedChoice?.label}.
          </span>
        )}
      </div>
    </main>
  );
}
