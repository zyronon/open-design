import { Shape } from "./Shape";
import { clear, draw } from "../utils";
import { cloneDeep, throttle } from "lodash";
import { BaseEvent, EventType, ShapeType } from "../type";
import EventBus from "../../../utils/event-bus";
import Frame from "./Frame";


export class CanvasUtil {
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
  static instance: CanvasUtil | null
  //当hover时，只向hover那个图形传递事件。不用递归整个树去判断isIn
  hoverShape: any
  inShape: any
  selectedShape: any
  childIsIn: boolean = false
  mode: ShapeType = ShapeType.SELECT
  startX: number = -1
  startY: number = -1
  isMouseDown: boolean = false
  drawShapeConfig: any = null

  constructor(canvas: HTMLCanvasElement) {
    this.init(canvas)
  }

  init(canvas: HTMLCanvasElement) {
    this.children = []
    let canvasRect = canvas.getBoundingClientRect()
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
    let { width, height } = canvasRect
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
      this.instance = new CanvasUtil(canvas)
    } else {
      if (canvas) {
        this.instance.init(canvas)
      }
    }
    return this.instance
  }

  setMode(mode: ShapeType) {
    console.log('mode', mode)
    this.mode = mode
  }

  print(list: any) {
    return list.map((item: any) => {
      if (item.config.children) {
        item.config.children = this.print(item.config.children)
      }
      return item.config
    })
  }

  print2() {
    return this.print(cloneDeep(this.children))
  }

  _render() {
    EventBus.emit('draw')
    // console.log('重绘所有图形')
    clear({
      x: 0, y: 0, w: this.canvas.width, h: this.canvas.height
    }, this.ctx)
    this.ctx.save()
    // console.log('this.children,', this.children)
    this.children.forEach(shape => shape.render(this.ctx, { abX: 0, abY: 0 }))
    this.ctx.restore()
  }

  isDesign() {
    return this.mode === ShapeType.SELECT
  }

  // draw = debounce(this._draw, 50)
  render = throttle(this._render, 0)
  handleEvent = throttle(e => this._handleEvent(e), 10)

  initEvent() {
    Object.values(EventType).forEach(eventName => {
      this.canvas.addEventListener(eventName, this.handleEvent)
    })
  }

  _handleEvent = (e: any) => {
    if (e.type === EventType.onMouseEnter) {
      if (this.mode !== ShapeType.SELECT) {
        document.body.style.cursor = "crosshair"
      }
      return
    }
    if (e.type === EventType.onMouseLeave) {
      if (this.mode !== ShapeType.SELECT) {
        document.body.style.cursor = "default"
      }
      return
    }
    //重写禁止传播事件
    e.stopPropagation = () => e.capture = true
    // console.log('e.type', e.type)
    let x = e.x - this.canvasRect.left
    let y = e.y - this.canvasRect.top
    let baseEvent = {
      e,
      coordinate: { x, y },
      type: e.type
    }

    if (!this.isDesign()) {
      if (e.type === EventType.onMouseMove) {
        this.onMouseMove(e, { x, y })
      }
      if (e.type === EventType.onMouseDown) {
        this.onMouseDown(e, { x, y })
      }
      if (e.type === EventType.onMouseUp) {
        this.onMouseUp(e, { x, y })
      }
      return;
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
    if (e.type === EventType.onMouseMove) {
      this.onMouseMove(e, { x, y })
    }
    if (e.type === EventType.onMouseDown) {
      this.onMouseDown(e, { x, y })
    }
    if (e.type === EventType.onMouseUp) {
      this.onMouseUp(e, { x, y })
    }
  }

  drawNewShape(coordinate: any) {
    this.render()
    let x = this.startX
    let y = this.startY
    let w = coordinate.x - this.startX
    let h = coordinate.y - this.startY
    this.drawShapeConfig = {
      "x": x,
      "y": y,
      "abX": x,
      "abY": y,
      "w": w,
      "h": h,
      "rotate": 0,
      "lineWidth": 2,
      "type": 102,
      "color": "gray",
      "radius": 1,
      "children": [],
      "borderColor": "rgb(216,216,216)",
      "fillColor": "rgb(216,216,216)",
    }
    draw(this.ctx, this.drawShapeConfig, { isSelect: true })
  }

  onMouseMove(e: BaseEvent, coordinate: any,) {
    console.log('canvas画布-onMouseMove')
    if (this.isMouseDown) this.drawNewShape(coordinate)
  }

  onMouseDown(e: BaseEvent, coordinate: any,) {
    if (e.capture) return
    console.log('canvas画布-onMouseDown')
    if (!this.isDesign()) {
      this.startX = coordinate.x
      this.startY = coordinate.y
      this.isMouseDown = true
    }
  }

  onMouseUp(e: BaseEvent, coordinate: any,) {
    console.log('canvas画布-onMouseUp')
    this.isMouseDown = false
    document.body.style.cursor = "default"
    this.setMode(ShapeType.SELECT)
    this.addChild(new Frame({ ...this.drawShapeConfig, isSelect: true }))
    // this.children.push(new Frame({ ...this.drawShapeConfig, isSelect: true }))
    this.render()
  }


  clearChild() {
    this.children = []
  }

  addChild(shape: Shape) {
    this.children.push(shape)
  }

}