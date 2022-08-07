import {Shape} from "./Shape";
import {clear, clearAll} from "../utils";
import {debounce, throttle} from "lodash";
import {BaseSyntheticEvent, SyntheticEvent} from "react";
import {BaseEvent, EventType} from "../type";


export class Canvas {
  private canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private canvasRect: DOMRect;
  private dpr: number;
  private children: any[]
  static instance: Canvas | null
  //当hover时，只向hover那个图形传递事件。不用递归整个树去判断isIn
  hoverShape: any
  selectedShape: any

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
    // console.log('this.children,', this.children)
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
    //重写禁止事件
    e.stopPropagation = () => e.capture = true
    // console.log('e.type', e.type)
    let x = e.x - this.canvasRect.left
    let y = e.y - this.canvasRect.top
    // this.children
    //   .filter(shape => shape.isIn(x, y))
    //   .forEach(shape => shape.emit(e.type, e))
    if (this.hoverShape) {
      if (e.type === EventType.onClick) {

      } else {
      }
      this.hoverShape.event({x, y}, e.type, e)

    } else {
      this.children
        .forEach(shape => shape.event({x, y}, e.type, e))
    }
    if (e.type === EventType.onClick) {
      this.onClick(e)
    }
  }

  onClick(e: BaseEvent) {
    if (e.capture) return
    console.log('canvas画布-onClick',)
    if (this.selectedShape) {
      this.selectedShape.config.selected = false
    }
    this.selectedShape = null
    this.hoverShape = null
    this.draw()
  }

}