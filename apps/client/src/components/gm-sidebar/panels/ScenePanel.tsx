import type { NexusClient } from "../../../core/NexusClient";
import { SidebarSection } from "../SidebarSection";

interface ScenePanelProps {
  client: NexusClient;
  clientReady: boolean;
}

export function ScenePanel({
  client,
  clientReady,
}: ScenePanelProps) {
  const sceneManager = client.getSceneManager();

  const scenes = clientReady
    ? sceneManager.getAllScenes()
    : [];

  const currentScene = clientReady
    ? sceneManager.getCurrentScene()
    : null;

  return (
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
        const isActive = currentScene?.id === scene.id;

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
        title="Scene creation will be added later"
      >
        + Create Scene
      </button>
    </SidebarSection>
  );
}