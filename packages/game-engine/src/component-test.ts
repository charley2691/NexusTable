import {
  ComponentManager,
  EntityManager
} from "./index";


const entities =
  new EntityManager();


const components =
  new ComponentManager();



const goblin =
  entities.createEntity();



components.addComponent(
  goblin.id,
  {
    type:"health",
    data:{
      hp:20
    }
  }
);



console.log(
  components.getComponent(
    goblin.id,
    "health"
  )
);



console.log(
  components.getEntitiesWithComponent(
    "health"
  )
);