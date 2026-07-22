import { Battlefield } from "@nexustable/battlefield";

export class NexusClient {
  private readonly battlefield: Battlefield;

  private battlefieldContainer: HTMLElement | null = null;

  private initialized = false;

  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.battlefield = new Battlefield();
  }

  initialize(
    container: HTMLElement,
  ): Promise<void> {
    if (this.initialized) {
      return Promise.resolve();
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.battlefieldContainer = container;

    this.initializationPromise =
      this.initializeBattlefield(container);

    return this.initializationPromise;
  }

  private async initializeBattlefield(
    container: HTMLElement,
  ): Promise<void> {
    try {
      await this.battlefield.initialize(container);

      this.initialized = true;
    } catch (error) {
      this.initializationPromise = null;

      throw error;
    }
  }

  getBattlefield(): Battlefield {
    return this.battlefield;
  }

  getCampaignManager() {
    return this.battlefield.getCampaignManager();
  }

  getActiveCampaign() {
    return this
      .battlefield
      .getCampaignManager()
      .getActiveCampaign();
  }

  getSceneManager() {
    return this.battlefield.getSceneManager();
  }

  getSelectionManager() {
    return this.battlefield.getSelectionManager();
  }

  getEventBus() {
    return this.battlefield.getEventBus();
  }

  getAssetManager() {
    return this.battlefield.getAssetManager();
  }

  async loadScene(
    sceneId: string,
  ): Promise<boolean> {
    if (!this.initialized) {
      return false;
    }

    return this.battlefield.loadScene(sceneId);
  }

  getBattlefieldContainer(): HTMLElement | null {
    return this.battlefieldContainer;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  isInitializing(): boolean {
    return (
      this.initializationPromise !== null &&
      !this.initialized
    );
  }
}