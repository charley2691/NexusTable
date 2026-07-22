import { useEffect, useState } from "react";
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

  const [activeSceneId, setActiveSceneId] =
    useState<string | null>(null);

  const [loadingSceneId, setLoadingSceneId] =
    useState<string | null>(null);

  const scenes = clientReady
    ? sceneManager.getAllScenes()
    : [];

  useEffect(() => {
    if (!clientReady) {
      setActiveSceneId(null);
      return;
    }

    const currentScene =
      sceneManager.getCurrentScene();

    setActiveSceneId(currentScene?.id ?? null);
  }, [clientReady, sceneManager]);

  const handleSceneClick = async (
    sceneId: string,
  ): Promise<void> => {
    if (
      sceneId === activeSceneId ||
      loadingSceneId !== null
    ) {
      return;
    }

    setLoadingSceneId(sceneId);

    try {
      const loaded = await client.loadScene(sceneId);

      if (loaded) {
        setActiveSceneId(sceneId);
      }
    } finally {
      setLoadingSceneId(null);
    }
  };

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
        const isActive =
          activeSceneId === scene.id;

        const isLoading =
          loadingSceneId === scene.id;

        return (
          <button
            key={scene.id}
            className={`gm-sidebar__scene ${
              isActive
                ? "gm-sidebar__scene--active"
                : ""
            }`}
            type="button"
            disabled={
              !clientReady ||
              loadingSceneId !== null
            }
            onClick={() =>
              void handleSceneClick(scene.id)
            }
            aria-pressed={isActive}
          >
            <span className="gm-sidebar__scene-icon">
              {isActive ? "◆" : "◇"}
            </span>

            <span className="gm-sidebar__scene-details">
              <strong>{scene.name}</strong>

              <small>
                {isLoading
                  ? "Loading scene..."
                  : isActive
                    ? "Active battlefield"
                    : "Click to activate"}
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