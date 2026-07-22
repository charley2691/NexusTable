import { useState, type ReactNode } from "react";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SidebarSection({
  title,
  children,
  defaultOpen = true,
}: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="gm-sidebar__section">
      <button
        className="gm-sidebar__section-header"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>

        <span
          className={`gm-sidebar__section-arrow ${
            isOpen ? "gm-sidebar__section-arrow--open" : ""
          }`}
          aria-hidden="true"
        >
          ▸
        </span>
      </button>

      {isOpen && (
        <div className="gm-sidebar__section-content">
          {children}
        </div>
      )}
    </section>
  );
}