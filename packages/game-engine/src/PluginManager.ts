import { NexusPlugin } from "@nexustable/plugin-sdk";


export class PluginManager {

  private plugins: NexusPlugin[] = [];


  register(
    plugin: NexusPlugin
  ){

    this.plugins.push(plugin);

    plugin.initialize();
  }


  unregister(
    name:string
  ){

    const plugin =
      this.plugins.find(
        p => p.name === name
      );


    if(!plugin) return;


    plugin.shutdown();


    this.plugins =
      this.plugins.filter(
        p => p.name !== name
      );
  }


  getPlugins(){

    return this.plugins;

  }

}