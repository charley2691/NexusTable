import { EntityManager } from "./EntityManager";

const entities = new EntityManager();

const goblin = entities.createEntity();

entities.addComponent(
  goblin.id,
  {
    type: "health",
    data: {
      hp: 20
    }
  }
);

console.log(
  "Created entity:",
  goblin
);

console.log(
  "Health entities:",
  entities.getEntitiesWithComponent("health")
);