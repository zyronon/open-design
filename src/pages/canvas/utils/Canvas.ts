import {Shape} from "./Shape";
import {clear, clearAll} from "../utils";
import {debounce, throttle} from "lodash";


enum EventType {
  onClick = 'click',
  onDoubleClick = 'dblclick',
  onMouseMove = 'mousemove',
}

export class Canvas {
  private canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private canvasRect: DOMRect;
  private dpr: number;
  private children: any[]
  static instance: Canvas | null
  hoverOn: any

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

  clearChild() {
    this.children = []
  }

  static destroy() {
    this.instance = null
  }

  addChild(shape: Shape) {
    this.children.push(shape)
  }

  _draw() {
    clear({
      x: 0, y: 0, w: this.canvas.width, h: this.canvas.height
    }, this.ctx)
    this.ctx.save()
    console.log('this.children,', this.children)
    this.children.forEach(shape => shape.draw(this.ctx))
    this.ctx.restore()
  }

  // draw = debounce(this._draw, 50)
  draw = throttle(this._draw, 50)

  initEvent() {
    Object.values(EventType).forEach(eventName => {
      this.canvas.addEventListener(eventName, this.handleEvent)
    })
  }

  handleEvent = (e: any) => {
    console.log('e.type', e.type)
    let x = e.x - this.canvasRect.left
    let y = e.y - this.canvasRect.top
    // this.children
    //   .filter(shape => shape.isIn(x, y))
    //   .forEach(shape => shape.emit(e.type, e))
    if (this.hoverOn) {
      if (e.type === EventType.onClick) {

      } else {
      }
      this.hoverOn.event({x, y}, e.type, e)

    } else {
      this.children
        .forEach(shape => shape.event({x, y}, e.type, e))
    }
  }

}