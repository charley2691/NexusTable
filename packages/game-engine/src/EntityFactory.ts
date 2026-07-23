import {
  Component,
  createUuid,
  Entity
} from "@nexustable/shared";

export class EntityFactory {
  static create(
    components: Component[] = []
  ): Entity {
    return {
      id: createUuid(),
      components: [...components]
    };
  }
}