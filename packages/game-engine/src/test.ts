import { EventBus } from "./EventBus";

const bus = new EventBus();

bus.on("hello", (message) => {
  console.log(message);
});

bus.emit("hello", "NexusTable Engine Online");