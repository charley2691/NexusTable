import {
  Component,
  Entity
} from "@nexustable/shared";

import { EntityFactory } from "./EntityFactory";

export class EntityManager {
  private entities: Map<string, Entity> =
    new Map();

  createEntity(
    components: Component[] = []
  ): Entity {
    const entity =
      EntityFactory.create(components);

    this.entities.set(
      entity.id,
      entity
    );

    return entity;
  }

  addEntity(
    entity: Entity
  ): void {
    this.entities.set(
      entity.id,
      entity
    );
  }

  removeEntity(
    id: string
  ): void {
    this.entities.delete(id);
  }

  getEntity(
    id: string
  ): Entity | undefined {
    return this.entities.get(id);
  }

  getAllEntities(): Entity[] {
    return Array.from(
      this.entities.values()
    );
  }

  addComponent(
    entityId: string,
    component: Component
  ): void {
    const entity =
      this.entities.get(entityId);

    if (!entity) {
      throw new Error(
        `Entity ${entityId} does not exist`
      );
    }

    entity.components.push(component);
  }

  removeComponent(
    entityId: string,
    componentType: string
  ): void {
    const entity =
      this.entities.get(entityId);

    if (!entity) {
      return;
    }

    entity.components =
      entity.components.filter(
        component =>
          component.type !== componentType
      );
  }

  getEntitiesWithComponent(
    componentType: string
  ): Entity[] {
    return this.getAllEntities().filter(
      entity =>
        entity.components.some(
          component =>
            component.type === componentType
        )
    );
  }
}