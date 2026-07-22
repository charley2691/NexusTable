import { SidebarSection } from "../SidebarSection";

export function PlayerPanel() {
  return (
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
  );
}