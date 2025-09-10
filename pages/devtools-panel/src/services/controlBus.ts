// src/events/controlBus.ts
type ControlUpdateEvent = {
  event: string;
  value: unknown;
};

type Handler = (payload: ControlUpdateEvent) => void;

class ControlBus {
  private map = new Map<string, Set<Handler>>(); // key = controlId

  on(event: string, handler: Handler) {
    let set = this.map.get(event);
    if (!set) {
      set = new Set();
      this.map.set(event, set);
    }
    set.add(handler);
    return () => this.off(event, handler); // unsubscribe
  }

  off(event: string, handler: Handler) {
    const set = this.map.get(event);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) this.map.delete(event);
  }

  emit(payload: ControlUpdateEvent) {
    const set = this.map.get(payload.event);
    if (!set) return;
    for (const h of set) {
      try {
        h(payload);
      } catch (e) {
        console.warn('[controlBus] handler error', e);
      }
    }
  }

  // optional: broadcast to everyone (e.g., full refresh)
  emitAll(payload: ControlUpdateEvent) {
    for (const [, set] of this.map) {
      for (const h of set) {
        try {
          h(payload);
        } catch (e) {
          console.warn('[controlBus] handler error', e);
        }
      }
    }
  }
}

export const controlBus = new ControlBus();
