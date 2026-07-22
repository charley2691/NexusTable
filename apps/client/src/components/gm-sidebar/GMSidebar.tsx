import { useState, type ReactNode } from "react";
import "./GMSidebar.css";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

function SidebarSection({
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

      {isOpen && <div className="gm-sidebar__section-content">{children}</div>}
    </section>
  );
}

export function GMSidebar() {
  const [assetSearch, setAssetSearch] = useState("");
  const [assetType, setAssetType] = useState("all");

  return (
    <aside className="gm-sidebar">
      <header className="gm-sidebar__header">
        <div>
          <p className="gm-sidebar__eyebrow">NexusTable</p>
          <h1 className="gm-sidebar__title">GM Workspace</h1>
        </div>

        <span className="gm-sidebar__role-badge">GM</span>
      </header>

      <div className="gm-sidebar__content">
        <SidebarSection title="Scenes">
          <button className="gm-sidebar__scene gm-sidebar__scene--active">
            <span className="gm-sidebar__scene-icon">◆</span>

            <span className="gm-sidebar__scene-details">
              <strong>Current Scene</strong>
              <small>Active battlefield</small>
            </span>
          </button>

          <button className="gm-sidebar__secondary-button" type="button">
            + Create Scene
          </button>
        </SidebarSection>

        <SidebarSection title="Asset Library">
          <label className="gm-sidebar__field">
            <span className="gm-sidebar__field-label">Search</span>

            <input
              className="gm-sidebar__input"
              type="search"
              value={assetSearch}
              onChange={(event) => setAssetSearch(event.target.value)}
              placeholder="Search assets..."
            />
          </label>

          <label className="gm-sidebar__field">
            <span className="gm-sidebar__field-label">Type</span>

            <select
              className="gm-sidebar__select"
              value={assetType}
              onChange={(event) => setAssetType(event.target.value)}
            >
              <option value="all">All assets</option>
              <option value="map">Maps</option>
              <option value="token">Tokens</option>
              <option value="monster">Monsters</option>
              <option value="npc">NPCs</option>
              <option value="object">Objects</option>
              <option value="effect">Effects</option>
            </select>
          </label>

          <div className="gm-sidebar__empty-state">
            <strong>No assets yet</strong>
            <span>
              Imported maps, tokens and game objects will appear here.
            </span>
          </div>
        </SidebarSection>

        <SidebarSection title="Selected">
          <div className="gm-sidebar__empty-state">
            <strong>Nothing selected</strong>
            <span>Select an entity on the battlefield to inspect it.</span>
          </div>
        </SidebarSection>

        <SidebarSection title="Players" defaultOpen={false}>
          <div className="gm-sidebar__player">
            <span className="gm-sidebar__status-dot gm-sidebar__status-dot--online" />

            <span>
              <strong>Game Master</strong>
              <small>Local session</small>
            </span>
          </div>

          <div className="gm-sidebar__empty-state gm-sidebar__empty-state--small">
            <span>Multiplayer participants will appear here.</span>
          </div>
        </SidebarSection>
      </div>

      <footer className="gm-sidebar__footer">
        <span>v0.1.0-alpha</span>
        <span>Local session</span>
      </footer>
    </aside>
  );
}