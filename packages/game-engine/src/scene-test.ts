import {
  SceneManager,
  EntityManager
} from "./index";


const scenes = new SceneManager();
const entities = new EntityManager();


const dungeon =
  scenes.createScene(
    "The Forgotten Crypt"
  );


const goblin =
  entities.createEntity();


entities.addComponent(
  goblin.id,
  {
    type:"health",
    data:{
      hp:20
    }
  }
);


scenes.addEntity(
  dungeon.id,
  goblin
);


console.log(
  JSON.stringify(
    dungeon,
    null,
    2
  )
);