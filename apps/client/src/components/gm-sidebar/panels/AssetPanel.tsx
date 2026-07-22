import { useState } from "react";
import { SidebarSection } from "../SidebarSection";

export function AssetPanel() {
  const [assetSearch, setAssetSearch] = useState("");
  const [assetType, setAssetType] = useState("all");

  return (
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
          Imported maps, tokens and game objects will appear
          here.
        </span>
      </div>
    </SidebarSection>
  );
}