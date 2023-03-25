interface Listener {
  (data?: any): void;
}

class EventBus {
  private listeners: { [eventName: string]: Listener[] } = {};
  private eventQueue: { name: string; data?: any }[] = [];
  private static instance: EventBus;

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public on(eventName: string, listener: Listener): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);
  }

  public off(eventName: string, listener: Listener): void {
    if (!this.listeners[eventName]) {
      return;
    }
    const index = this.listeners[eventName].indexOf(listener);
    if (index !== -1) {
      this.listeners[eventName].splice(index, 1);
    }
  }

  public emit(eventName: string, data?: any): void {
    if (!this.listeners[eventName]) {
      return;
    }
    this.eventQueue.push({ name: eventName, data });
    this.processQueue();
  }

  private processQueue(): void {
    if (this.eventQueue.length === 0) {
      return;
    }
    const { name, data } = this.eventQueue.shift()!;
    const listeners = this.listeners[name];
    listeners.forEach((listener) => listener(data));
    this.processQueue();
  }
}

export default EventBus;