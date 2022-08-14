import {Shape} from "./Shape";
import {clear, clearAll} from "../utils";
import {debounce, throttle} from "lodash";
import {BaseSyntheticEvent, SyntheticEvent} from "react";
import {BaseEvent, EventType} from "../type";


export class Canvas {
  // @ts-ignore
  private canvas: HTMLCanvasElement;
  // @ts-ignore
  public ctx: CanvasRenderingContext2D;
  // @ts-ignore
  private canvasRect: DOMRect;
  // @ts-ignore
  private dpr: number;
  // @ts-ignore
  private children: any[]
  static instance: Canvas | null
  //当hover时，只向hover那个图形传递事件。不用递归整个树去判断isIn
  hoverShape: any
  inShape: any
  selectedShape: any
  childIsIn: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    this.init(canvas)
  }

  init(canvas: HTMLCanvasElement) {
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
    } else {
      if (canvas) {
        this.instance.init(canvas)
      }
    }
    return this.instance
  }

  clearChild() {
    this.children = []
  }

  addChild(shape: Shape) {
    this.children.push(shape)
  }

  _draw() {
    // console.log('重绘所有图形')
    clear({
      x: 0, y: 0, w: this.canvas.width, h: this.canvas.height
    }, this.ctx)
    this.ctx.save()
    // console.log('this.children,', this.children)
    this.children.forEach(shape => shape.draw(this.ctx))
    this.ctx.restore()
  }

  // draw = debounce(this._draw, 50)
  draw = throttle(this._draw, 10)
  handleEvent = throttle(e => this._handleEvent(e), 10)

  initEvent() {
    Object.values(EventType).forEach(eventName => {
      this.canvas.addEventListener(eventName, this.handleEvent)
    })
  }

  _handleEvent = (e: any) => {
    //重写禁止伟播事件
    e.stopPropagation = () => e.capture = true
    // console.log('e.type', e.type)
    let x = e.x - this.canvasRect.left
    let y = e.y - this.canvasRect.top
    let baseEvent = {
      e,
      coordinate: {x, y},
      type: e.type
    }

    if (this.inShape) {
      this.inShape.event(baseEvent)
    } else {
      this.children
        .forEach(shape => shape.event(baseEvent, null, () => {
          this.childIsIn = true
        }))
      if (!this.childIsIn) {
        // this.hoverShape?.isHover = false
        // this.draw()
      }
      this.childIsIn = false
    }
    if (e.type === EventType.onMouseDown) {
      this.onMouseDown(e, {x, y})
    }
  }

  onMouseDown(e: BaseEvent, coordinate: any,) {
    if (e.capture) return
    console.log('canvas画布-onMouseDown')
    if (this.selectedShape) {
      this.selectedShape.isSelect = false
    }
    this.selectedShape = null
    this.hoverShape = null
    this.draw()
  }

}