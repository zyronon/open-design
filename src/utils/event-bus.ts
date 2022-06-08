export default {
  eventMap: new Map(),
  on(eventType: string, cb: Function) {
    let cbs = this.eventMap.get(eventType);
    if (cbs) {
      cbs.push(cb);
    } else {
      cbs = [cb];
    }
    this.eventMap.set(eventType, cbs);
  },
  emit(eventType: string, val?: any) {
    let cbs: Function[] = this.eventMap.get(eventType);
    if (cbs) {
      cbs.map((cb) => cb(val));
    }
  },
  off(eventType: string) {
    let cbs = this.eventMap.has(eventType);
    if (cbs) {
      this.eventMap.delete(eventType);
    }
  },
};
