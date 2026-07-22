import { SidebarSection } from "../SidebarSection";

export function SelectionPanel() {
  return (
    <SidebarSection title="Selected">
      <div className="gm-sidebar__empty-state">
        <strong>Nothing selected</strong>
        <span>
          Select an entity on the battlefield to inspect it.
        </span>
      </div>
    </SidebarSection>
  );
}