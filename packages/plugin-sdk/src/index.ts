export interface NexusPlugin {
  name: string;
  version: string;

  initialize(): void;

  shutdown(): void;
}