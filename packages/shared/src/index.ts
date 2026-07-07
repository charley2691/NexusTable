export interface Entity {
  id: string;
  components: Component[];
}

export interface Component {
  type: string;
  data: Record<string, unknown>;
}

export interface Scene {
  id: string;
  name: string;
  entities: Entity[];
  metadata: Record<string, unknown>;
}