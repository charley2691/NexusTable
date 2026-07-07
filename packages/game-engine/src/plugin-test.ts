import {
  PluginManager
} from "./index";


const plugins =
  new PluginManager();


plugins.register({

  name:"Test Plugin",

  version:"0.0.1",


  initialize(){

    console.log(
      "Plugin started"
    );

  },


  shutdown(){

    console.log(
      "Plugin stopped"
    );

  }

});


console.log(
  plugins.getPlugins()
);