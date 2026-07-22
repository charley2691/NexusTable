import { useState, type ReactNode } from "react";
import type { NexusClient } from "../../core/NexusClient";
import "./GMSidebar.css";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

interface GMSidebarProps {
  client: NexusClient;
  clientReady: boolean;
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

      {isOpen && (
        <div className="gm-sidebar__section-content">
          {children}
        </div>
      )}
    </section>
  );
}

export function GMSidebar({
  client,
  clientReady,
}: GMSidebarProps) {
  const [assetSearch, setAssetSearch] = useState("");
  const [assetType, setAssetType] = useState("all");

  const sceneManager = client.getSceneManager();

  const scenes = clientReady
    ? sceneManager.getAllScenes()
    : [];

  const currentScene = clientReady
    ? sceneManager.getCurrentScene()
    : null;

  return (
    <aside className="gm-sidebar">
      <header className="gm-sidebar__header">
        <div>
          <p className="gm-sidebar__eyebrow">
            NexusTable
          </p>

          <h1 className="gm-sidebar__title">
            GM Workspace
          </h1>
        </div>

        <span className="gm-sidebar__role-badge">
          GM
        </span>
      </header>

      <div className="gm-sidebar__content">
        <SidebarSection title="Scenes">
          {!clientReady && (
            <div className="gm-sidebar__empty-state">
              <strong>Loading scenes</strong>
              <span>
                Waiting for the battlefield to initialize.
              </span>
            </div>
          )}

          {clientReady && scenes.length === 0 && (
            <div className="gm-sidebar__empty-state">
              <strong>No scenes available</strong>
              <span>
                Create a scene to begin building your adventure.
              </span>
            </div>
          )}

          {scenes.map((scene) => {
            const isActive =
              currentScene?.id === scene.id;

            return (
              <button
                key={scene.id}
                className={`gm-sidebar__scene ${
                  isActive
                    ? "gm-sidebar__scene--active"
                    : ""
                }`}
                type="button"
              >
                <span className="gm-sidebar__scene-icon">
                  {isActive ? "◆" : "◇"}
                </span>

                <span className="gm-sidebar__scene-details">
                  <strong>{scene.name}</strong>

                  <small>
                    {isActive
                      ? "Active battlefield"
                      : "Available scene"}
                  </small>
                </span>
              </button>
            );
          })}

          <button
            className="gm-sidebar__secondary-button"
            type="button"
            disabled
            title="Scene creation will be added next"
          >
            + Create Scene
          </button>
        </SidebarSection>

        <SidebarSection title="Asset Library">
          <label className="gm-sidebar__field">
            <span className="gm-sidebar__field-label">
              Search
            </span>

            <input
              className="gm-sidebar__input"
              type="search"
              value={assetSearch}
              onChange={(event) =>
                setAssetSearch(event.target.value)
              }
              placeholder="Search assets..."
            />
          </label>

          <label className="gm-sidebar__field">
            <span className="gm-sidebar__field-label">
              Type
            </span>

            <select
              className="gm-sidebar__select"
              value={assetType}
              onChange={(event) =>
                setAssetType(event.target.value)
              }
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
              Imported maps, tokens and game objects will
              appear here.
            </span>
          </div>
        </SidebarSection>

        <SidebarSection title="Selected">
          <div className="gm-sidebar__empty-state">
            <strong>Nothing selected</strong>
            <span>
              Select an entity on the battlefield to inspect it.
            </span>
          </div>
        </SidebarSection>

        <SidebarSection
          title="Players"
          defaultOpen={false}
        >
          <div className="gm-sidebar__player">
            <span className="gm-sidebar__status-dot gm-sidebar__status-dot--online" />

            <span>
              <strong>Game Master</strong>
              <small>Local session</small>
            </span>
          </div>

          <div className="gm-sidebar__empty-state gm-sidebar__empty-state--small">
            <span>
              Multiplayer participants will appear here.
            </span>
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