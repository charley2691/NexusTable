type EventHandler<T = unknown> = (data: T) => void;

export class EventBus {
  private events: Map<string, EventHandler[]> = new Map();

  on<T>(event: string, handler: EventHandler<T>) {
    const listeners = this.events.get(event) ?? [];

    listeners.push(handler as EventHandler);

    this.events.set(event, listeners);
  }

  emit<T>(event: string, data: T) {
    const listeners = this.events.get(event);

    if (!listeners) return;

    listeners.forEach((handler) => {
      handler(data);
    });
  }

  off(event: string, handler: EventHandler) {
    const listeners = this.events.get(event);

    if (!listeners) return;

    this.events.set(
      event,
      listeners.filter((listener) => listener !== handler)
    );
  }
}