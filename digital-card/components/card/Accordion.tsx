"use client";
import { useState } from "react";

interface AccordionProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ icon, iconBg, title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="accordion-section">
      <div className="accordion-header" onClick={() => setOpen(!open)}>
        <div className="accordion-header-left">
          <div className="accordion-icon" style={{ background: iconBg }}>{icon}</div>
          <span>{title}</span>
        </div>
        <svg
          className={`accordion-chevron ${open ? "open" : ""}`}
          width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}
