import {Shape} from "./Shape";

const eventList = [
  'click',
  'mousemove',
  // ...
]

export class Canvas {
  private canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private canvasRect: DOMRect;
  private dpr: number;
  private children: any[]
  static instance: Canvas

  constructor(canvas: HTMLCanvasElement) {
    this.children = []
    let canvasRect = canvas.getBoundingClientRect()
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    let {width, height} = canvasRect
    let dpr = window.devicePixelRatio;
    if (dpr) {
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.height = height * dpr;
      canvas.width = width * dpr;
      ctx.scale(dpr, dpr);
    }
    this.canvas = canvas
    this.ctx = ctx
    this.dpr = dpr
    this.canvasRect = canvasRect
  }

  static getInstance(canvas?: any) {
    if (!this.instance) {
      this.instance = new Canvas(canvas)
    }
    return this.instance
  }

  addChild(shape: Shape) {
    this.children.push(shape)
  }

  draw() {
    this.children.forEach(shape => shape.draw(this.ctx))
  }

  initEvent() {
    eventList.forEach(eventName => {
      this.canvas.addEventListener(eventName, this.handleEvent)
    })
  }

  handleEvent = (e: any) => {
    let x = e.x - this.canvasRect.left
    let y = e.y - this.canvasRect.top
    // this.children
    //   .filter(shape => shape.isIn(x, y))
    //   .forEach(shape => shape.emit(e.type, e))

    this.children
      .forEach(shape => shape.event({x, y}, e.type, e))
  }

}