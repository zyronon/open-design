export default {
  eventMap: new Map(),
  on(eventTypes: any, cb: Function) {
    if (eventTypes instanceof Array) {
      eventTypes.forEach(eventType => {
        let cbs = this.eventMap.get(eventType);
        if (cbs) {
          cbs.push(cb);
        } else {
          cbs = [cb];
        }
        this.eventMap.set(eventType, cbs);
      })
      return
    }
    let cbs = this.eventMap.get(eventTypes);
    if (cbs) {
      cbs.push(cb);
    } else {
      cbs = [cb];
    }
    this.eventMap.set(eventTypes, cbs);
  },
  emit(eventType: string, val?: any) {
    let cbs: Function[] = this.eventMap.get(eventType);
    if (cbs) {
      cbs.map((cb) => cb(val));
    }
  },
  off(eventTypes: any) {
    if (eventTypes instanceof Array) {
      eventTypes.forEach(eventType => {
        let cbs = this.eventMap.has(eventType);
        if (cbs) {
          this.eventMap.delete(eventType);
        }
      })
      return
    }
    let cbs = this.eventMap.has(eventTypes);
    if (cbs) {
      this.eventMap.delete(eventTypes);
    }
  },
  offAll(){
    this.eventMap = new Map()
  }
}