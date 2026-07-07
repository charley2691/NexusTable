import { Component } from "@nexustable/shared";


export class ComponentManager {

  private components:
    Map<string, Map<string, Component>>
    = new Map();



  addComponent(
    entityId:string,
    component:Component
  ):void {

    if(!this.components.has(component.type)){

      this.components.set(
        component.type,
        new Map()
      );

    }


    this.components
      .get(component.type)!
      .set(
        entityId,
        component
      );
  }



  removeComponent(
    entityId:string,
    componentType:string
  ):void {

    const store =
      this.components.get(componentType);


    if(!store) return;


    store.delete(entityId);
  }



  getComponent(
    entityId:string,
    componentType:string
  ):Component | undefined {

    return this.components
      .get(componentType)
      ?.get(entityId);

  }



  getEntitiesWithComponent(
    componentType:string
  ):string[] {

    return Array.from(
      this.components
        .get(componentType)
        ?.keys()
      ?? []
    );

  }

}