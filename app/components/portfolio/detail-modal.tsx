"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Selection } from "./types";

export function DetailModal({ selection, onClose }: { selection: Selection; onClose: () => void }) {
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
        <div className="detail-meta">{item.period && <span>{item.period}</span>}{item.location && <span>{item.location}</span>}</div>
        <p className="detail-description">{item.description}</p>
        <ul className="detail-list">{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
        <div className="detail-stack" aria-label={`${title} technologies`}>{item.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
      </div>
    </div>
  );
}
