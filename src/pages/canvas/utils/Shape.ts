export class Shape {
  private listenerMap: Map<string, any>;

  constructor(props: any) {
    this.listenerMap = new Map()
  }

  on(eventName: string, listener: Function) {
    if (this.listenerMap.has(eventName)) {
      this.listenerMap.get(eventName).push(listener)
    } else {
      this.listenerMap.set(eventName, [listener])
    }
  }

  emit(eventName: string, event: any) {
    if (event == null || event.type == null) {
      return;
    }
    const listeners = this.listenerMap.get(eventName)
    if (!listeners) return
    for (let index = 0; index < listeners.length; index++) {
      const handler = listeners[index];
      handler(event)
    }
  }

  hover(ctx: any) {
    ctx.strokeStyle = 'rgb(139,80,255)'
    ctx.stroke()
    console.log('hover')
  }


  preDraw() {

  }
}