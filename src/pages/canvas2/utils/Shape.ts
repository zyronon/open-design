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

  draw(ctx: CanvasRenderingContext2D): void {
  }

  isIn(): void {
  }

}