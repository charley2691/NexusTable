import type { NexusClient } from "../../core/NexusClient";
import { AssetPanel } from "./panels/AssetPanel";
import { PlayerPanel } from "./panels/PlayerPanel";
import { ScenePanel } from "./panels/ScenePanel";
import { SelectionPanel } from "./panels/SelectionPanel";
import "./GMSidebar.css";

interface GMSidebarProps {
  client: NexusClient;
  clientReady: boolean;
}

export function GMSidebar({
  client,
  clientReady,
}: GMSidebarProps) {
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
        <ScenePanel
          client={client}
          clientReady={clientReady}
        />

        <AssetPanel />

        <SelectionPanel />

        <PlayerPanel />
      </div>

      <footer className="gm-sidebar__footer">
        <span>v0.1.0-alpha</span>
        <span>Local session</span>
      </footer>
    </aside>
  );
}