import { Scene, Entity } from "@nexustable/shared";

export class SceneManager {
  private scenes: Map<string, Scene> = new Map();

  createScene(
    name: string
  ): Scene {

    const scene: Scene = {
      id: crypto.randomUUID(),
      name,
      entities: [],
      metadata: {}
    };

    this.scenes.set(
      scene.id,
      scene
    );

    return scene;
  }


  getScene(
    id: string
  ): Scene | undefined {

    return this.scenes.get(id);
  }


  getAllScenes(): Scene[] {

    return Array.from(
      this.scenes.values()
    );
  }


  addEntity(
    sceneId: string,
    entity: Entity
  ): void {

    const scene = this.scenes.get(sceneId);

    if (!scene) {
      throw new Error(
        `Scene ${sceneId} does not exist`
      );
    }

    scene.entities.push(entity);
  }


  removeEntity(
    sceneId: string,
    entityId: string
  ): void {

    const scene = this.scenes.get(sceneId);

    if (!scene) return;

    scene.entities =
      scene.entities.filter(
        entity =>
          entity.id !== entityId
      );
  }
}