// src/events/controlBus.ts
type ControlUpdateEvent = {
  controlEventId: string;
  value: unknown;
};

type Handler = (payload: ControlUpdateEvent) => void;

class ControlBus {
  private map = new Map<string, Set<Handler>>(); // key = controlId

  on(controlEventId: string, handler: Handler) {
    let set = this.map.get(controlEventId);
    if (!set) {
      set = new Set();
      this.map.set(controlEventId, set);
    }
    set.add(handler);
    return () => this.off(controlEventId, handler); // unsubscribe
  }

  off(controlEventId: string, handler: Handler) {
    const set = this.map.get(controlEventId);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) this.map.delete(controlEventId);
  }

  emit(payload: ControlUpdateEvent) {
    const set = this.map.get(payload.controlEventId);
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
