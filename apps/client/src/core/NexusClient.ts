import { Battlefield } from "@nexustable/battlefield";

/**
 * Central controller for the NexusTable client application.
 *
 * React components should communicate with the application through this
 * controller rather than creating their own engine or battlefield instances.
 */
export class NexusClient {
  private readonly battlefield: Battlefield;
  private battlefieldContainer: HTMLElement | null = null;
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.battlefield = new Battlefield();
  }

  /**
   * Initializes the battlefield inside the supplied container.
   *
   * If initialization is already running, callers receive the same promise
   * and wait for the existing initialization process to finish.
   */
  initialize(container: HTMLElement): Promise<void> {
    if (this.initialized) {
      return Promise.resolve();
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.battlefieldContainer = container;

    this.initializationPromise = this.initializeBattlefield(container);

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

  /**
   * Returns the shared battlefield instance.
   */
  getBattlefield(): Battlefield {
    return this.battlefield;
  }

  /**
   * Returns the application's scene manager.
   */
  getSceneManager() {
    return this.battlefield.getSceneManager();
  }

  /**
   * Returns the application's selection manager.
   */
  getSelectionManager() {
    return this.battlefield.getSelectionManager();
  }

  /**
   * Returns the shared application event bus.
   */
  getEventBus() {
    return this.battlefield.getEventBus();
  }

  /**
   * Returns the application's asset manager.
   */
  getAssetManager() {
    return this.battlefield.getAssetManager();
  }

  /**
   * Returns the element currently hosting the battlefield.
   */
  getBattlefieldContainer(): HTMLElement | null {
    return this.battlefieldContainer;
  }

  /**
   * Reports whether initialization has completed.
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reports whether initialization is currently running.
   */
  isInitializing(): boolean {
    return (
      this.initializationPromise !== null &&
      !this.initialized
    );
  }
}